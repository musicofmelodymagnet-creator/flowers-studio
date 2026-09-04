// ════════════════════════════════════════════════════════════
// CRITICAL CSS BUILDER — regenerates every page's
// <style id="critical-css"> block from the real sources of truth:
//   - css/styles.css              (shared chrome + shared components)
//   - js/chat-widget.js           (the chat popup's injected CSS)
//   - the page's own local <style> block(s) (page-specific rules)
// driven by scripts/critical-css/manifest.mjs, which lists which
// selectors from each source are critical for a given page.
//
// Run: node scripts/critical-css/build.mjs [--check]
//   --check   don't write anything; exit 1 if any page's block
//             would change (for CI / pre-deploy verification).
// ════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseTopLevel, selectCritical, renderNodes } from './toolkit.mjs';
import { extractChatWidgetCss } from './extract-chat-widget-css.mjs';
import { PAGES } from './manifest.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CHECK_ONLY = process.argv.includes('--check');

const stylesCssNodes = parseTopLevel(readFileSync(join(ROOT, 'css/styles.css'), 'utf8'));
const chatWidgetCssText = extractChatWidgetCss(join(ROOT, 'js/chat-widget.js'));

function keyframeName(prelude) {
  const m = prelude.match(/^@keyframes\s+(\S+)$/);
  return m ? m[1] : null;
}

function referencedKeyframes(nodes, bodies) {
  const combined = bodies.join(' ');
  return nodes.filter(n => {
    if (n.type !== 'atomic') return false;
    const name = keyframeName(n.prelude);
    if (!name) return false;
    return new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(combined);
  });
}

function extractLocalStylesheet(html) {
  const re = /<style([^>]*)>([\s\S]*?)<\/style>/g;
  let m, out = '';
  while ((m = re.exec(html))) {
    if (/id\s*=\s*"critical-css"/.test(m[1])) continue;
    out += m[2] + '\n';
  }
  return out;
}

function buildCriticalCss(pageConfig, localCssText) {
  const localNodes = parseTopLevel(localCssText);

  const sCss = selectCritical(stylesCssNodes, pageConfig.stylesCss);
  const sLocal = selectCritical(localNodes, pageConfig.local);

  const allBodies = [
    ...sCss.topRules.map(r => r.body),
    ...sCss.mediaBlocks.flatMap(b => b.rules.map(r => r.body)),
    ...sLocal.topRules.map(r => r.body),
    ...sLocal.mediaBlocks.flatMap(b => b.rules.map(r => r.body)),
  ];

  const stylesCssKeyframes = referencedKeyframes(stylesCssNodes, allBodies);
  const localKeyframes = referencedKeyframes(localNodes, allBodies);

  const parts = [];
  parts.push(renderNodes(sCss.topRules));
  parts.push(renderNodes(stylesCssKeyframes));
  parts.push(renderNodes(sLocal.topRules));
  parts.push(renderNodes(localKeyframes));
  if (pageConfig.chatWidget) parts.push(chatWidgetCssText);
  for (const block of sCss.mediaBlocks) parts.push(renderNodes([block]));
  for (const block of sLocal.mediaBlocks) parts.push(renderNodes([block]));

  return parts.join('');
}

let changedCount = 0;
let errorCount = 0;

for (const [relPath, pageConfig] of Object.entries(PAGES)) {
  const fullPath = join(ROOT, relPath);
  let html;
  try {
    html = readFileSync(fullPath, 'utf8');
  } catch (e) {
    console.error('SKIP (unreadable):', relPath, e.message);
    errorCount++;
    continue;
  }

  const criticalMatch = html.match(/<style id="critical-css">([\s\S]*?)<\/style>/);
  if (!criticalMatch) {
    console.error('SKIP (no critical-css block):', relPath);
    continue;
  }

  const localCssText = extractLocalStylesheet(html);
  let newCritical;
  try {
    newCritical = buildCriticalCss(pageConfig, localCssText);
  } catch (e) {
    console.error('BUILD FAILED:', relPath, e.message);
    errorCount++;
    continue;
  }

  const oldCritical = criticalMatch[1];
  if (newCritical === oldCritical) {
    console.log('unchanged:', relPath);
    continue;
  }

  changedCount++;
  console.log((CHECK_ONLY ? 'WOULD CHANGE:' : 'updating:'), relPath,
    `(${oldCritical.length} -> ${newCritical.length} bytes)`);

  if (!CHECK_ONLY) {
    const newHtml = html.replace(
      /<style id="critical-css">[\s\S]*?<\/style>/,
      () => `<style id="critical-css">${newCritical}</style>`
    );
    writeFileSync(fullPath, newHtml, 'utf8');
  }
}

console.log(`\n${changedCount} page(s) ${CHECK_ONLY ? 'would change' : 'updated'}, ${errorCount} error(s).`);
if (errorCount > 0) process.exit(1);
if (CHECK_ONLY && changedCount > 0) process.exit(1);
