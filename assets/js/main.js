const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const header = document.querySelector('.header');

if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const animatedHero = document.querySelector('.has-hero-intro .hero');
const heroLogoFrame = animatedHero?.querySelector('.hero-logo-frame');
const heroIntroStage = animatedHero?.querySelector('.hero-intro-stage');
const heroIntroSticky = animatedHero?.querySelector('.hero-intro-sticky');

if (animatedHero && heroLogoFrame && heroIntroStage && heroIntroSticky) {
  let heroIntroFrameRequested = false;

  const updateHeroIntro = () => {
    const isMobile = window.innerWidth <= 700;
    const initialScale = isMobile ? 1.08 : 1.14;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const headerHeight = header?.offsetHeight || 0;
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
    heroIntroFrameRequested = false;
  };

  const requestHeroIntroUpdate = () => {
    if (heroIntroFrameRequested) return;
    heroIntroFrameRequested = true;
    window.requestAnimationFrame(updateHeroIntro);
  };

  updateHeroIntro();
  window.addEventListener('scroll', requestHeroIntroUpdate, { passive: true });
  window.addEventListener('resize', requestHeroIntroUpdate, { passive: true });
}

const heroImage = document.querySelector('.hero-image');

if (heroImage) {
  let heroFrameRequested = false;

  const updateHeroImagePosition = () => {
    const frame = heroImage.closest('.hero-image-link');
    const bounds = frame.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));

    heroImage.style.setProperty('--hero-image-position', `${(progress * 100).toFixed(2)}%`);
    heroFrameRequested = false;
  };

  const requestHeroImageUpdate = () => {
    if (heroFrameRequested) return;
    heroFrameRequested = true;
    window.requestAnimationFrame(updateHeroImagePosition);
  };

  updateHeroImagePosition();
  window.addEventListener('scroll', requestHeroImageUpdate, { passive: true });
  window.addEventListener('resize', requestHeroImageUpdate, { passive: true });
}

const galleryScrollImages = [...document.querySelectorAll('.collection-gallery .gallery-item img')];

if (galleryScrollImages.length) {
  let galleryFrameRequested = false;
  const galleryPositionRange = document.querySelector('.mater-page') ? 38 : 100;

  const updateGalleryImagePositions = () => {
    const viewportHeight = window.innerHeight;

    galleryScrollImages.forEach((image) => {
      const frame = image.closest('.gallery-item');
      const bounds = frame.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));

      image.style.setProperty('--gallery-image-position', `${(progress * galleryPositionRange).toFixed(2)}%`);
    });

    galleryFrameRequested = false;
  };

  const requestGalleryImageUpdate = () => {
    if (galleryFrameRequested) return;
    galleryFrameRequested = true;
    window.requestAnimationFrame(updateGalleryImagePositions);
  };

  updateGalleryImagePositions();
  window.addEventListener('scroll', requestGalleryImageUpdate, { passive: true });
  window.addEventListener('resize', requestGalleryImageUpdate, { passive: true });
}

const projectPreviews = document.querySelectorAll('[data-preview-images]');

projectPreviews.forEach((project, projectIndex) => {
  const previewFrame = project.querySelector('.project-preview');
  const firstPreview = previewFrame?.querySelector('img');
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

const sketchButtons = [...document.querySelectorAll('[data-sketch-src]')];
const sketchMain = document.querySelector('#sketch-main');
const sketchCounter = document.querySelector('#sketch-counter');
const sketchOpen = document.querySelector('#sketch-open');

if (sketchButtons.length && sketchMain && sketchCounter && sketchOpen) {
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
}
