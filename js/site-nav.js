// ════════════════════════════════════════════════════════════
// SITE NAVIGATION — shared across every page (desktop nav-pill,
// mobile top bar, mobile nav overlay). Markup is fetched from
// /assets/includes/site-nav.html; this file wires it up once
// inserted. Each page sets window.NAV_ACTIVE to its own nav key
// ('home' | 'gallery' | 'advantages' | 'kind-words' | 'about' |
// 'faq' | 'guide' | 'contacts' | left unset for pages with no
// matching nav item) before calling initSiteNav().
// ════════════════════════════════════════════════════════════
function initSiteNav() {

  // ── Mark the active link ─────────────────────────────────────
  if (window.NAV_ACTIVE) {
    document.querySelectorAll('[data-navkey="' + window.NAV_ACTIVE + '"]').forEach(function (a) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    });
  }

  // ── Sticky nav (scroll-up reveal) ────────────────────────────
  (function () {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y > lastY + 5)      nav.classList.add('nav--hidden');
        else if (y < lastY - 5) nav.classList.remove('nav--hidden');
        lastY = y; ticking = false;
      });
    }, { passive: true });
  })();

  // ── Mobile hamburger menu ────────────────────────────────────
  var mobileBurger  = document.getElementById('mobileBurger');
  var mobileOverlay = document.getElementById('mobileOverlay');
  if (!mobileBurger || !mobileOverlay) return;

  function toggleMenu(close) {
    var open = mobileOverlay.classList.contains('open') || close;
    mobileOverlay.classList.toggle('open', !open);
    mobileBurger.classList.toggle('open', !open);
    mobileBurger.setAttribute('aria-expanded', String(!open));
    mobileOverlay.setAttribute('aria-hidden', String(open));
    var mobileTopBar = document.getElementById('mobileTop');
    if (mobileTopBar) { mobileTopBar.classList.toggle('menu-open', !open); if (!open) mobileTopBar.classList.remove('nav-hidden'); }
    var scrollY = open ? parseInt(document.body.dataset.scrollY || '0') : window.scrollY;
    if (!open) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.width = '100%';
      document.body.dataset.scrollY = scrollY;
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
  }
  mobileBurger.addEventListener('click', function () { toggleMenu(false); });
  mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(function (l) {
    l.addEventListener('click', function () { toggleMenu(true); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) toggleMenu(true);
  });

  // ── Mobile top bar: shadow + hide-on-scroll ──────────────────
  (function () {
    var b = document.getElementById('mobileTop');
    if (!b) return;
    var l = 0, t = false;
    function s() {
      var y = window.scrollY;
      if (y > 0) { b.classList.add('nav-shadow'); } else { b.classList.remove('nav-shadow', 'nav-scrolled', 'nav-hidden'); l = 0; t = false; return; }
      if (y > 8) { b.classList.add('nav-scrolled'); if (y > l + 4) b.classList.add('nav-hidden'); else if (y < l - 4) b.classList.remove('nav-hidden'); }
      else { b.classList.remove('nav-scrolled', 'nav-hidden'); }
      l = y; t = false;
    }
    window.addEventListener('scroll', function () { if (!t) { requestAnimationFrame(s); t = true; } }, { passive: true });
  })();
}
