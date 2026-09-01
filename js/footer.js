/* ── Shared footer initialiser ───────────────────────────────────────────────
   Called after the footer HTML is fetched and injected into #footer-root.
   Handles: "Event Rentals" links pointing to this page's own contact form
   when it has one, and "active" highlighting for the current page's link.
   ─────────────────────────────────────────────────────────────────────────── */
function initFooter() {
  var hasOwnContact = !!document.getElementById('inquiry-root');
  if (hasOwnContact) {
    document.querySelectorAll('.footer-contact-link').forEach(function (a) {
      a.setAttribute('href', '#contact');
    });
  }

  var path = location.pathname;
  var navKey = null;
  if (path === '/terms-of-use.html') navKey = 'terms';
  else if (path === '/privacy-policy.html') navKey = 'privacy';
  else if (path === '/faq.html') navKey = 'faq';
  else if (path === '/flower-wall-guide/' || path === '/flower-wall-guide/index.html') navKey = 'guide';

  if (navKey) {
    var link = document.querySelector('[data-footer-nav="' + navKey + '"]');
    if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
  }
}
