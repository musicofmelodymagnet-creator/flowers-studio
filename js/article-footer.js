// ════════════════════════════════════════════════════════════
// ARTICLE FOOTER — shared across every flower-wall-guide article:
// the "More Flower Wall Guide" carousel (rendered from each page's
// own window.MORE_GUIDE_ARTICLES data, so no article ever lists
// itself) and the "Our Flower Walls" carousel (fully shared markup,
// fetched from /assets/includes/article-flower-walls.html). Call
// initArticleFooter() once that markup is in the DOM — the page
// itself still owns the #acTrack/#acPrev/#acNext container, since
// that part isn't fetched.
// ════════════════════════════════════════════════════════════
function renderMoreGuideCards() {
  const track = document.getElementById('acTrack');
  if (!track || !Array.isArray(window.MORE_GUIDE_ARTICLES)) return;
  track.innerHTML = window.MORE_GUIDE_ARTICLES.map(a => `
    <article class="ac-card">
      <div class="ac-photo-wrap">
        <img class="ac-card-photo" src="${a.photo}" alt="${a.alt}" loading="lazy" />
      </div>
      <div class="ac-card-body">
        <span class="ac-card-meta">${a.meta}</span>
        <a href="${a.url}" class="ac-card-title">${a.title}</a>
        <p class="ac-card-desc">${a.desc}</p>
        <a href="${a.url}" class="ac-card-link">
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </article>
  `).join('');
}

// Shared infinite-loop carousel behaviour (clone-and-shuffle variant
// used by "More Flower Wall Guide", plain clone variant used by
// "Our Flower Walls"). `opts.shuffle` + `opts.clickableCards` toggle
// the two small behavioural differences between the two carousels.
function initLoopCarousel(trackId, prevId, nextId, cardSelector, opts) {
  opts = opts || {};
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track || !prevBtn || !nextBtn) return;

  let cards = Array.from(track.querySelectorAll(cardSelector));
  if (opts.shuffle) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (i !== j) track.insertBefore(cards[j], cards[i].nextSibling);
    }
    cards = Array.from(track.querySelectorAll(cardSelector));
  }
  const N = cards.length;

  const leftFrag = document.createDocumentFragment();
  const rightFrag = document.createDocumentFragment();
  cards.forEach(c => rightFrag.appendChild(c.cloneNode(true)));
  cards.forEach(c => leftFrag.appendChild(c.cloneNode(true)));
  track.appendChild(rightFrag);
  track.insertBefore(leftFrag, track.firstChild);

  const allCards = Array.from(track.querySelectorAll(cardSelector));
  let idx = N;
  let animating = false;
  let peeked = false; // only meaningful when opts.startPeeked is set
  let wasDragged = false;

  const isMobile = () => window.innerWidth <= 768;
  const getGap = () => (isMobile() ? opts.gapMobile : opts.gapDesktop);
  const getPeek = () => (isMobile() ? opts.peekMobile : opts.peekDesktop);
  const cardWidth = () => (allCards[0] ? allCards[0].offsetWidth : 0);
  function getOffset(i) {
    const step = cardWidth() + getGap();
    if (opts.startPeeked && !peeked && i === N) return N * step;
    return i * step - getPeek();
  }
  function applyTransform(animated) {
    if (!animated) { track.style.transition = 'none'; track.offsetWidth; }
    track.style.transform = 'translateX(-' + getOffset(idx) + 'px)';
    if (!animated) { track.offsetWidth; track.style.transition = ''; }
  }
  track.addEventListener('transitionend', () => {
    let jumped = false;
    if (idx >= 2 * N) { idx -= N; jumped = true; }
    else if (idx < N) { idx += N; jumped = true; }
    if (jumped) applyTransform(false);
    animating = false;
  });
  function go(delta) {
    if (animating) return;
    peeked = true;
    animating = true;
    idx += delta;
    applyTransform(true);
  }
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));

  let touchStartX = 0, touchStartY = 0, touchDeltaX = 0, touchActive = false;
  track.addEventListener('touchstart', e => {
    if (animating) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchDeltaX = 0;
    touchActive = true;
    wasDragged = false;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    if (!touchActive) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (Math.abs(touchDeltaX) > dy + 4) e.preventDefault();
  }, { passive: false });
  function endDrag() {
    if (!touchActive) return;
    touchActive = false;
    if (Math.abs(touchDeltaX) > 40) {
      wasDragged = true;
      go(touchDeltaX < 0 ? 1 : -1);
    }
  }
  track.addEventListener('touchend', endDrag, { passive: true });
  track.addEventListener('touchcancel', endDrag, { passive: true });

  allCards.forEach((card, ci) => {
    card.addEventListener('click', e => {
      if (wasDragged) { wasDragged = false; if (opts.clickableCards) e.preventDefault(); return; }
      if (!opts.clickableCards) return;
      if (ci > idx) go(1);
      else if (ci < idx) go(-1);
    });

    if (opts.hoverPhotoScale) {
      const photo = card.querySelector('.ac-card-photo');
      card.addEventListener('mouseenter', () => {
        if (photo) { photo.style.transition = 'transform 420ms ease-out'; photo.style.transform = 'scale(1.025)'; }
      });
      card.addEventListener('mouseleave', () => {
        if (photo) { photo.style.transition = 'transform 1500ms ease-in-out'; photo.style.transform = 'scale(1)'; }
      });
    }

    if (opts.sheenClass) {
      const wrap = card.querySelector(opts.sheenWrapSelector);
      if (wrap) {
        wrap.addEventListener('mouseenter', () => {
          if (card._sheenPending) return;
          card._sheenPending = true;
          setTimeout(() => {
            wrap.classList.remove(opts.sheenClass);
            void wrap.offsetWidth;
            wrap.classList.add(opts.sheenClass);
            setTimeout(() => {
              wrap.classList.remove(opts.sheenClass);
              card._sheenPending = false;
            }, 1560);
          }, 1500);
        });
      }
    }
  });

  window.addEventListener('resize', () => applyTransform(false), { passive: true });
  applyTransform(false);
}

function initArticleFooter() {
  renderMoreGuideCards();

  initLoopCarousel('acTrack', 'acPrev', 'acNext', '.ac-card', {
    shuffle: true,
    startPeeked: true,
    gapMobile: 16, gapDesktop: 20,
    peekMobile: 0, peekDesktop: 80,
    clickableCards: true,
    hoverPhotoScale: true,
    sheenClass: 'ac-sheen',
    sheenWrapSelector: '.ac-photo-wrap',
  });

  initLoopCarousel('fwTrack', 'fwPrev', 'fwNext', '.fwg-wall-card', {
    shuffle: false,
    startPeeked: false,
    gapMobile: 12, gapDesktop: 16,
    peekMobile: 40, peekDesktop: 60,
    clickableCards: true,
    hoverPhotoScale: false,
    sheenClass: null,
  });
}
