/**
 * ADRITHI MEDIA — SCRIPT CONTROLLER
 * 1. Preloader: Divide & Open in 2s with Split Logo directly revealing the Hero
 * 2. Main Hero: Reelmark Arched Cylinder 10-Card Curved Carousel (No Text, Draggable, Coasting)
 * 3. Services Section: 3D Book Gallery (Vertical Scroll Triggered, Strict Edges, Dead-Centered)
 * 4. Category Gallery Modal: Triggered by "View Gallery" buttons
 */

// =========================================================================
// 0. ZERO-LATENCY HIGH-PERFORMANCE PRE-DECODE & MEMORY BUFFER ENGINE
// Decodes image raster data directly into GPU memory in parallel worker threads
// so displaying them takes literally 0ms with zero frame drop or blank flicker.
// =========================================================================
const CRITICAL_CACHE_IMAGES = [
  // Preloader Split Logo & Branding
  'assets/images/logo_vector_left.png',
  'assets/images/logo_vector_right.png',
  'assets/images/adrithi_emblem_blk.png',
  'assets/images/adrithi_emblem_white.png',

  // Hero Reelmark Curved Carousel (All 10 Curated Real Photos)
  'assets/images/wedding_sleeve1.jpg',
  'assets/images/hero_main.webp',
  'assets/images/haldi_sleeve3.jpg',
  'assets/images/tradition_sleeve4.jpg',
  'assets/services/maternity.jpg',
  'assets/services/muslims.jpg',
  'assets/images/traditional_couple.jpg',
  'assets/images/haldi_candid.jpg',
  'assets/images/monsoon_story.jpg',
  'assets/services/family_portrait.jpg',

  // Services Cards (All 6 Primary Curated Disciplines)
  'assets/services/pre_wedding.jpg',
  'assets/services/wedding.jpg',
  'assets/services/engagement.jpg',
  'assets/services/maternity.jpg',
  'assets/services/family_portrait.jpg',
  'assets/services/makeup.jpg',

  // Contact Kinetic Slice Gallery
  'assets/images/wedding_palace.jpg',
  'assets/images/prewedding_beach.jpg',
  'assets/images/wedding_vows.jpg',
  'assets/images/prewedding_candid.jpg',
  'assets/images/haldi_yellow.jpg',

  // Additional Primary Fallbacks
  'assets/services/baby.jpg',
  'assets/services/candids.jpg',
  'assets/services/corporate.jpg',
  'assets/services/decor.jpg',
  'assets/services/fashion.jpg',
  'assets/services/haldi.jpg',
  'assets/services/interior.jpg',
  'assets/services/mehendi.jpg',
  'assets/services/muslims.jpg',
  'assets/services/products.jpg'
];

window.__DECODED_IMAGE_CACHE = window.__DECODED_IMAGE_CACHE || new Map();

function preDecodeImage(src) {
  if (!src) return Promise.resolve(null);
  if (window.__DECODED_IMAGE_CACHE.has(src)) {
    return Promise.resolve(window.__DECODED_IMAGE_CACHE.get(src));
  }
  const img = new Image();
  img.referrerPolicy = 'no-referrer';
  img.src = src;

  const promise = (img.decode ? img.decode() : new Promise((res) => {
    if (img.complete) res();
    else img.onload = img.onerror = () => res();
  })).then(() => {
    window.__DECODED_IMAGE_CACHE.set(src, img);
    return img;
  }).catch(() => {
    window.__DECODED_IMAGE_CACHE.set(src, img);
    return img;
  });

  return promise;
}

// Immediate parallel pre-decode loop executed as soon as script is parsed
(function initInstantPredecode() {
  let idx = 0;
  function processBatch() {
    if (idx >= CRITICAL_CACHE_IMAGES.length) return;
    const batch = CRITICAL_CACHE_IMAGES.slice(idx, idx + 4);
    idx += 4;
    Promise.all(batch.map(preDecodeImage)).then(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(processBatch, { timeout: 150 });
      } else {
        setTimeout(processBatch, 20);
      }
    });
  }
  processBatch();
})();

function bootstrapAdrithiApp() {

  // =========================================================================
  // 1. PRELOADER: SPLIT LOGO DIVIDE & OPEN (DIRECTLY REVEALS THE CAROUSEL)
  // =========================================================================
  const preloaderOverlay = document.getElementById('preloaderOverlay');
  let isRevealed = false;

  function revealPreloader() {
    if (preloaderOverlay && !isRevealed) {
      isRevealed = true;
      preloaderOverlay.classList.add('is-revealed');
    }
  }

  function replayPreloader() {
    if (!preloaderOverlay) return;
    isRevealed = false;
    preloaderOverlay.classList.remove('is-revealed');
    preloaderOverlay.style.visibility = 'visible';
    preloaderOverlay.style.pointerEvents = 'auto';
    setTimeout(revealPreloader, 300);
  }

  // Divide and open in 2s after a brief 250ms beat
  setTimeout(revealPreloader, 250);

  // Click to skip or press 'R' to replay
  if (preloaderOverlay) {
    preloaderOverlay.addEventListener('click', revealPreloader);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      replayPreloader();
    }
  });

  // =========================================================================
  // 2. REELMARK CURVED ARCHED CAROUSEL (CYLINDER GEOMETRY, 10 REAL PHOTOS)
  // =========================================================================
  const cardDefs = document.getElementById('cardDefs');
  const cardsGroup = document.getElementById('cardsGroup');
  const carouselSvg = document.getElementById('carouselSvg');

  if (cardDefs && cardsGroup && carouselSvg) {
    const CARD_PHOTOS = [
      'assets/images/wedding_sleeve1.jpg',
      'assets/images/hero_main.webp',
      'assets/images/haldi_sleeve3.jpg',
      'assets/images/tradition_sleeve4.jpg',
      'assets/services/maternity.jpg',
      'assets/services/muslims.jpg',
      'assets/images/traditional_couple.jpg',
      'assets/images/haldi_candid.jpg',
      'assets/images/monsoon_story.jpg',
      'assets/services/family_portrait.jpg'
    ];

    const NUM_CARDS = 10;
    const PITCH = 216; // unpushed card pitch in 1440 units
    const TOTAL_SPAN = NUM_CARDS * PITCH; // 2160 units
    const CENTER_X = 720;
    const CENTER_Y = 540; // vertically centered in 1080 frame (no text)
    const RADIUS_U = 15; // 15u rounded corners

    // Build SVG DOM Nodes for each card
    const cardElements = [];

    for (let i = 0; i < NUM_CARDS; i++) {
      // 1. Clip path
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', `card-clip-${i}`);
      const clipPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      clipPath.appendChild(clipPathEl);
      cardDefs.appendChild(clipPath);

      // 2. Card group
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'card-item-group');

      // Image
      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', CARD_PHOTOS[i]);
      img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      img.setAttribute('clip-path', `url(#card-clip-${i})`);
      img.setAttribute('class', 'card-image-node');
      g.appendChild(img);

      cardsGroup.appendChild(g);

      cardElements.push({
        group: g,
        image: img,
        clipPathEl: clipPathEl
      });
    }

    // Rounded quad SVG path generator (15u corners)
    function makeRoundedQuadPath(xL, yTL, xR, yTR, yBR, yBL, r) {
      return (
        `M ${xL + r} ${yTL} ` +
        `L ${xR - r} ${yTR} ` +
        `Q ${xR} ${yTR} ${xR} ${yTR + r} ` +
        `L ${xR} ${yBR - r} ` +
        `Q ${xR} ${yBR} ${xR - r} ${yBR} ` +
        `L ${xL + r} ${yBL} ` +
        `Q ${xL} ${yBL} ${xL} ${yBL - r} ` +
        `L ${xL} ${yTL + r} ` +
        `Q ${xL} ${yTL} ${xL + r} ${yTL} Z`
      );
    }

    // Motion & Drag physics (50u/s auto-scroll, 1:1 drag, 95% momentum decay)
    let scrollOffset = 0;
    const AUTO_SPEED = -52; // units per second (right -> left)
    let velocity = 0;
    let isDragging = false;
    let dragLastX = 0;
    let dragLastTime = 0;
    let lastFrameTime = performance.now();
    let isSnapping = false;
    let targetOffset = 0;
    let lastActiveIdx = -1;

    function snapToCard(dir) {
      isDragging = false;
      let normalized = (-scrollOffset) % TOTAL_SPAN;
      if (normalized < 0) normalized += TOTAL_SPAN;
      let curIdx = Math.round(normalized / PITCH);
      let targetIdx = curIdx + dir;
      targetOffset = -targetIdx * PITCH;
      isSnapping = true;
    }

    function updateCarousel(now) {
      if (window.innerWidth <= 768) {
        lastFrameTime = now;
        requestAnimationFrame(updateCarousel);
        return;
      }
      const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      if (isSnapping) {
        const diff = targetOffset - scrollOffset;
        if (Math.abs(diff) > 0.8) {
          scrollOffset += diff * Math.min(1, dt * 9);
        } else {
          scrollOffset = targetOffset;
          isSnapping = false;
          velocity = AUTO_SPEED;
        }
      } else if (!isDragging) {
        if (Math.abs(velocity) > Math.abs(AUTO_SPEED)) {
          // Momentum coasting: decay 95% per second
          const decay = Math.pow(0.05, dt);
          velocity = velocity * decay;
          scrollOffset += velocity * dt;
        } else {
          // Continuous steady auto-scroll
          velocity = AUTO_SPEED;
          scrollOffset += velocity * dt;
        }
      }

      scrollOffset = (scrollOffset % TOTAL_SPAN);

      // Desktop counter update
      let norm = (-scrollOffset) % TOTAL_SPAN;
      if (norm < 0) norm += TOTAL_SPAN;
      const currentIdx = ((Math.round(norm / PITCH) % NUM_CARDS) + NUM_CARDS) % NUM_CARDS;
      if (currentIdx !== lastActiveIdx) {
        lastActiveIdx = currentIdx;
        const curEl = document.getElementById('heroCounterCurrent');
        if (curEl) curEl.textContent = String(currentIdx + 1).padStart(2, '0');
      }

      // Render all 10 cards according to cylinder curve math
      for (let i = 0; i < NUM_CARDS; i++) {
        let t = (i * PITCH + scrollOffset) % TOTAL_SPAN;
        if (t < -TOTAL_SPAN / 2) t += TOTAL_SPAN;
        if (t > TOTAL_SPAN / 2) t -= TOTAL_SPAN;

        // Reelmark curve geometry:
        // Push centre outward: x = 720 + t * (1 + 0.083 * (t/706)^2)
        const ratioT = t / 706.0;
        const xCenter = CENTER_X + t * (1 + 0.083 * ratioT * ratioT);

        // Normalised distance d = |x - 720| / 706
        const d = Math.abs(xCenter - CENTER_X) / 706.0;

        // Width = (185 + 55 * d^2)
        const width = 185 + 55 * d * d;

        const xL = xCenter - width / 2;
        const xR = xCenter + width / 2;

        // If card is far off-screen, hide it
        if (xR < -150 || xL > 1590) {
          cardElements[i].group.style.display = 'none';
          continue;
        } else {
          cardElements[i].group.style.display = '';
        }

        // Edge distances: q = |edge - 720| / 706
        const qL = Math.abs(xL - CENTER_X) / 706.0;
        const qR = Math.abs(xR - CENTER_X) / 706.0;

        // Height of each edge: (380 + 130 * q^2.6)
        const hL = 380 + 130 * Math.pow(qL, 2.6);
        const hR = 380 + 130 * Math.pow(qR, 2.6);

        // Vertical centre: (540 - 16 * d^2)
        const yCenter = CENTER_Y - 16 * d * d;

        const yTL = yCenter - hL / 2;
        const yTR = yCenter - hR / 2;
        const yBR = yCenter + hR / 2;
        const yBL = yCenter + hL / 2;

        // Generate clip-path
        const pathD = makeRoundedQuadPath(xL, yTL, xR, yTR, yBR, yBL, RADIUS_U);
        cardElements[i].clipPathEl.setAttribute('d', pathD);

        // Image bounds to cover the quad
        const topY = Math.min(yTL, yTR);
        const bottomY = Math.max(yBL, yBR);
        const imgH = bottomY - topY;

        cardElements[i].image.setAttribute('x', xL);
        cardElements[i].image.setAttribute('y', topY);
        cardElements[i].image.setAttribute('width', width);
        cardElements[i].image.setAttribute('height', imgH);
      }

      requestAnimationFrame(updateCarousel);
    }

    requestAnimationFrame(updateCarousel);

    // Drag handlers
    let touchStartX = 0;
    let touchStartY = 0;
    let isVerticalSwipe = false;

    function getClientX(e) {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      return e.clientX;
    }

    function getClientY(e) {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
      return e.clientY;
    }

    function getSvgScale() {
      const rect = carouselSvg.getBoundingClientRect();
      return rect.width > 0 ? 1440 / rect.width : 1;
    }

    function onPointerDown(e) {
      isSnapping = false;
      isDragging = true;
      isVerticalSwipe = false;
      dragLastX = getClientX(e);
      dragLastTime = performance.now();
      touchStartX = dragLastX;
      touchStartY = getClientY(e);
      velocity = 0;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      if (isVerticalSwipe) return;

      const clientX = getClientX(e);
      const clientY = getClientY(e);

      // On mobile touch devices, detect if vertical scrolling is intended
      if (e.touches && e.touches.length > 0) {
        const dX = Math.abs(clientX - touchStartX);
        const dY = Math.abs(clientY - touchStartY);
        if (dY > 8 && dY > dX) {
          isVerticalSwipe = true;
          isDragging = false;
          return;
        }
      }

      const now = performance.now();
      const dt = Math.max(0.001, (now - dragLastTime) / 1000);

      const deltaPx = clientX - dragLastX;
      const scale = getSvgScale();
      const deltaU = deltaPx * scale;

      scrollOffset += deltaU;
      velocity = deltaU / dt;

      dragLastX = clientX;
      dragLastTime = now;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      isVerticalSwipe = false;
    }

    carouselSvg.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    carouselSvg.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    window.__desktopSnapToCard = snapToCard;
  }

  // =========================================================================
  // 2B. MOBILE 3D CINEMATIC COVERFLOW HERO
  // Active on mobile <= 768px: large centered portrait cards with 3D depth,
  // smooth auto-glide, swipe-to-snap touch physics, and pagination dots
  // =========================================================================
  function initMobileCoverflow() {
    const stage = document.getElementById('mobileCoverflowStage');
    const track = document.getElementById('mobileCoverflowTrack');
    const pagination = document.getElementById('mobileCoverflowPagination');
    if (!stage || !track || !pagination) return;

    const cards = Array.from(track.querySelectorAll('.mobile-coverflow-card'));
    const numCards = cards.length;
    if (numCards === 0) return;

    let activeIndex = 0;
    let isInteracting = false;
    let autoPlayTimer = null;

    // Build pagination dots
    pagination.innerHTML = '';
    const dots = [];
    for (let i = 0; i < numCards; i++) {
      const dot = document.createElement('button');
      dot.className = `coverflow-dot${i === 0 ? ' is-active' : ''}`;
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Go to photography slide ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
        restartAutoPlay();
      });
      pagination.appendChild(dot);
      dots.push(dot);
    }

    // Update 3D card layout
    function updateCards(dragFraction = 0) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeIndex);
      });

      const curEl = document.getElementById('heroCounterCurrent');
      const totEl = document.getElementById('heroCounterTotal');
      if (curEl) curEl.textContent = String(activeIndex + 1).padStart(2, '0');
      if (totEl) totEl.textContent = String(numCards).padStart(2, '0');

      cards.forEach((card, i) => {
        let offset = i - activeIndex;
        // Loop wrapping
        if (offset > numCards / 2) offset -= numCards;
        if (offset < -numCards / 2) offset += numCards;

        // Apply dragFraction smoothly
        const effectiveOffset = offset + dragFraction;
        const absOffset = Math.abs(effectiveOffset);

        if (absOffset < 3.2) {
          card.style.display = 'block';

          // 3D positioning calculations:
          const tx = effectiveOffset * 68; // percentage horizontal translation
          const tz = -Math.min(320, absOffset * 150); // px depth into screen
          const ry = -Math.sign(effectiveOffset) * Math.min(45, Math.pow(absOffset, 0.85) * 32); // degrees Y rotation
          const scale = Math.max(0.68, 1 - absOffset * 0.14);
          const opacity = Math.max(0, 1 - absOffset * 0.32);
          const zIndex = Math.round(20 - absOffset * 5);
          const blur = Math.max(0, (absOffset - 0.45) * 2.5);

          card.style.transform = `translateX(${tx.toFixed(1)}%) translateZ(${tz.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(2);
          card.style.zIndex = zIndex;
          card.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
          card.style.pointerEvents = absOffset < 0.6 ? 'auto' : 'none';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
        }
      });
    }

    function goToSlide(targetIndex) {
      activeIndex = (targetIndex % numCards + numCards) % numCards;
      cards.forEach(c => c.classList.remove('is-dragging'));
      updateCards(0);
    }

    // Auto-play (advances every 3.6s when in mobile view and visible)
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (window.innerWidth <= 768 && !document.hidden && !isInteracting) {
          goToSlide(activeIndex + 1);
        }
      }, 3600);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Touch and Mouse Dragging
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isSwipingY = false;
    let dragStartTime = 0;

    function onDragStart(e) {
      if (window.innerWidth > 768) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      isDragging = true;
      isSwipingY = false;
      isInteracting = true;
      dragStartTime = performance.now();
      stopAutoPlay();
      cards.forEach(c => c.classList.add('is-dragging'));
    }

    function onDragMove(e) {
      if (!isDragging || isSwipingY) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (e.touches) {
        const dX = Math.abs(clientX - startX);
        const dY = Math.abs(clientY - startY);
        // If vertical scroll intent is clear, yield to native page scroll
        if (dY > 8 && dY > dX) {
          isSwipingY = true;
          isDragging = false;
          cards.forEach(c => c.classList.remove('is-dragging'));
          updateCards(0);
          return;
        }
      }

      currentX = clientX;
      const deltaX = currentX - startX;
      const screenWidth = Math.max(300, window.innerWidth);
      const dragFraction = deltaX / (screenWidth * 0.7);
      updateCards(dragFraction);
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      cards.forEach(c => c.classList.remove('is-dragging'));

      const deltaX = currentX - startX;
      const duration = performance.now() - dragStartTime;
      const screenWidth = Math.max(300, window.innerWidth);
      const threshold = screenWidth * 0.15; // approx 45-55px
      const velocity = Math.abs(deltaX) / Math.max(1, duration);

      if (deltaX < -threshold || (deltaX < -25 && velocity > 0.28)) {
        // Swiped Left -> Next Slide
        goToSlide(activeIndex + 1);
      } else if (deltaX > threshold || (deltaX > 25 && velocity > 0.28)) {
        // Swiped Right -> Previous Slide
        goToSlide(activeIndex - 1);
      } else {
        // Snap back to active slide
        goToSlide(activeIndex);
      }

      setTimeout(() => {
        isInteracting = false;
        restartAutoPlay();
      }, 1200);
    }

    // Direct tap on adjacent side cards to bring them to center
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (isDragging) return;
        let offset = idx - activeIndex;
        if (offset > numCards / 2) offset -= numCards;
        if (offset < -numCards / 2) offset += numCards;
        if (offset === 1 || offset === -1) {
          goToSlide(idx);
          restartAutoPlay();
        }
      });
    });

    stage.addEventListener('touchstart', onDragStart, { passive: true });
    window.addEventListener('touchmove', onDragMove, { passive: true });
    window.addEventListener('touchend', onDragEnd);
    window.addEventListener('touchcancel', onDragEnd);

    stage.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoPlay();
      else if (window.innerWidth <= 768) startAutoPlay();
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        updateCards(0);
        if (!autoPlayTimer) startAutoPlay();
      } else {
        stopAutoPlay();
      }
    });

    window.__mobileGoToSlide = function(dir) {
      goToSlide(activeIndex + dir);
      restartAutoPlay();
    };

    // Initialize layout
    updateCards(0);
    if (window.innerWidth <= 768) {
      startAutoPlay();
    }
  }

  // Initialize mobile coverflow
  initMobileCoverflow();

  // Connect Hero Carousel Navigation Controls (Desktop & Mobile)
  const heroNavPrev = document.getElementById('heroNavPrev');
  const heroNavNext = document.getElementById('heroNavNext');

  if (heroNavPrev) {
    heroNavPrev.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        if (typeof window.__mobileGoToSlide === 'function') {
          window.__mobileGoToSlide(-1);
        }
      } else {
        if (typeof window.__desktopSnapToCard === 'function') {
          window.__desktopSnapToCard(-1);
        }
      }
    });
  }

  if (heroNavNext) {
    heroNavNext.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        if (typeof window.__mobileGoToSlide === 'function') {
          window.__mobileGoToSlide(1);
        }
      } else {
        if (typeof window.__desktopSnapToCard === 'function') {
          window.__desktopSnapToCard(1);
        }
      }
    });
  }

  // =========================================================================
  // 3. SECTION 2: OUR SERVICES — STICKY HORIZONTAL SCROLL GALLERY PINNED BY GSAP
  // =========================================================================
  function initHorizontalServicesGallery() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initHorizontalServicesGallery, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('servicesSection');
    const stage = document.getElementById('servicesStickyStage');
    const track = document.getElementById('servicesHorizontalTrack');
    const progressFill = document.getElementById('servicesProgressFill');
    const statusCount = document.getElementById('servicesStatusCount');

    // Wire card click & accessibility keyboard events to open full gallery
    document.querySelectorAll('.artsy-tile, .service-gallery-card').forEach((card) => {
      const category = card.getAttribute('data-category');

      if (category) {
        card.addEventListener('mouseenter', () => preloadCategory(category));
        card.addEventListener('touchstart', () => preloadCategory(category), { passive: true });
      }

      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (category) {
          openCategoryGallery(category);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (category) {
            openCategoryGallery(category);
          }
        }
      });
    });

    if (!section || !stage || !track) return;

    // Layout safety check & delay: ensures DOM, fonts, and card widths are accurately computed
    const setupTrigger = () => {
      // Use gsap.matchMedia for desktop-only horizontal pinning
      const mm = gsap.matchMedia();

      // Desktop (>768px): Horizontal sticky pinned gallery
      mm.add('(min-width: 769px)', () => {
        const getScrollDistance = () => {
          const currentTransform = track.style.transform;
          track.style.transform = 'none';
          const totalWidth = track.scrollWidth;
          track.style.transform = currentTransform;
          const viewportWidth = window.innerWidth;
          const endPadding = 120;
          return Math.max(0, totalWidth - viewportWidth + endPadding);
        };

        const cards = Array.from(track.querySelectorAll('.service-gallery-card'));
        const totalCards = cards.length || 6;

        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'servicesScroll',
            trigger: section,
            pin: true,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: true, // Direct 1:1 scroll synchronisation — zero lag, zero overscroll
            anticipatePin: 0, // Prevents premature jumps when scrolling backwards
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
              }
              if (statusCount) {
                const currentIdx = Math.min(totalCards, Math.max(1, Math.floor(p * totalCards) + 1));
                statusCount.textContent = `0${currentIdx} / 0${totalCards} DISCIPLINES`;
              }
            }
          }
        });

        return () => {
          tween.kill();
          gsap.set(track, { clearProps: 'all' });
        };
      });

      // Mobile (<=768px): Pure natural vertical scroll — zero horizontal pin/drag
      mm.add('(max-width: 768px)', () => {
        gsap.set(track, { clearProps: 'all' });
      });

      ScrollTrigger.refresh();
    };

    // Small delay ensuring full layout pass before computing ScrollTrigger pinning logic
    setTimeout(setupTrigger, 80);

    // Refresh pin and distances on window resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });

    // Wire card click & accessibility keyboard events to open full gallery
    document.querySelectorAll('.artsy-tile, .service-gallery-card').forEach((card) => {
      const category = card.getAttribute('data-category');

      if (category) {
        card.addEventListener('mouseenter', () => preloadCategory(category));
        card.addEventListener('touchstart', () => preloadCategory(category), { passive: true });
      }

      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (category) {
          openCategoryGallery(category);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (category) {
            openCategoryGallery(category);
          }
        }
      });
    });
  }

  // Preload primary categories gently
  setTimeout(() => {
    preloadCategory('Wedding');
    preloadCategory('Pre-Wedding');
  }, 1200);

  // =========================================================================
  // 4. CATEGORY FLUID GALLERY & FULL-SIZE LIGHTBOX (PURE IMAGERY — NO TEXT)
  // =========================================================================
  const galleryModal = document.getElementById('categoryGalleryModal');
  const galleryModalGrid = document.getElementById('galleryModalGrid');
  const galleryModalCloseBtn = document.getElementById('galleryModalCloseBtn');
  const galleryModalBackdrop = document.getElementById('galleryModalBackdrop');

  // Lightbox elements
  const masonryLightbox = document.getElementById('masonryLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  // Active section state
  let currentActiveCategory = 'Wedding';
  let currentGalleryItems = [];
  let currentLightboxIndex = 0;

  // Local fallback assets if offline
  
  // Normalize category name across spaces, hyphens, and aliases
  function normalizeCategoryName(rawCategory) {
    if (!rawCategory) return 'Wedding';
    const s = String(rawCategory).trim().toLowerCase().replace(/[-_]/g, ' ');
    if (s === 'portrait' || s === 'family portrait') return 'Family Portrait';
    if (s === 'pre wedding') return 'Pre-Wedding';
    if (s === 'wedding') return 'Wedding';
    if (s === 'engagement') return 'Engagement';
    if (s === 'maternity') return 'Maternity';
    if (s === 'makeup') return 'Makeup';
    const match = Object.keys(LOCAL_CATEGORY_FALLBACKS).find(k => k.toLowerCase().replace(/[-_]/g, ' ') === s);
    return match || rawCategory;
  }

  const LOCAL_CATEGORY_FALLBACKS = {
    'Portrait': ['assets/services/family_portrait.jpg', 'assets/images/traditional_couple.jpg', 'assets/images/wedding_palace.jpg'],
    'Pre Wedding': ['assets/services/pre_wedding.jpg', 'assets/images/prewedding_sleeve2.jpg', 'assets/images/prewedding_beach.jpg'],
    'Wedding': ['assets/services/wedding.jpg', 'assets/images/wedding_sleeve1.jpg', 'assets/images/wedding_palace.jpg', 'assets/images/wedding_vows.jpg', 'assets/images/traditional_couple.jpg', 'assets/images/candid_sleeve5.jpg'],
    'Engagement': ['assets/services/engagement.jpg', 'assets/images/prewedding_beach.jpg', 'assets/images/traditional_couple.jpg', 'assets/images/wedding_sleeve1.jpg'],
    'Pre-Wedding': ['assets/services/pre_wedding.jpg', 'assets/images/prewedding_sleeve2.jpg', 'assets/images/prewedding_beach.jpg', 'assets/images/prewedding_candid.jpg'],
    'Maternity': ['assets/services/maternity.jpg', 'assets/images/hero_reveal.jpg', 'assets/images/baby_portrait.jpg'],
    'Baby': ['assets/services/baby.jpg', 'assets/images/baby_portrait.jpg', 'assets/images/hero_reveal.jpg'],
    'Corporate': ['assets/services/corporate.jpg', 'assets/images/tradition_sleeve4.jpg', 'assets/images/hero_main.webp'],
    'Haldi': ['assets/services/haldi.jpg', 'assets/images/haldi_sleeve3.jpg', 'assets/images/haldi_candid.jpg', 'assets/images/haldi_yellow.jpg'],
    'Mehendi': ['assets/services/mehendi.jpg', 'assets/images/haldi_candid.jpg', 'assets/images/haldi_sleeve3.jpg'],
    'Candids': ['assets/services/candids.jpg', 'assets/images/candid_sleeve5.jpg', 'assets/images/haldi_candid.jpg', 'assets/images/prewedding_candid.jpg'],
    'Family Portrait': ['assets/services/family_portrait.jpg', 'assets/images/traditional_couple.jpg', 'assets/images/wedding_palace.jpg'],
    'Decor': ['assets/services/decor.jpg', 'assets/images/wedding_palace.jpg', 'assets/images/wedding_sleeve1.jpg'],
    'Makeup': ['assets/services/makeup.jpg', 'assets/images/monsoon_story.jpg', 'assets/images/wedding_vows.jpg'],
    'Products': ['assets/services/products.jpg', 'assets/images/hero_main.webp', 'assets/images/tradition_sleeve4.jpg'],
    'Interior': ['assets/services/interior.jpg', 'assets/images/wedding_vows.jpg', 'assets/images/wedding_palace.jpg'],
    'Fashion': ['assets/services/fashion.jpg', 'assets/images/prewedding_candid.jpg', 'assets/images/monsoon_story.jpg'],
    'Muslims': ['assets/services/muslims.jpg', 'assets/images/haldi_yellow.jpg', 'assets/images/wedding_sleeve1.jpg']
  };

  // Helper to safely get fallback list regardless of case
  function getCategoryFallbacks(category) {
    if (!category) return LOCAL_CATEGORY_FALLBACKS['Wedding'];
    const catStr = String(category).trim().toLowerCase();
    const foundKey = Object.keys(LOCAL_CATEGORY_FALLBACKS).find(
      (k) => k.toLowerCase() === catStr
    );
    return (foundKey && LOCAL_CATEGORY_FALLBACKS[foundKey]) || LOCAL_CATEGORY_FALLBACKS['Wedding'];
  }

  // Cache of preloaded images to avoid redundant network requests
  const preloadedImagesCache = new Set();
  function preloadImageUrl(url) {
    if (!url || preloadedImagesCache.has(url)) return;
    preloadedImagesCache.add(url);
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.src = url;
    if (img.decode) {
      img.decode().then(() => {
        window.__DECODED_IMAGE_CACHE.set(url, img);
      }).catch(() => {});
    }
  }

  function getCategoryItems(category) {
    const items = [];
    const seenUrls = new Set();
    const locals = getCategoryFallbacks(category);
    const driveStore = window.DRIVE_GALLERY_IMAGES || {};
    const driveList = driveStore[category] || [];

    // Distribute local guaranteed 0ms assets so each masonry column renders full photos immediately
    const driveItems = [];
    driveList.forEach((d, idx) => {
      const rawUrl = d.url;
      if (seenUrls.has(rawUrl)) return;
      seenUrls.add(rawUrl);

      // Append =w700 for instant ~60KB fluid thumbnail, =w1600 for crisp lightbox
      const thumbUrl = rawUrl.includes('=') ? rawUrl : `${rawUrl}=w700`;
      const fullUrl = rawUrl.includes('=') ? rawUrl : `${rawUrl}=w1600`;

      driveItems.push({
        id: d.id || `${category}_${idx}`,
        img: thumbUrl,
        fullImg: fullUrl
      });
    });

    const localItems = locals.map((src, idx) => {
      seenUrls.add(src);
      return {
        id: `local_${category}_${idx}`,
        img: src,
        fullImg: src
      };
    });

    if (driveItems.length === 0) {
      return localItems;
    }

    // Interleave local items evenly across total items
    const totalCount = localItems.length + driveItems.length;
    const interval = Math.max(1, Math.floor(totalCount / localItems.length));
    let localIdx = 0;
    let driveIdx = 0;

    for (let i = 0; i < totalCount; i++) {
      if (i % interval === 0 && localIdx < localItems.length) {
        items.push(localItems[localIdx++]);
      } else if (driveIdx < driveItems.length) {
        items.push(driveItems[driveIdx++]);
      } else if (localIdx < localItems.length) {
        items.push(localItems[localIdx++]);
      }
    }

    return items;
  }

  // Preload an entire category in the background (up to 16 images)
  function preloadCategory(category) {
    category = normalizeCategoryName(category);
    if (!category) return;
    const items = getCategoryItems(category);
    items.slice(0, 16).forEach((it) => preloadImageUrl(it.img));
  }

  // Automatic background idle preloader for all 6 core disciplines
  function preloadAllCategoriesOnIdle() {
    const cats = ['Wedding', 'Pre-Wedding', 'Engagement', 'Maternity', 'Family Portrait', 'Makeup'];
    let catIdx = 0;
    function loadNextCat() {
      if (catIdx >= cats.length) return;
      preloadCategory(cats[catIdx++]);
      setTimeout(loadNextCat, 350);
    }
    setTimeout(loadNextCat, 600);
  }
  preloadAllCategoriesOnIdle();

  // Pure Fluid Gallery Renderer (Zero Prescribed Size Clipping — Fully Fluid)
  function renderMasonryGallery(category) {
    if (!galleryModalGrid) return;

    currentActiveCategory = category;
    currentGalleryItems = getCategoryItems(category);
    galleryModalGrid.innerHTML = '';

    // Update modal topbar header
    const titleEl = document.getElementById('galleryModalTitle');
    const countEl = document.getElementById('galleryModalCount');
    if (titleEl) {
      const displayCat = (category === 'Family Portrait' || category === 'Portrait') ? 'Portrait' : category;
      titleEl.textContent = `${displayCat} Gallery`;
    }
    if (countEl) {
      countEl.textContent = `${currentGalleryItems.length} Photographs`;
    }

    currentGalleryItems.forEach((item, index) => {
      const itemNode = document.createElement('div');
      itemNode.className = 'masonry-fluid__item';

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'masonry-fluid__card';
      card.setAttribute('aria-label', `View ${category} photo ${index + 1} in full size`);

      const img = document.createElement('img');
      img.className = 'masonry-fluid__image';
      img.alt = `${category} Photograph ${index + 1}`;
      img.referrerPolicy = 'no-referrer';
      img.loading = 'eager'; // Load gallery images immediately so all are completely visible
      img.decoding = 'async';
      img.draggable = false;

      const markReady = () => {
        img.classList.add('is-loaded');
        card.classList.add('is-img-ready');
      };

      // Define onload and onerror BEFORE setting src
      img.onload = markReady;

      // Direct error fallback to ensure no broken images
      img.onerror = () => {
        img.onerror = null;
        const fallbacks = getCategoryFallbacks(category);
        const fallbackSrc = fallbacks[index % fallbacks.length];
        img.src = fallbackSrc;
        item.img = fallbackSrc;
        item.fullImg = fallbackSrc;
        markReady();
      };

      img.src = item.img;

      // Instant 0ms show if already cached/complete
      if (img.complete && img.naturalWidth > 0) {
        markReady();
      }

      card.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index, img.currentSrc || img.src);
      });

      card.appendChild(img);
      itemNode.appendChild(card);
      galleryModalGrid.appendChild(itemNode);
    });
  }

  // =========================================================================
  // LIGHTBOX CONTROLLER (FULL-SIZE VIEW WITH RESILIENT MULTI-TIER IMAGE LOADING)
  // =========================================================================
  let lightboxLoadToken = 0;

  function updateLightboxContent(preferredSrc) {
    if (!currentGalleryItems || !currentGalleryItems[currentLightboxIndex]) return;
    const item = currentGalleryItems[currentLightboxIndex];
    if (!lightboxImage) return;

    const spinner = document.getElementById('lightboxLoader');
    const myToken = ++lightboxLoadToken;

    // Zero-latency instant display:
    // If preferredSrc is available (or item.img is already cached), render it immediately with 0ms delay!
    const instantCandidate = preferredSrc || (item.img && window.__DECODED_IMAGE_CACHE.has(item.img) ? item.img : null);

    if (instantCandidate) {
      lightboxImage.referrerPolicy = 'no-referrer';
      lightboxImage.alt = 'Full size photograph';
      lightboxImage.src = instantCandidate;
      lightboxImage.classList.add('is-loaded');
      if (spinner) spinner.style.display = 'none';
    } else {
      lightboxImage.classList.remove('is-loaded');
      if (spinner) spinner.style.display = 'block';
    }

    // Prepare resilient ordered candidate list
    const fallbacks = getCategoryFallbacks(currentActiveCategory);
    const guaranteedFallback = fallbacks[currentLightboxIndex % fallbacks.length];

    const candidates = [];
    if (item.fullImg && !candidates.includes(item.fullImg)) candidates.push(item.fullImg);
    if (preferredSrc && !candidates.includes(preferredSrc)) candidates.push(preferredSrc);
    if (item.img && !candidates.includes(item.img)) candidates.push(item.img);
    if (guaranteedFallback && !candidates.includes(guaranteedFallback)) candidates.push(guaranteedFallback);
    fallbacks.forEach((f) => {
      if (!candidates.includes(f)) candidates.push(f);
    });

    function tryCandidate(idx) {
      if (myToken !== lightboxLoadToken) return; // Discard superseded requests

      if (idx >= candidates.length) {
        if (!lightboxImage.classList.contains('is-loaded')) {
          lightboxImage.referrerPolicy = 'no-referrer';
          lightboxImage.alt = 'Full size photograph';
          lightboxImage.src = guaranteedFallback;
          lightboxImage.classList.add('is-loaded');
        }
        if (spinner) spinner.style.display = 'none';
        return;
      }

      const candidateUrl = candidates[idx];

      // If already displayed via instant candidate and this candidate is the exact same URL, we are done!
      if (instantCandidate && candidateUrl === instantCandidate) {
        return;
      }

      const testImg = new Image();
      testImg.referrerPolicy = 'no-referrer';

      let resolved = false;
      const timeoutTimer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          tryCandidate(idx + 1);
        }
      }, 3500);

      const applyCandidate = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutTimer);
        if (myToken !== lightboxLoadToken) return;

        lightboxImage.referrerPolicy = 'no-referrer';
        lightboxImage.alt = 'Full size photograph';
        lightboxImage.src = candidateUrl;
        lightboxImage.classList.add('is-loaded');
        if (spinner) spinner.style.display = 'none';

        // Cache working src back to item
        item.img = candidateUrl;
        item.fullImg = candidateUrl;
      };

      testImg.onload = applyCandidate;
      testImg.onerror = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutTimer);
        tryCandidate(idx + 1);
      };

      testImg.src = candidateUrl;

      // Instant show if already cached in browser memory
      if (testImg.complete && testImg.naturalWidth > 0) {
        applyCandidate();
      }
    }

    tryCandidate(0);

    // Preload & Pre-decode previous & next 2 images for zero-latency cycling
    [-2, -1, 1, 2].forEach((offset) => {
      const idx = (currentLightboxIndex + offset + currentGalleryItems.length) % currentGalleryItems.length;
      const targetItem = currentGalleryItems[idx];
      if (targetItem) {
        preloadImageUrl(targetItem.img);
        if (targetItem.fullImg) preloadImageUrl(targetItem.fullImg);
      }
    });
  }

  function openLightbox(index, preferredSrc) {
    if (!masonryLightbox || !currentGalleryItems.length) return;
    currentLightboxIndex = Math.max(0, Math.min(currentGalleryItems.length - 1, index));
    updateLightboxContent(preferredSrc);
    masonryLightbox.style.display = 'flex';
  }

  function closeLightbox() {
    if (!masonryLightbox) return;
    masonryLightbox.style.display = 'none';
    lightboxLoadToken++; // Invalidate pending loads
    if (lightboxImage) {
      lightboxImage.classList.remove('is-loaded');
      lightboxImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    }
    const spinner = document.getElementById('lightboxLoader');
    if (spinner) spinner.style.display = 'none';
  }

  function stepLightbox(delta) {
    if (!currentGalleryItems.length) return;
    currentLightboxIndex = (currentLightboxIndex + delta + currentGalleryItems.length) % currentGalleryItems.length;
    
    // Check if the fluid grid already has this item rendered and loaded
    let preferredSrc = null;
    if (galleryModalGrid && galleryModalGrid.children[currentLightboxIndex]) {
      const gridImg = galleryModalGrid.children[currentLightboxIndex].querySelector('img');
      if (gridImg && (gridImg.classList.contains('is-loaded') || (gridImg.complete && gridImg.naturalWidth > 0))) {
        preferredSrc = gridImg.currentSrc || gridImg.src;
      }
    }
    updateLightboxContent(preferredSrc);
  }

  // Event Listeners for Lightbox Navigation & Exit
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });

  function openCategoryGallery(category) {
    category = normalizeCategoryName(category);
    if (!galleryModal) return;

    renderMasonryGallery(category);
    galleryModal.style.display = 'flex';
    galleryModal.classList.add('is-active');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll

    const contentEl = galleryModal.querySelector('.gallery-modal-content');
    if (contentEl) contentEl.scrollTop = 0;
  }

  function closeCategoryGallery() {
    if (!galleryModal) return;
    closeLightbox();
    galleryModal.classList.remove('is-active');
    galleryModal.setAttribute('aria-hidden', 'true');
    galleryModal.style.display = 'none';
    document.body.style.overflow = ''; // Unlock background scroll
  }

  // Globally accessible triggers for seamless deep-linking and integration
  window.openCategoryGallery = openCategoryGallery;
  window.closeCategoryGallery = closeCategoryGallery;

  // Bind View Gallery buttons across all book pages with instant hover preloading
  document.querySelectorAll('.view-gallery-btn').forEach((btn) => {
    const category = btn.getAttribute('data-category');
    if (category) {
      // Preload images into cache the microsecond the cursor moves over or touches the button
      btn.addEventListener('mouseenter', () => preloadCategory(category));
      btn.addEventListener('touchstart', () => preloadCategory(category), { passive: true });
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Never flip book page on gallery button click
      if (category) {
        openCategoryGallery(category);
      }
    });
  });

  // Preload primary categories in background gently
  setTimeout(() => {
    preloadCategory('Wedding');
  }, 2000);

  if (galleryModalCloseBtn) {
    galleryModalCloseBtn.addEventListener('click', closeCategoryGallery);
  }

  if (galleryModalBackdrop) {
    galleryModalBackdrop.addEventListener('click', closeCategoryGallery);
  }

  // Keyboard navigation inside modal & lightbox
  document.addEventListener('keydown', (e) => {
    // If Lightbox is open:
    if (masonryLightbox && masonryLightbox.style.display !== 'none') {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepLightbox(-1);
      }
      return;
    }

    // If Gallery Modal is open:
    if (galleryModal && galleryModal.classList.contains('is-active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCategoryGallery();
      }
    }
  });


  // =========================================================================
  // 5. SECTION 3: CONTACT SECTION SLICED KINETIC GALLERY (AUTO-CYCLING 1.5s)
  // =========================================================================
  const contactSlider = document.getElementById('contactSliceSlider');
  const contactSection = document.getElementById('contactSection');
  const slicePrevBtn = document.getElementById('slicePrevBtn');
  const sliceNextBtn = document.getElementById('sliceNextBtn');

  if (contactSlider) {
    const cols = 3;
    const parts = [];

    // Full-color high-resolution Adrithi Media photography images
    const sliceImages = [
      'assets/images/wedding_palace.jpg',
      'assets/images/hero_reveal.jpg',
      'assets/images/monsoon_story.jpg',
      'assets/images/traditional_couple.jpg',
      'assets/images/prewedding_beach.jpg',
      'assets/images/haldi_candid.jpg'
    ];

    let currentSliceIdx = 0;
    let isSlicePlaying = false;
    let sliceInterval = null;

    // Preload and pre-decode all slice images for instant smooth transitions
    sliceImages.forEach(src => {
      preDecodeImage(src);
    });

    // Build initial slice columns
    for (let col = 0; col < cols; col++) {
      const part = document.createElement('div');
      part.className = 'part';
      part.style.setProperty('--x', `${(-100 / cols) * col}vw`);

      const el = document.createElement('div');
      el.className = 'section';

      const img = document.createElement('img');
      img.src = sliceImages[currentSliceIdx];
      img.alt = `Adrithi Cinematic Capture ${currentSliceIdx + 1}`;
      el.appendChild(img);

      part.appendChild(el);
      contactSlider.appendChild(part);
      parts.push(part);
    }

    const animDuration = 0.95;

    function goSlice(dir = 1) {
      if (isSlicePlaying) return;
      isSlicePlaying = true;

      if (currentSliceIdx + dir < 0) {
        currentSliceIdx = sliceImages.length - 1;
      } else if (currentSliceIdx + dir >= sliceImages.length) {
        currentSliceIdx = 0;
      } else {
        currentSliceIdx += dir;
      }

      const nextSrc = sliceImages[currentSliceIdx];
      const winH = (contactSection && contactSection.offsetHeight) || window.innerHeight;

      let completedParts = 0;
      function handlePartDone() {
        completedParts++;
        if (completedParts >= parts.length) {
          isSlicePlaying = false;
        }
      }

      function slideUp(part, nextEl) {
        part.appendChild(nextEl);
        if (typeof gsap !== 'undefined') {
          gsap.to(part, {
            y: -winH,
            duration: animDuration,
            ease: 'power3.inOut',
            onComplete: () => {
              if (part.children[0]) part.children[0].remove();
              gsap.set(part, { y: 0 });
              handlePartDone();
            }
          });
        } else {
          if (part.children[0]) part.children[0].remove();
          handlePartDone();
        }
      }

      function slideDown(part, nextEl) {
        part.prepend(nextEl);
        if (typeof gsap !== 'undefined') {
          gsap.set(part, { y: -winH });
          gsap.to(part, {
            y: 0,
            duration: animDuration,
            ease: 'power3.inOut',
            onComplete: () => {
              if (part.children[1]) part.children[1].remove();
              handlePartDone();
            }
          });
        } else {
          if (part.children[1]) part.children[1].remove();
          handlePartDone();
        }
      }

      parts.forEach((part, p) => {
        const nextEl = document.createElement('div');
        nextEl.className = 'section';

        const img = document.createElement('img');
        img.src = nextSrc;
        img.alt = `Adrithi Cinematic Capture ${currentSliceIdx + 1}`;
        nextEl.appendChild(img);

        // Alternating columns: odd columns slide down, even columns slide up
        if (p % 2 !== 0) {
          slideDown(part, nextEl);
        } else {
          slideUp(part, nextEl);
        }
      });
    }

    // Auto-advance automatically every 1.5 seconds
    function startAutoSlice() {
      if (sliceInterval) clearInterval(sliceInterval);
      sliceInterval = setInterval(() => {
        if (!isSlicePlaying) {
          goSlice(1);
        }
      }, 1500);
    }

    function stopAutoSlice() {
      if (sliceInterval) {
        clearInterval(sliceInterval);
        sliceInterval = null;
      }
    }

    // Manual navigation buttons
    if (slicePrevBtn) {
      slicePrevBtn.addEventListener('click', () => {
        stopAutoSlice();
        goSlice(-1);
        startAutoSlice();
      });
    }

    if (sliceNextBtn) {
      sliceNextBtn.addEventListener('click', () => {
        stopAutoSlice();
        goSlice(1);
        startAutoSlice();
      });
    }

    // Auto-play when section enters viewport
    if (typeof IntersectionObserver !== 'undefined' && contactSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoSlice();
          } else {
            stopAutoSlice();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(contactSection);
    } else {
      startAutoSlice();
    }
  }

  // =========================================================================
  // 5B. HOMEPAGE FAQ ACCORDION CONTROLLER
  // =========================================================================
  const homeFaqItems = document.querySelectorAll('#homeFaqAccordion .contact-faq-item');
  if (homeFaqItems.length > 0) {
    homeFaqItems.forEach(item => {
      const qBtn = item.querySelector('.contact-faq-question');
      if (qBtn) {
        qBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isActive = item.classList.contains('active');
          // Close all items
          homeFaqItems.forEach(i => {
            i.classList.remove('active');
            const btn = i.querySelector('.contact-faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            qBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // =========================================================================
  // 6. TOP NAVBAR SCROLL SPY & LINK HIGHLIGHTING
  // =========================================================================
  const navSections = [
    { id: 'heroSection', link: document.querySelector('.site-nav-link[href="#heroSection"]') },
    { id: 'aboutSection', link: document.querySelector('.site-nav-link[href="#aboutSection"]') },
    { id: 'servicesSection', link: document.querySelector('.site-nav-link[href="#servicesSection"]') },
    { id: 'contactSection', link: document.querySelector('.site-nav-link[href="#contactSection"]') }
  ];

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const about = document.getElementById('aboutSection');
    const services = document.getElementById('servicesSection');
    const contact = document.getElementById('contactSection');

    const aTop = about ? about.offsetTop - 140 : 600;
    const sTop = services ? services.offsetTop - 140 : 1400;
    const cTop = contact ? contact.offsetTop - 140 : 2200;

    let activeId = 'heroSection';
    if (y >= cTop) {
      activeId = 'contactSection';
    } else if (y >= sTop) {
      activeId = 'servicesSection';
    } else if (y >= aTop) {
      activeId = 'aboutSection';
    }

    navSections.forEach(({ id, link }) => {
      if (!link) return;
      if (id === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  // Helper to smoothly scroll to sections accounting for fixed navbar offset
  function scrollToSection(targetId) {
    const navH = 64;
    if (targetId === '#heroSection') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      const topPos = targetEl.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
    }
  }

  // Desktop Navbar links, Brand, & Footer navigation links
  document.querySelectorAll('.site-nav-link, .site-navbar__brand, .footer-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href);
      }
    });
  });

  // Footer Back to Top button
  const footerBackToTopBtn = document.getElementById('footerBackToTop');
  if (footerBackToTopBtn) {
    footerBackToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('#heroSection');
    });
  }

  // Footer Archival Service Buttons — Open Fluid Category Gallery
  document.querySelectorAll('.footer-service-btn').forEach((btn) => {
    const category = btn.getAttribute('data-category');
    if (category) {
      btn.addEventListener('mouseenter', () => preloadCategory(category));
      btn.addEventListener('touchstart', () => preloadCategory(category), { passive: true });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCategoryGallery(category);
      });
    }
  });

  // =========================================================================
  // 7. MOBILE NAVIGATION & SERVICES DRAWER CONTROLLER
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('is-active');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('is-active');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  // Smooth scroll and auto-close when clicking mobile nav links
  document.querySelectorAll('.mobile-nav-item').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        closeMobileNav();
        setTimeout(() => {
          scrollToSection(targetId);
        }, 120);
      }
    });
  });

  // Hero Scroll Cue Smooth Scroll
  const heroScrollCue = document.querySelector('.hero-scroll-cue');
  if (heroScrollCue) {
    heroScrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      const href = heroScrollCue.getAttribute('href') || '#aboutSection';
      scrollToSection(href);
    });
  }

  // =========================================================================
  // 8. LEGAL DOCUMENT MODAL & COOKIE PERMISSION CONTROLLER
  // =========================================================================
  const legalModal = document.getElementById('legalDocModal');
  const legalModalCloseBtn = document.getElementById('legalModalCloseBtn');
  const legalModalBackdrop = document.getElementById('legalModalBackdrop');
  const legalTabBtns = document.querySelectorAll('.legal-tab-btn');
  const legalTabContents = {
    terms: document.getElementById('legalTabTerms'),
    privacy: document.getElementById('legalTabPrivacy'),
    cookies: document.getElementById('legalTabCookies')
  };

  function switchLegalTab(tabName) {
    legalTabBtns.forEach((btn) => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    Object.entries(legalTabContents).forEach(([key, el]) => {
      if (!el) return;
      if (key === tabName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const modalBody = legalModal ? legalModal.querySelector('.legal-modal-body') : null;
    if (modalBody) modalBody.scrollTop = 0;
  }

  function openLegalModal(initialTab = 'terms') {
    if (!legalModal) return;
    switchLegalTab(initialTab);
    legalModal.style.display = 'flex';
    requestAnimationFrame(() => {
      legalModal.classList.add('is-active');
      legalModal.setAttribute('aria-hidden', 'false');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('is-active');
    legalModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      legalModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }

  if (legalModalCloseBtn) legalModalCloseBtn.addEventListener('click', closeLegalModal);
  if (legalModalBackdrop) legalModalBackdrop.addEventListener('click', closeLegalModal);

  legalTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchLegalTab(tab);
    });
  });

  // Bind all triggers with [data-legal] across footer, banner & colophon
  document.querySelectorAll('[data-legal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.getAttribute('data-legal');
      openLegalModal(tab || 'terms');
    });
  });

  // Cookie Permission Floating Banner Controller
  const cookieBanner = document.getElementById('cookieConsentBanner');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieDeclineBtn = document.getElementById('cookieDeclineBtn');
  const cookieAcceptModal = document.getElementById('cookieAcceptFromModal');
  const cookieResetModal = document.getElementById('cookieResetFromModal');

  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('is-visible');
  }

  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.add('is-visible');
  }

  // Check consent state on page load (delays until user scrolls past hero so controls remain fully visible)
  try {
    const consent = localStorage.getItem('adrithi_cookie_consent');
    if (!consent) {
      let triggered = false;
      const triggerCookieBanner = () => {
        if (triggered) return;
        triggered = true;
        showCookieBanner();
        window.removeEventListener('scroll', onScrollTrigger);
      };
      const onScrollTrigger = () => {
        if (window.scrollY > 180) triggerCookieBanner();
      };
      window.addEventListener('scroll', onScrollTrigger, { passive: true });
      // Generous fallback timer so it never interrupts the hero impression
      setTimeout(triggerCookieBanner, 9000);
    }
  } catch (e) {}

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      try { localStorage.setItem('adrithi_cookie_consent', 'accepted'); } catch (e) {}
      hideCookieBanner();
    });
  }

  if (cookieDeclineBtn) {
    cookieDeclineBtn.addEventListener('click', () => {
      try { localStorage.setItem('adrithi_cookie_consent', 'declined'); } catch (e) {}
      hideCookieBanner();
    });
  }

  if (cookieAcceptModal) {
    cookieAcceptModal.addEventListener('click', () => {
      try { localStorage.setItem('adrithi_cookie_consent', 'accepted'); } catch (e) {}
      hideCookieBanner();
      closeLegalModal();
    });
  }

  if (cookieResetModal) {
    cookieResetModal.addEventListener('click', () => {
      try { localStorage.removeItem('adrithi_cookie_consent'); } catch (e) {}
      closeLegalModal();
      setTimeout(showCookieBanner, 400);
    });
  }

  // Initialize horizontal services gallery
  initHorizontalServicesGallery();

  // Initialize About Section 3D Card Animation (from thesrpictures.in)
  initAboutCardAnimation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapAdrithiApp);
} else {
  bootstrapAdrithiApp();
}

/**
 * =========================================================================
 * ABOUT SECTION: 3D PERSPECTIVE CARD ANIMATION & SCROLL-DRIVEN STAR EMBLEM
 * Modeled directly on thesrpictures.in .section-home-intro & partner cards:
 * 1. Cursor-driven 3D tilt with dynamic rotateX/rotateY & scale3d(1.02)
 * 2. Dynamic specular radial glare tracking mouse coordinates
 * 3. Continuous scroll-driven rotation of star_icon.svg
 * 4. Micro-tilt on companion feature cards
 * 5. GSAP ScrollTrigger float-in entrance
 * =========================================================================
 */
function initAboutCardAnimation() {
  const card = document.getElementById('aboutCardContainer');
  const star = document.getElementById('aboutStarIcon');
  const miniCards = document.querySelectorAll('.about-mini-card[data-tilt]');

  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 10 deg X-tilt, Max 12 deg Y-tilt
      const rotateX = -((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 12;

      // Glare position in percentages
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--gx', `${glareX.toFixed(1)}%`);
      card.style.setProperty('--gy', `${glareY.toFixed(1)}%`);
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--gx', '50%');
      card.style.setProperty('--gy', '50%');
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // Scroll-driven continuous rotating star emblem
  if (star) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const deg = (scrollY * 0.35) % 360;
      star.style.setProperty('--star-rot', `${deg.toFixed(1)}deg`);
      star.style.transform = `rotate(${deg.toFixed(1)}deg)`;
    }, { passive: true });
  }

  // Companion 3D tilt mini cards
  miniCards.forEach((mini) => {
    mini.addEventListener('mousemove', (e) => {
      const rect = mini.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = -((y - centerY) / centerY) * 8;
      const rotY = ((x - centerX) / centerX) * 10;
      mini.style.transform = `perspective(600px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px) scale(1.02)`;
    });
    mini.addEventListener('mouseleave', () => {
      mini.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });

  // GSAP ScrollTrigger floating entrance if GSAP is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && card) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '#aboutSection',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    });
  }
}
