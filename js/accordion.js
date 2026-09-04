// ════════════════════════════════════════════════════════════
// ACCORDION — shared toggle logic for any list of items shaped
// as <div class="item"><button>...</button><div class="panel">
// <div>...inner content...</div></div></div>. Only one item in
// the group stays open; opening measures the inner element's
// natural height to animate max-height.
// ════════════════════════════════════════════════════════════
function initAccordion(itemSelector, opts) {
  opts = opts || {};

  function toggle(item) {
    var btn    = item.querySelector(':scope > button');
    var panel  = item.querySelector(':scope > div');
    var inner  = panel.firstElementChild;
    var isOpen = item.classList.contains('open');

    document.querySelectorAll(itemSelector + '.open').forEach(function (o) {
      o.classList.remove('open');
      o.querySelector(':scope > button').setAttribute('aria-expanded', 'false');
      o.querySelector(':scope > div').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      item.classList.add('read');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = inner.scrollHeight + 'px';
    }
  }

  document.querySelectorAll(itemSelector).forEach(function (item) {
    var btn   = item.querySelector(':scope > button');
    var panel = item.querySelector(':scope > div');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () { toggle(item); });
    if (opts.closeOnPanelClick) panel.addEventListener('click', function () { toggle(item); });
  });
}
