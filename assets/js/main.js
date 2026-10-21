const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const header = document.querySelector('.header');

const viewportUpdateCallbacks = [];
let viewportFrameRequested = false;

const requestViewportUpdates = () => {
  if (viewportFrameRequested) return;
  viewportFrameRequested = true;

  window.requestAnimationFrame(() => {
    viewportFrameRequested = false;
    viewportUpdateCallbacks.forEach((callback) => callback());
  });
};

const bindViewportUpdates = (callback) => viewportUpdateCallbacks.push(callback);

window.addEventListener('scroll', requestViewportUpdates, { passive: true });
window.addEventListener('resize', requestViewportUpdates, { passive: true });
window.addEventListener('orientationchange', requestViewportUpdates, { passive: true });
window.addEventListener('pageshow', requestViewportUpdates);

if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  bindViewportUpdates(updateHeader);
}

const animatedHero = document.querySelector('.has-hero-intro .hero');
const heroLogoFrame = animatedHero ? animatedHero.querySelector('.hero-logo-frame') : null;
const heroIntroStage = animatedHero ? animatedHero.querySelector('.hero-intro-stage') : null;
const heroIntroSticky = animatedHero ? animatedHero.querySelector('.hero-intro-sticky') : null;
const heroBottom = animatedHero ? animatedHero.querySelector('.hero-bottom') : null;

if (animatedHero && heroLogoFrame && heroIntroStage && heroIntroSticky && heroBottom) {
  let heroIntroMetrics = null;
  let heroIntroLayoutWidth = 0;

  const measureHeroIntro = () => {
    const isMobile = window.innerWidth <= 700;
    const initialScale = isMobile ? 1.08 : 1.14;
    const headerHeight = header ? header.offsetHeight : 0;
    const viewportHeight = heroIntroSticky.offsetHeight + headerHeight;
    let logoDocumentTop = 0;
    let logoOffsetElement = heroLogoFrame;
    let stageDocumentTop = 0;
    let stageOffsetElement = heroIntroStage;

    while (logoOffsetElement) {
      logoDocumentTop += logoOffsetElement.offsetTop;
      logoOffsetElement = logoOffsetElement.offsetParent;
    }

    while (stageOffsetElement) {
      stageDocumentTop += stageOffsetElement.offsetTop;
      stageOffsetElement = stageOffsetElement.offsetParent;
    }

    const viewportCenter = headerHeight + ((viewportHeight - headerHeight) / 2);
    const logoCenter = logoDocumentTop + ((heroLogoFrame.offsetHeight * initialScale) / 2);
    const initialTranslate = Math.max(0, viewportCenter - logoCenter);
    const stickyReleasePoint = stageDocumentTop + heroIntroStage.offsetHeight - heroIntroSticky.offsetHeight - headerHeight;
    const scrollRange = Math.max(isMobile ? 320 : 380, stickyReleasePoint);
    const requestedPullUp = isMobile ? 410 : Math.min(430, Math.max(360, window.innerHeight * .4));
    const copyBottom = heroBottom.offsetTop + heroBottom.offsetHeight;
    const minimumGap = isMobile ? 24 : 32;
    const safeImageMargin = Math.max(-requestedPullUp, copyBottom + minimumGap - heroIntroSticky.offsetHeight);

    animatedHero.style.setProperty('--hero-image-margin', `${safeImageMargin.toFixed(2)}px`);

    heroIntroMetrics = { isMobile, initialScale, initialTranslate, scrollRange };
    heroIntroLayoutWidth = window.innerWidth;
  };

  const updateHeroIntro = () => {
    if (!heroIntroMetrics || Math.abs(window.innerWidth - heroIntroLayoutWidth) > 1) {
      measureHeroIntro();
    }

    const { isMobile, initialScale, initialTranslate, scrollRange } = heroIntroMetrics;
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    const easedProgress = progress * progress * (3 - (2 * progress));
    const copyProgress = Math.min(1, Math.max(0, (progress - .24) / .46));
    const easedCopyProgress = copyProgress * copyProgress * (3 - (2 * copyProgress));
    const imageRevealProgress = Math.min(1, Math.max(0, (progress - .70) / .22));
    const easedImageRevealProgress = imageRevealProgress * imageRevealProgress * (3 - (2 * imageRevealProgress));

    animatedHero.style.setProperty('--hero-logo-scale', (initialScale - ((initialScale - 1) * easedProgress)).toFixed(4));
    animatedHero.style.setProperty('--hero-logo-translate', `${(initialTranslate * (1 - easedProgress)).toFixed(2)}px`);
    animatedHero.style.setProperty('--hero-copy-opacity', easedCopyProgress.toFixed(4));
    animatedHero.style.setProperty('--hero-copy-shift', `${((1 - easedCopyProgress) * (isMobile ? 24 : 38)).toFixed(2)}px`);
    animatedHero.style.setProperty('--hero-image-reveal', easedImageRevealProgress.toFixed(4));
    animatedHero.style.setProperty('--hero-image-reveal-shift', `${((1 - easedImageRevealProgress) * (isMobile ? 22 : 34)).toFixed(2)}px`);
    animatedHero.classList.toggle('is-copy-visible', copyProgress > .025);
    animatedHero.classList.toggle('is-image-visible', imageRevealProgress > .01);
    animatedHero.classList.add('is-intro-ready');
  };

  updateHeroIntro();
  bindViewportUpdates(updateHeroIntro);
}

const heroImage = document.querySelector('.hero-image');

if (heroImage) {
  const updateHeroImagePosition = () => {
    const frame = heroImage.closest('.hero-image-link');
    const bounds = frame.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));

    const isMobile = window.innerWidth <= 700;
    const position = isMobile ? ((progress - .5) * 6) : (progress * 100);
    const previousPosition = Number(heroImage.dataset.scrollPosition || -1);

    if (Math.abs(position - previousPosition) > .15) {
      const property = isMobile ? '--hero-image-shift' : '--hero-image-position';
      heroImage.style.setProperty(property, `${position.toFixed(2)}%`);
      heroImage.dataset.scrollPosition = position.toFixed(2);
    }
  };

  updateHeroImagePosition();
  bindViewportUpdates(updateHeroImagePosition);
}

const galleryScrollImages = [...document.querySelectorAll('.collection-gallery .gallery-item img')];

if (galleryScrollImages.length) {
  const galleryPositionRange = document.querySelector('.mater-page') ? 38 : 100;
  const activeGalleryImages = new Set();

  if ('IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const image = entry.target.querySelector('img');
        if (!image) return;

        if (entry.isIntersecting) activeGalleryImages.add(image);
        else activeGalleryImages.delete(image);

        entry.target.classList.toggle('is-scroll-active', entry.isIntersecting);
      });

      requestViewportUpdates();
    }, { rootMargin: '35% 0px' });

    galleryScrollImages.forEach((image) => galleryObserver.observe(image.closest('.gallery-item')));
  } else {
    galleryScrollImages.forEach((image) => activeGalleryImages.add(image));
  }

  const updateGalleryImagePositions = () => {
    const viewportHeight = window.innerHeight;

    activeGalleryImages.forEach((image) => {
      const frame = image.closest('.gallery-item');
      const bounds = frame.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));

      const isMobile = window.innerWidth <= 700;
      const position = isMobile ? ((progress - .5) * 6) : (progress * galleryPositionRange);
      const previousPosition = Number(image.dataset.scrollPosition || -1);

      if (Math.abs(position - previousPosition) > .15) {
        const property = isMobile ? '--gallery-image-shift' : '--gallery-image-position';
        image.style.setProperty(property, `${position.toFixed(2)}%`);
        image.dataset.scrollPosition = position.toFixed(2);
      }
    });
  };

  updateGalleryImagePositions();
  bindViewportUpdates(updateGalleryImagePositions);
}

const projectPreviews = document.querySelectorAll('[data-preview-images]');

projectPreviews.forEach((project, projectIndex) => {
  const previewFrame = project.querySelector('.project-preview');
  const firstPreview = previewFrame ? previewFrame.querySelector('img') : null;
  const images = project.dataset.previewImages
    .split('|')
    .map((source) => source.trim())
    .filter(Boolean);

  if (!previewFrame || !firstPreview || images.length < 2) return;

  images.slice(1).forEach((source) => {
    const preload = new Image();
    preload.src = source;
  });

  firstPreview.classList.add('is-visible');
  const secondPreview = firstPreview.cloneNode();
  secondPreview.classList.remove('is-visible');
  secondPreview.alt = '';
  secondPreview.setAttribute('aria-hidden', 'true');
  secondPreview.removeAttribute('loading');
  previewFrame.append(secondPreview);

  let currentImage = 0;
  let visiblePreview = firstPreview;
  let hiddenPreview = secondPreview;

  window.setTimeout(() => {
    window.setInterval(() => {
      currentImage = (currentImage + 1) % images.length;
      hiddenPreview.src = images[currentImage];

      const showNextPreview = () => {
        hiddenPreview.classList.add('is-visible');
        visiblePreview.classList.remove('is-visible');
        [visiblePreview, hiddenPreview] = [hiddenPreview, visiblePreview];
      };

      if (hiddenPreview.complete) {
        showNextPreview();
      } else {
        hiddenPreview.addEventListener('load', showNextPreview, { once: true });
      }
    }, 8000);
  }, projectIndex * 450);
});

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'CERRAR ×' : 'MENÚ +';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.textContent = 'MENÚ +';
    });
  });
}

const lightbox = document.querySelector('#lightbox');
const galleryItems = [...document.querySelectorAll('[data-lightbox-src]')];

if (lightbox && galleryItems.length) {
  const lightboxImage = lightbox.querySelector('#lightbox-image');
  const lightboxCaption = lightbox.querySelector('#lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  const showImage = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImage.src = item.dataset.lightboxSrc;
    lightboxImage.alt = item.dataset.lightboxAlt;
    lightboxCaption.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')} — ${item.dataset.lightboxAlt}`;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      lightbox.showModal();
    });
  });

  closeButton.addEventListener('click', () => lightbox.close());
  previousButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

document.querySelectorAll('[data-sketch-viewer]').forEach((viewer) => {
  const sketchButtons = [...viewer.querySelectorAll('[data-sketch-src]')];
  const sketchMain = viewer.querySelector('[data-sketch-main]');
  const sketchCounter = viewer.querySelector('[data-sketch-counter]');
  const sketchOpen = viewer.querySelector('[data-sketch-open]');

  if (!sketchButtons.length || !sketchMain || !sketchCounter || !sketchOpen) return;

  sketchButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      sketchButtons.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      sketchMain.src = button.dataset.sketchSrc;
      sketchMain.alt = button.dataset.sketchAlt;
      sketchOpen.href = button.dataset.sketchSrc;
      sketchCounter.textContent = `LÁMINA ${String(index + 1).padStart(2, '0')} / ${String(sketchButtons.length).padStart(2, '0')}`;
    });
  });
});
