// Pulls the CSS that js/chat-widget.js injects at runtime (the chat
// popup: .cw-*, @keyframes cw-*, @property --cw-rot) so the critical-css
// generator can inline the exact same rules verbatim, instead of a
// hand-copied snapshot that can drift from the real (single-sourced)
// widget CSS.
import { readFileSync } from 'fs';

export function extractChatWidgetCss(chatWidgetJsPath) {
  const src = readFileSync(chatWidgetJsPath, 'utf8');
  const startMarker = 'st.textContent = [';
  const start = src.indexOf(startMarker);
  if (start === -1) throw new Error('Could not find `st.textContent = [` in ' + chatWidgetJsPath);
  const arrayStart = start + startMarker.length - 1; // index of the '['
  const endMarker = '].join(\'\')';
  const end = src.indexOf(endMarker, arrayStart);
  if (end === -1) throw new Error('Could not find closing `].join(\'\')` in ' + chatWidgetJsPath);
  const arrayLiteral = src.slice(arrayStart, end + 1);
  // eslint-disable-next-line no-new-func -- trusted local source file, not user input
  const parts = new Function('return ' + arrayLiteral)();
  return parts.join('');
}
