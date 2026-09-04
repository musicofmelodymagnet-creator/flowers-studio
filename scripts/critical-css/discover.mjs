// One-time discovery pass: reads every page's CURRENT (hand-copied)
// <style id="critical-css"> block and classifies each selector it
// contains as "chrome" (also defined in css/styles.css), "chat-widget"
// (also defined in js/chat-widget.js's injected CSS), or "local"
// (page-specific, not defined anywhere else). Prints a manifest.mjs
// body to stdout — reviewed once by hand, then checked in.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parseTopLevel, canonicalKey } from './toolkit.mjs';
import { extractChatWidgetCss } from './extract-chat-widget-css.mjs';

const ROOT = process.argv[2] || '.';

function findPages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name.startsWith('_')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'florinsky-design-system') continue;
      findPages(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function allSelectorsOf(nodes) {
  const sels = [];
  for (const node of nodes) {
    if (node.type === 'rule') sels.push(node.selectorText);
    else if (node.type === 'atrule-block') for (const r of node.rules) sels.push(r.selectorText);
  }
  return sels;
}

const stylesCssNodes = parseTopLevel(readFileSync(join(ROOT, 'css/styles.css'), 'utf8'));
// Map canonical key -> the exact selectorText as written in the source
// file, so discovered manifest entries use that source's own spelling.
const stylesCssBySelector = new Map(allSelectorsOf(stylesCssNodes).map(s => [canonicalKey(s), s]));
const stylesCssAtomicPreludes = new Set(stylesCssNodes.filter(n => n.type === 'atomic').map(n => n.prelude));

const chatWidgetCss = extractChatWidgetCss(join(ROOT, 'js/chat-widget.js'));
const chatWidgetNodes = parseTopLevel(chatWidgetCss);
const chatWidgetSelectors = new Set(allSelectorsOf(chatWidgetNodes).map(canonicalKey));
const chatWidgetAtomicPreludes = new Set(chatWidgetNodes.filter(n => n.type === 'atomic').map(n => n.prelude));

const pages = findPages(ROOT).filter(p => !p.includes('/florinsky-design-system/'));

const perPage = {};

for (const pagePath of pages) {
  const html = readFileSync(pagePath, 'utf8');
  const m = html.match(/<style id="critical-css">([\s\S]*?)<\/style>/);
  if (!m) continue;
  let css = m[1];
  if (css.startsWith('"')) css = css.slice(1); // known stray-quote bug (index.html)
  let nodes;
  try { nodes = parseTopLevel(css); } catch (e) { console.error('PARSE FAIL', pagePath, e.message); continue; }

  const rel = relative(ROOT, pagePath);
  const stylesCss = [];
  const local = [];
  let hasChatWidget = false;
  const localAtomics = [];

  // A handful of pages spell a selector slightly differently from
  // css/styles.css in a way plain whitespace canonicalization can't fix
  // (e.g. a bare `::before` instead of the compound `*::before` the CSS
  // spec treats as equivalent). Map those known spellings onto the
  // selector text styles.css actually uses, so they still resolve to the
  // real shared rule instead of being misclassified as page-local.
  const SELECTOR_ALIASES = new Map([
    ['*,::before,::after', '*, *::before, *::after'],
  ]);

  function classify(sel) {
    const key = canonicalKey(SELECTOR_ALIASES.get(canonicalKey(sel)) ?? sel);
    if (stylesCssBySelector.has(key)) {
      const canonical = stylesCssBySelector.get(key);
      if (!stylesCss.includes(canonical)) stylesCss.push(canonical);
      return;
    }
    if (chatWidgetSelectors.has(key)) { hasChatWidget = true; return; }
    if (!local.includes(sel)) local.push(sel);
  }

  for (const node of nodes) {
    if (node.type === 'rule') {
      classify(node.selectorText);
    } else if (node.type === 'atrule-block') {
      for (const r of node.rules) classify(r.selectorText);
    } else if (node.type === 'atomic') {
      if (stylesCssAtomicPreludes.has(node.prelude)) { /* already in css/styles.css, nothing to record */ }
      else if (chatWidgetAtomicPreludes.has(node.prelude)) { hasChatWidget = true; }
      else if (!localAtomics.includes(node.prelude)) { localAtomics.push(node.prelude); }
    }
  }

  perPage[rel] = { chatWidget: hasChatWidget, stylesCss, local, localAtomics };
}

console.log('// Auto-discovered by scripts/critical-css/discover.mjs — review before trusting.');
console.log('export const PAGES = ' + JSON.stringify(perPage, null, 2) + ';');
