// Tests for the generate_lead GA4 event wired into the shared inquiry form
// (js/inquiry-form.js, markup in assets/includes/inquiry-form.html — the
// single source used by every page on the site, per project convention).
//
// Run with: npm test   (installs jsdom as a dev-only dependency; the
// deployed site itself has no build step and is unaffected by this).

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const formHtml   = readFileSync(path.join(ROOT, 'assets/includes/inquiry-form.html'), 'utf8');
const formScript = readFileSync(path.join(ROOT, 'js/inquiry-form.js'), 'utf8');

// Fields the real handler reads before it ever touches the network. Filled
// with harmless dummy values so the flow under test reaches the fetch call;
// their content is never asserted on and never appears in any GA4 payload.
const DUMMY_FIELDS = {
  'field-name': 'Test', 'field-lastname': 'User', 'field-email': 't@example.com',
  'field-phone': '5555555555', 'field-date': '', 'field-location': 'Test Venue',
  'field-event-type': 'Wedding', 'field-wall-color': 'White', 'field-message': 'hi'
};

function makeDom(pathname) {
  const dom = new JSDOM(`<!doctype html><html><body>${formHtml}</body></html>`, {
    url: 'https://florinsky.ca' + (pathname || '/client-care.html'),
    runScripts: 'outside-only'
  });
  // grecaptcha intentionally left undefined: the handler's own code treats
  // that as "no token available" and resolves immediately (see inquiry-form.js).
  dom.window.eval(formScript);
  const document = dom.window.document;
  Object.keys(DUMMY_FIELDS).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = DUMMY_FIELDS[id];
  });
  return dom;
}

function gtagSpy() {
  const calls = [];
  const gtag = (...args) => calls.push(args);
  return { gtag, calls };
}

function flush() {
  // fetch/json resolution in the handler is all microtasks; one macrotask
  // tick is guaranteed to run after every pending microtask has drained.
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function submitAndWait(dom) {
  const form = dom.window.document.getElementById('inquiryForm');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await flush();
}

// ── Pure guard logic (no DOM at all) ────────────────────────────────────────
describe('createLeadEventGuard (pure)', async () => {
  const { createLeadEventGuard, buildGenerateLeadPayload } = await import('../js/inquiry-form.js');

  test('fires the send function exactly once even when called twice', () => {
    const sent = [];
    const fire = createLeadEventGuard((name, params) => sent.push([name, params]));
    assert.equal(fire('/a.html'), true);
    assert.equal(fire('/a.html'), false);
    assert.equal(sent.length, 1);
    assert.equal(sent[0][0], 'generate_lead');
  });

  test('payload contains only the three approved technical params — no PII', () => {
    const payload = buildGenerateLeadPayload('/flower-walls/burgundy-flower-wall/');
    assert.deepEqual(Object.keys(payload).sort(), ['form_location', 'form_name', 'method']);
    assert.equal(payload.method, 'contact_form');
    assert.equal(payload.form_location, '/flower-walls/burgundy-flower-wall/');
    assert.equal(typeof payload.form_name, 'string');
    assert.ok(payload.form_name.length > 0);
  });

  test('does not count as fired when the send function reports failure (e.g. gtag missing)', () => {
    let attempts = 0;
    const fire = createLeadEventGuard(() => { attempts += 1; return false; });
    assert.equal(fire('/a.html'), false, 'must report failure, not success');
    assert.equal(attempts, 1);
  });

  test('a failed attempt (gtag unavailable) does not permanently block a later successful one', () => {
    let gtagAvailable = false;
    const fire = createLeadEventGuard(() => gtagAvailable);
    assert.equal(fire('/a.html'), false, 'gtag missing this attempt — not fired');
    gtagAvailable = true;
    assert.equal(fire('/a.html'), true, 'gtag now available — actually fires');
    assert.equal(fire('/a.html'), false, 'now locked after the real success');
  });
});

// ── Full submit-handler integration, via a jsdom copy of the real markup ───
describe('inquiry form submit → generate_lead wiring', () => {
  test('server-confirmed success fires exactly one generate_lead with safe params', async () => {
    const dom = makeDom('/client-care.html');
    const { gtag, calls } = gtagSpy();
    dom.window.gtag = gtag;
    dom.window.fetch = async () => ({ json: async () => ({ success: true, message: 'Thanks!' }) });
    dom.window.initInquiryForm();

    await submitAndWait(dom);

    const leadCalls = calls.filter((c) => c[0] === 'event' && c[1] === 'generate_lead');
    assert.equal(leadCalls.length, 1, 'expected exactly one generate_lead event');
    const [, , params] = leadCalls[0];
    assert.equal(params.method, 'contact_form');
    assert.equal(params.form_location, '/client-care.html');
    assert.deepEqual(Object.keys(params).sort(), ['form_location', 'form_name', 'method']);
    // No field the user typed into should ever reach the payload.
    const serialized = JSON.stringify(params).toLowerCase();
    for (const leak of ['test', 'example.com', '5555555555', 'test venue', 'hi']) {
      assert.ok(!serialized.includes(leak), `payload leaked user input: ${leak}`);
    }
  });

  test('server-reported failure (incl. validation rejection) never fires the event', async () => {
    const dom = makeDom('/client-care.html');
    const { gtag, calls } = gtagSpy();
    dom.window.gtag = gtag;
    // The form has novalidate — validation is server-side and comes back
    // through the same {success:false} shape as any other rejected submit.
    dom.window.fetch = async () => ({ json: async () => ({ success: false, message: 'Please fill in all required fields.' }) });
    dom.window.initInquiryForm();

    await submitAndWait(dom);

    assert.equal(calls.filter((c) => c[1] === 'generate_lead').length, 0);
  });

  test('network/server error (fetch rejects) never fires the event', async () => {
    const dom = makeDom('/client-care.html');
    const { gtag, calls } = gtagSpy();
    dom.window.gtag = gtag;
    dom.window.fetch = async () => { throw new Error('network down'); };
    dom.window.initInquiryForm();

    await submitAndWait(dom);

    assert.equal(calls.filter((c) => c[1] === 'generate_lead').length, 0);
  });

  test('nothing fires merely from clicking submit, before the server has responded', async () => {
    const dom = makeDom('/client-care.html');
    const { gtag, calls } = gtagSpy();
    dom.window.gtag = gtag;
    let resolveFetch;
    dom.window.fetch = () => new Promise((resolve) => { resolveFetch = resolve; });
    dom.window.initInquiryForm();

    const form = dom.window.document.getElementById('inquiryForm');
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    await flush();
    assert.equal(calls.filter((c) => c[1] === 'generate_lead').length, 0, 'must not fire before the fetch resolves');

    resolveFetch({ json: async () => ({ success: true, message: 'Thanks!' }) });
    await flush();
    assert.equal(calls.filter((c) => c[1] === 'generate_lead').length, 1, 'fires once the success response actually arrives');
  });

  test('a double-fired submit handler (double click / re-entrant call) still yields exactly one event', async () => {
    const dom = makeDom('/gallery.html');
    const { gtag, calls } = gtagSpy();
    dom.window.gtag = gtag;
    dom.window.fetch = async () => ({ json: async () => ({ success: true, message: 'Thanks!' }) });
    dom.window.initInquiryForm();

    const form = dom.window.document.getElementById('inquiryForm');
    // Two submits back to back, same as a fast double click on the button.
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    await flush();

    assert.equal(calls.filter((c) => c[1] === 'generate_lead').length, 1);
  });

  test('a successful submit with gtag unavailable does not throw and is not counted as fired', async () => {
    const dom = makeDom('/client-care.html');
    // No dom.window.gtag assigned at all — simulates a blocked/not-yet-loaded tag.
    dom.window.fetch = async () => ({ json: async () => ({ success: true, message: 'Thanks!' }) });
    dom.window.initInquiryForm();

    await assert.doesNotReject(submitAndWait(dom));
    // Nothing to assert on calls (there's no spy — gtag genuinely doesn't
    // exist here); the point is this path must not throw inside the
    // success branch just because the analytics call couldn't be made.
    assert.equal(dom.window.document.getElementById('submitBtn').textContent, 'Sent ✓');
  });
});
