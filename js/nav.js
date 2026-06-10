// Sticky nav — slides in from top when scrolling up, hides when scrolling down
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = window.scrollY;
      if (y < 100) {
        nav.classList.remove('nav--visible');
      } else if (y < lastY - 5) {
        nav.classList.add('nav--visible');
      } else if (y > lastY + 5) {
        nav.classList.remove('nav--visible');
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
})();
