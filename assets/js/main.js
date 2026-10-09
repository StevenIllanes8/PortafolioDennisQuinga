const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const header = document.querySelector('.header');

if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const heroImage = document.querySelector('.hero-image');

if (heroImage) {
  let heroFrameRequested = false;

  const updateHeroImagePosition = () => {
    const headerHeight = header?.offsetHeight || 0;
    const finalScrollPoint = Math.max(1, heroImage.offsetTop + heroImage.offsetHeight - headerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / finalScrollPoint));

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
