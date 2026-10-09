const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

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
