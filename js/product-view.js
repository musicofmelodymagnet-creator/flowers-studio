// ════════════════════════════════════════════════════════════
// PRODUCT PAGE LOGIC — shared across all flower-wall product pages
// (burgundy / green / pink / white). Per-product text (size
// descriptions + prices) is supplied by each page via
// window.PV2_SIZES / window.PV2_PRICES before this script loads.
// ════════════════════════════════════════════════════════════
(function () {

  // ── Top tabs (Photos / Video) ────────────────────────────────
  document.querySelectorAll('.pv2-topbar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.pv2tab;
      document.querySelectorAll('.pv2-topbar-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const isPhoto = target === 'photos';
      document.getElementById('pv2-pane-photos').classList.toggle('active', isPhoto);
      document.getElementById('pv2-pane-video').classList.toggle('active', !isPhoto);
      if (isPhoto) document.getElementById('pv2MainVideo').pause();
      document.getElementById('pv2Counter').classList.toggle('hidden', !isPhoto);
      document.getElementById('pv2Prev').style.display = isPhoto ? '' : 'none';
      document.getElementById('pv2Next').style.display = isPhoto ? '' : 'none';
      const lb = document.getElementById('pv2LightingBar');
      lb.style.opacity = isPhoto ? '' : '0.45';
      lb.style.pointerEvents = isPhoto ? '' : 'none';
      const tr = document.getElementById('pv2ThumbsRow');
      tr.style.opacity = isPhoto ? '' : '0.35';
      tr.style.pointerEvents = isPhoto ? '' : 'none';
      if (!isPhoto && pv2PalettePanel.classList.contains('open')) pv2TogglePalette(true);
    });
  });

  // ── Video sub-tabs (Intro / Speed Build) ───────────────────────
  document.querySelectorAll('.pv2-vsub').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      document.querySelectorAll('.pv2-vsub').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const video = document.getElementById('pv2MainVideo');
      video.pause();
      video.src = btn.dataset.src;
      video.load();
      document.getElementById('pv2VidCaption').textContent = btn.dataset.caption;
    });
  });

  // ── Carousel ─────────────────────────────────────────────────
  const pv2AllImgs   = Array.from(document.querySelectorAll('.pv2-img'));
  const pv2Thumbs    = Array.from(document.querySelectorAll('.pv2-thumb'));
  const pv2CounterEl = document.getElementById('pv2Counter');
  const pv2TRow      = document.getElementById('pv2ThumbsRow');
  const pv2Indoor    = pv2AllImgs.filter(i => i.dataset.pv2set === 'indoor');
  const pv2Outdoor   = pv2AllImgs.filter(i => i.dataset.pv2set === 'outdoor');
  let pv2Set = pv2Indoor;
  let pv2Idx = 0;

  function pv2GoTo(idx) {
    if (idx < 0) idx = pv2Set.length - 1;
    if (idx >= pv2Set.length) idx = 0;
    pv2Idx = idx;
    pv2AllImgs.forEach(i => i.classList.remove('active'));
    pv2Set[pv2Idx].classList.add('active');
    if (pv2Set === pv2Indoor) {
      pv2Thumbs.forEach((th, i) => th.classList.toggle('active', i === pv2Idx));
    }
    pv2CounterEl.textContent = (pv2Idx + 1) + ' / ' + pv2Set.length;
  }

  document.getElementById('pv2Prev').addEventListener('click', () => pv2GoTo(pv2Idx - 1));
  document.getElementById('pv2Next').addEventListener('click', () => pv2GoTo(pv2Idx + 1));
  pv2Thumbs.forEach((th, i) => th.addEventListener('click', () => {
    if (pv2Set === pv2Indoor) pv2GoTo(i);
  }));

  let pv2TouchX = 0;
  const pv2PhotoPane = document.getElementById('pv2-pane-photos');
  pv2PhotoPane.addEventListener('touchstart', e => { pv2TouchX = e.changedTouches[0].screenX; }, { passive: true });
  pv2PhotoPane.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - pv2TouchX;
    if (Math.abs(dx) > 40) pv2GoTo(pv2Idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
  pv2PhotoPane.addEventListener('click', e => {
    const rect = pv2PhotoPane.getBoundingClientRect();
    pv2GoTo(e.clientX < rect.left + rect.width / 2 ? pv2Idx - 1 : pv2Idx + 1);
  });

  // ── Lighting toggle ───────────────────────────────────────────
  document.querySelectorAll('.pv2-light-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOutdoor = btn.dataset.pv2light === 'outdoor';
      const newSet = isOutdoor ? pv2Outdoor : pv2Indoor;
      if (newSet.length === 0) return;
      document.querySelectorAll('.pv2-light-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pv2Set = newSet;
      pv2TRow.style.opacity = isOutdoor ? '0.35' : '';
      pv2TRow.style.pointerEvents = isOutdoor ? 'none' : '';
      pv2GoTo(0);
    });
  });

  // ── Colour palette ────────────────────────────────────────────
  const pv2PaletteBtn   = document.getElementById('pv2PaletteBtn');
  const pv2PalettePanel = document.getElementById('pv2PalettePanel');

  function pv2TogglePalette(forceClose) {
    const isOpen = pv2PalettePanel.classList.contains('open') || forceClose;
    pv2PalettePanel.classList.toggle('open', !isOpen);
    pv2PaletteBtn.classList.toggle('active', !isOpen);
    pv2PaletteBtn.setAttribute('aria-expanded', String(!isOpen));
    pv2PalettePanel.setAttribute('aria-hidden', String(isOpen));
  }
  pv2PaletteBtn.addEventListener('click', () => pv2TogglePalette(false));

  // ── Content tabs ──────────────────────────────────────────────
  document.querySelectorAll('.pv2-ctab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pv2-ctab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.pv2-ctab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const pane = document.getElementById('pv2-ctab-' + tab.dataset.ctab);
      if (pane) pane.classList.add('active');
    });
  });

  // ── Frame type ────────────────────────────────────────────────
  const PV2_FRAMES = {
    standard:   'Lightweight aluminium frame with adjustable height. Ideal for smooth indoor floors — ballrooms, studios, and event halls.',
    heavy:      'Reinforced steel-core frame with a weighted base. Rated for high-traffic venues, outdoor terraces, and large-scale events.',
    allterrain: 'Spike-base system with articulating legs. Installs securely on grass, gravel, and uneven outdoor surfaces.'
  };
  document.querySelectorAll('#pv2FrameOptions .size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#pv2FrameOptions .size-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      document.getElementById('pv2FrameDesc').textContent = PV2_FRAMES[btn.dataset.frame];
    });
  });

  // ── Fill density ──────────────────────────────────────────────
  const PV2_DENSITY = {
    classic: '85% bloom coverage — lush and natural, with organic depth and shadow throughout the composition.',
    full:    '100% bloom coverage — an immersive wall of flowers with no visible structure. Maximum visual impact for photography and large events.'
  };
  document.querySelectorAll('#pv2DensityOptions .size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#pv2DensityOptions .size-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      document.getElementById('pv2DensityDesc').textContent = PV2_DENSITY[btn.dataset.density];
    });
  });

  // ── Size selector (per-product text/prices via window.PV2_SIZES / PV2_PRICES) ──
  const PV2_SIZES  = window.PV2_SIZES  || {};
  const PV2_PRICES = window.PV2_PRICES || {};
  const pv2SizeDescEl = document.getElementById('pv2SizeDesc');

  // Sliding "frame" that glides between size buttons instead of each
  // button's own highlight snapping on/off independently.
  const pv2SizeOptionsEl = document.getElementById('pv2SizeOptions');
  let pv2SizeSlider = null;
  function movePv2SizeSlider(btn, animate) {
    if (!pv2SizeSlider || !btn) return;
    if (!animate) pv2SizeSlider.style.transition = 'none';
    pv2SizeSlider.style.width = btn.offsetWidth + 'px';
    pv2SizeSlider.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    if (!animate) {
      pv2SizeSlider.offsetWidth; // reflow, then restore the CSS transition
      pv2SizeSlider.style.transition = '';
    }
  }
  if (pv2SizeOptionsEl) {
    pv2SizeSlider = document.createElement('span');
    pv2SizeSlider.className = 'size-slider';
    pv2SizeOptionsEl.insertBefore(pv2SizeSlider, pv2SizeOptionsEl.firstChild);
    pv2SizeOptionsEl.classList.add('has-size-slider');
    const resyncPv2SizeSlider = () => movePv2SizeSlider(pv2SizeOptionsEl.querySelector('.size-btn.active'), false);
    resyncPv2SizeSlider();
    // The main stylesheet loads via a non-blocking preload swap, so this
    // script can run before it's applied — re-measure once everything
    // (styles, fonts, images) has actually finished loading.
    window.addEventListener('load', resyncPv2SizeSlider);
    window.addEventListener('resize', resyncPv2SizeSlider, { passive: true });
  }

  document.querySelectorAll('#pv2SizeOptions .size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#pv2SizeOptions .size-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      movePv2SizeSlider(btn, true);
      pv2SizeDescEl.style.opacity = '0';
      const priceEl = document.getElementById('pv2PriceVal');
      if (priceEl) priceEl.style.opacity = '0';
      setTimeout(() => {
        pv2SizeDescEl.textContent = PV2_SIZES[btn.dataset.pv2size];
        pv2SizeDescEl.style.opacity = '1';
        if (priceEl) {
          priceEl.textContent = PV2_PRICES[btn.dataset.pv2size];
          priceEl.style.opacity = '1';
        }
      }, 150);
    });
  });

  // ── Expandable CTA ────────────────────────────────────────────
  (function () {
    var pctaOpenBtn  = document.getElementById('pctaOpenBtn');
    var pctaCard     = document.getElementById('pctaCard');
    var pctaFormWrap = document.getElementById('pctaFormWrap');

    function pctaOpen() {
      pctaCard.classList.add('open');
      pctaFormWrap.classList.add('open');
      pctaFormWrap.setAttribute('aria-hidden', 'false');
      pctaOpenBtn.setAttribute('aria-expanded', 'true');
    }

    function pctaClose() {
      pctaCard.classList.remove('open');
      pctaFormWrap.classList.remove('open');
      pctaFormWrap.setAttribute('aria-hidden', 'true');
      pctaOpenBtn.setAttribute('aria-expanded', 'false');
    }

    pctaOpenBtn.addEventListener('click', function () {
      if (pctaCard.classList.contains('open')) pctaClose(); else pctaOpen();
    });

    document.querySelectorAll('.product-cta').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (!pctaCard.classList.contains('open')) pctaOpen();
        setTimeout(function () {
          var sec = document.getElementById('pctaSection');
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      });
    });
  })();

  // ── FAQ accordion ─────────────────────────────────────────────
  initAccordion('.pfaq-item');

  // ── Size help popup ───────────────────────────────────────────
  const pv2SizeHelp  = document.getElementById('pv2SizeHelp');
  const pv2SizePopup = document.getElementById('pv2SizePopup');
  pv2SizeHelp.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = pv2SizePopup.classList.contains('open');
    pv2SizePopup.classList.toggle('open', !isOpen);
    pv2SizeHelp.setAttribute('aria-expanded', String(!isOpen));
    pv2SizePopup.setAttribute('aria-hidden', String(isOpen));
  });
  document.addEventListener('click', e => {
    if (!pv2SizeHelp.contains(e.target) && !pv2SizePopup.contains(e.target)) {
      pv2SizePopup.classList.remove('open');
      pv2SizeHelp.setAttribute('aria-expanded', 'false');
      pv2SizePopup.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      pv2SizePopup.classList.remove('open');
      pv2SizeHelp.setAttribute('aria-expanded', 'false');
    }
  });

})();
