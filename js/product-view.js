// ════════════════════════════════════════════════════════════
// PRODUCT PAGE LOGIC — shared across all flower-wall product pages
// (burgundy / green / pink / white). Per-product text (size
// descriptions + prices) is supplied by each page via
// window.PV2_SIZES / window.PV2_PRICES before this script loads.
// ════════════════════════════════════════════════════════════
(function () {

  // ── Media carousel (video slides first, then photos) ───────────
  const pv2Stage      = document.getElementById('pv2Stage');
  const pv2Slides     = Array.from(pv2Stage.children);
  const pv2Thumbs     = Array.from(document.querySelectorAll('.pv2-thumb'));
  const pv2CounterEl  = document.getElementById('pv2Counter');
  const pv2TRow       = document.getElementById('pv2ThumbsRow');
  // kept for the disabled lighting toggle below (photo slides only)
  const pv2Indoor     = pv2Slides.filter(s => s.dataset.pv2set === 'indoor');
  const pv2Outdoor    = pv2Slides.filter(s => s.dataset.pv2set === 'outdoor');
  let pv2Idx = 0;

  function pv2PauseSlide(slide) {
    const video = slide && slide.querySelector('video');
    if (video && !video.paused) video.pause();
  }

  function pv2GoTo(idx) {
    if (idx < 0) idx = pv2Slides.length - 1;
    if (idx >= pv2Slides.length) idx = 0;
    if (idx === pv2Idx) return;
    pv2PauseSlide(pv2Slides[pv2Idx]);
    pv2Idx = idx;
    pv2Slides.forEach(s => s.classList.remove('active'));
    pv2Slides[pv2Idx].classList.add('active');
    pv2Thumbs.forEach((th, i) => th.classList.toggle('active', i === pv2Idx));
    pv2CounterEl.textContent = (pv2Idx + 1) + ' / ' + pv2Slides.length;
  }

  document.getElementById('pv2Prev').addEventListener('click', () => pv2GoTo(pv2Idx - 1));
  document.getElementById('pv2Next').addEventListener('click', () => pv2GoTo(pv2Idx + 1));
  pv2Thumbs.forEach((th, i) => th.addEventListener('click', () => pv2GoTo(i)));

  let pv2TouchX = 0;
  pv2Stage.addEventListener('touchstart', e => { pv2TouchX = e.changedTouches[0].screenX; }, { passive: true });
  pv2Stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - pv2TouchX;
    if (Math.abs(dx) > 40) pv2GoTo(pv2Idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
  pv2Stage.addEventListener('click', e => {
    const active = pv2Slides[pv2Idx];
    if (active && active.classList.contains('pv2-video-wrap')) {
      pv2ToggleVideoPlay(active);
      return;
    }
    const rect = pv2Stage.getBoundingClientRect();
    pv2GoTo(e.clientX < rect.left + rect.width / 2 ? pv2Idx - 1 : pv2Idx + 1);
  });

  // ── Video tap-to-pause overlay ──────────────────────────────────
  const PV2_ICON_PLAY  = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const PV2_ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const pv2IconTimers  = new WeakMap();

  function pv2ToggleVideoPlay(wrap) {
    const video = wrap.querySelector('video');
    const icon  = wrap.querySelector('.pv2-video-toggle-icon');
    if (!video || !icon) return;
    clearTimeout(pv2IconTimers.get(wrap));
    if (video.paused) {
      video.muted = false; // a real click is a user gesture, safe to play with sound
      video.play().catch(() => {});
      icon.innerHTML = PV2_ICON_PLAY;
      icon.classList.add('show');
      pv2IconTimers.set(wrap, setTimeout(() => icon.classList.remove('show'), 1000));
    } else {
      video.pause();
      icon.innerHTML = PV2_ICON_PAUSE;
      icon.classList.add('show');
    }
  }

  // ── Video progress bar + elapsed/total time ─────────────────────
  function pv2FormatTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, '0');
    return m + ':' + sec;
  }
  document.querySelectorAll('.pv2-video-wrap').forEach(wrap => {
    const video = wrap.querySelector('video');
    const fill  = wrap.querySelector('.pv2-video-progress-fill');
    const timeEl = wrap.querySelector('.pv2-video-time');
    if (!video || !fill || !timeEl) return;
    const update = () => {
      const dur = video.duration || 0;
      fill.style.width = (dur ? (video.currentTime / dur) * 100 : 0) + '%';
      timeEl.textContent = pv2FormatTime(video.currentTime) + ' / ' + pv2FormatTime(dur);
    };
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);
    update();
  });

  // The first slide autoplays 3s after load, if it's a video and the
  // visitor hasn't already navigated away from it.
  setTimeout(() => {
    const first = pv2Slides[0];
    if (first && pv2Idx === 0 && first.classList.contains('pv2-video-wrap')) {
      const video = first.querySelector('video');
      if (video && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    }
  }, 3000);

  // ── Lighting toggle ───────────────────────────────────────────
  // Disabled 2026-09-07 per client request (markup commented out in each
  // product page too) — kept here for possible reactivation later. Note:
  // navigation now runs over the unified pv2Slides array (videos + photos
  // together), not a swappable pv2Set — reactivating this would need
  // pv2GoTo/pv2Idx adapted to filter within pv2Slides instead.
  // document.querySelectorAll('.pv2-light-btn').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     const isOutdoor = btn.dataset.pv2light === 'outdoor';
  //     const newSet = isOutdoor ? pv2Outdoor : pv2Indoor;
  //     if (newSet.length === 0) return;
  //     document.querySelectorAll('.pv2-light-btn').forEach(b => b.classList.remove('active'));
  //     btn.classList.add('active');
  //     pv2TRow.style.opacity = isOutdoor ? '0.35' : '';
  //     pv2TRow.style.pointerEvents = isOutdoor ? 'none' : '';
  //   });
  // });

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

  // ── CTA buttons scroll to the contact form ─────────────────────
  document.querySelectorAll('.product-cta').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var sec = document.getElementById('pctaSection');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

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
