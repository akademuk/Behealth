'use strict';

/* ========================================
   Burger Menu
   ======================================== */

const burger         = document.querySelector('.burger');
const mobileMenu     = document.querySelector('.mobile-menu');
const header         = document.querySelector('.header');

// Вимірюємо ширину скролбара один раз
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');

// Вимірюємо висоту хедера і синхронізуємо з мобільним меню
function syncHeaderHeight() {
  if (!header) return;
  const h = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', h + 'px');
  if (mobileMenu) mobileMenu.style.top = h + 'px';
  if (mobileMenu) mobileMenu.style.height = `calc(100vh - ${h}px)`;
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);

if (burger && mobileMenu) {
  // Відкрити / закрити меню
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });

  // Закрити при кліку на посилання
  mobileMenu.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--sub-trigger)').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Закрити на Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  burger.classList.remove('is-active');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

/* ========================================
   Submenu — Desktop & Mobile
   ======================================== */

document.querySelectorAll('.nav__link--sub-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const item = trigger.closest('.nav__item--has-sub');
    const isOpen = item.classList.toggle('is-open');

    // Закрити інші відкриті підменю
    document.querySelectorAll('.nav__item--has-sub').forEach(el => {
      if (el !== item) el.classList.remove('is-open');
    });
  });
});

document.querySelectorAll('.mobile-menu__link--sub-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.mobile-menu__item--has-sub');
    item.classList.toggle('is-open');
  });
});

// Закрити desktop підменю при кліку поза ним
document.addEventListener('click', () => {
  document.querySelectorAll('.nav__item--has-sub').forEach(el => el.classList.remove('is-open'));
});

/* ========================================
   Hero Video Toggle
   ======================================== */

const heroVideo = document.querySelector('.hero-video');
const heroVideoToggle = document.querySelector('.hero-video-toggle');

if (heroVideo && heroVideoToggle) {
  heroVideoToggle.addEventListener('click', () => {
    if (heroVideo.paused) {
      heroVideo.play();
      heroVideoToggle.classList.add('is-playing');
      heroVideoToggle.setAttribute('aria-label', 'Зупинити відео');
      heroVideoToggle.setAttribute('aria-pressed', 'true');
    } else {
      heroVideo.pause();
      heroVideoToggle.classList.remove('is-playing');
      heroVideoToggle.setAttribute('aria-label', 'Запустити відео');
      heroVideoToggle.setAttribute('aria-pressed', 'false');
    }
  });
}

/* ========================================
   Hero Swiper
   ======================================== */

const heroSwiper = new Swiper('.hero-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 24,
  initialSlide: 2,
  centeredSlides: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: '.hero-swiper__button-next',
    prevEl: '.hero-swiper__button-prev',
  },
  on: {
    setTranslate() {
      this.slides.forEach((slideEl) => {
        const progress = Math.abs(slideEl.progress);
        let opacity;
        if (progress <= 0.5) {
          opacity = 1;
        } else if (progress <= 1.5) {
          opacity = 0.55;
        } else if (progress <= 2.5) {
          opacity = 0.25;
        } else {
          opacity = 0.15;
        }
        slideEl.style.opacity = opacity;
      });
    },
  },
});

/* ========================================
   About — Tabs
   ======================================== */

const aboutTabLinks = document.querySelectorAll('.about__tabs-list-link');
const aboutItems    = document.querySelectorAll('.about__content-item');

function setAboutTab(index) {
  aboutTabLinks.forEach(link => link.classList.toggle('is-active', +link.dataset.index === index));
  aboutItems.forEach(item => item.classList.toggle('is-active', +item.dataset.index === index));
}

aboutTabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setAboutTab(+link.dataset.index);
  });
});

// Перша таба активна за замовчуванням
setAboutTab(0);

/* ========================================
   AOS — Animate On Scroll
   ======================================== */

AOS.init({
  duration: 800,
  easing: 'ease-out-quad',
  once: true,
  offset: 60,
});

/* ========================================
   Lenis — Smooth Scroll
   Вимкнено в Safari (несумісність)
   ======================================== */

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let lenis;

if (!isSafari) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ========================================
   Swiper — Слайдери
   ======================================== */

/* News Swiper */
const newsSwiper = new Swiper('.news__swiper', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  navigation: {
    nextEl: '.news__btn-next',
    prevEl: '.news__btn-prev',
  },
  breakpoints: {
    1280: { spaceBetween: 24 },
  },
});

/* Foundation Swiper */
const foundationSwiper = new Swiper('.foundation__body', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  navigation: {
    nextEl: '.foundation-swiper__button-next',
    prevEl: '.foundation-swiper__button-prev',
  },
  breakpoints: {
    1280: { spaceBetween: 24 },
  },
});

/* Reviews Vacancy Swiper */
const reviewsVacancySwiper = new Swiper('.reviews--vacancy.swiper', {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  navigation: {
    nextEl: '.reviews--vacancy__title-action .news__btn-next',
    prevEl: '.reviews--vacancy__title-action .news__btn-prev',
  },
  breakpoints: {
    768:  { slidesPerView: 2, spaceBetween: 16 },
    1280: { slidesPerView: 3, spaceBetween: 24 },
  },
});

/* New Vacancies Swiper */
const newVacancysReviewsSwiper = new Swiper('.newvacancysreviews__swiper', {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: false,
  navigation: {
    nextEl: '.newvacancysreviews__btn-next',
    prevEl: '.newvacancysreviews__btn-prev',
  },
  breakpoints: {
    768:  { slidesPerView: 2, spaceBetween: 16 },
    1280: { slidesPerView: 3, spaceBetween: 24 },
  },
});

// Приклад:
// const swiper = new Swiper('.swiper', {
//   loop: true,
//   slidesPerView: 1,
//   spaceBetween: 24,
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
//   pagination: {
//     el: '.swiper-pagination',
//     clickable: true,
//   },
//   breakpoints: {
//     768: { slidesPerView: 2 },
//     1024: { slidesPerView: 3 },
//   },
// });

/* ========================================
   Article Sidebar — Scroll Spy
   ======================================== */

const articleSidebarLinks = document.querySelectorAll('.article__sidebar-link');

if (articleSidebarLinks.length) {
  const headerOffset = () => parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  ) || 0;

  // Клік — скрол до якоря
  articleSidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      setActiveLink(link);

      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset() - 24;

      if (lenis) {
        lenis.scrollTo(top, { duration: 1.2 });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Scroll spy — підсвічує активний пункт під час скролу
  const sectionIds = [...articleSidebarLinks].map(l => l.getAttribute('href').slice(1));

  function onArticleScroll() {
    const scrollY = window.scrollY;
    const offset  = headerOffset() + 32;
    let current   = sectionIds[0];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY - offset <= scrollY) {
        current = id;
      }
    });

    articleSidebarLinks.forEach(link => {
      const isActive = link.getAttribute('href').slice(1) === current;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  window.addEventListener('scroll', onArticleScroll, { passive: true });
  onArticleScroll();
}

function setActiveLink(activeLink) {
  articleSidebarLinks.forEach(link => {
    link.classList.toggle('is-active', link === activeLink);
    link.setAttribute('aria-current', link === activeLink ? 'true' : 'false');
  });
}

/* ========================================
   Fancybox — Галерея / Модалки
   ======================================== */

Fancybox.bind('[data-fancybox]', {
  // Опції за потребою
});

/* ========================================
   Maps overlay — скрол працює, клік активує карту
   ======================================== */

const mapsOverlay = document.querySelector('.maps__overlay');
if (mapsOverlay) {
  mapsOverlay.addEventListener('click', () => {
    mapsOverlay.style.display = 'none';
  });
  // Повертаємо оверлей коли миша покидає карту
  const mapsWrap = mapsOverlay.closest('.maps');
  if (mapsWrap) {
    mapsWrap.addEventListener('mouseleave', () => {
      mapsOverlay.style.display = '';
    });
  }
}

/* ========================================
   Parallax — фони + картки
   Зображення збільшене через CSS scale,
   translateY рухає в межах запасу
   ======================================== */

const PARALLAX_SCALE = 1.15;           // 15% запасу — CSS scale
const PARALLAX_MAX   = 0.055;          // max зсув = 5.5% (запас 2% від scale 1.15)

const parallaxItems = [
  // Великі фони
  ...['.awards__bg', '.banner-bg', '.hero--big__bg'].map(s => ({ selector: s, speed: 0.08 })),
  // Картки категорій
  ...['.category__header-img'].map(s => ({ selector: s, speed: 0.04, all: true })),
  // Foundation слайди
  ...['.foundation__article-img'].map(s => ({ selector: s, speed: 0.04, all: true })),
  // Про нас — зображення в картках
  ...['.about__content-item-image'].map(s => ({ selector: s, speed: 0.04, all: true })),
  // Новини — зображення в картках
  ...['.news__card-image'].map(s => ({ selector: s, speed: 0.04, all: true })),
  // Команда — about page
  ...['.about--team-img'].map(s => ({ selector: s, speed: 0.04, all: true })),
].flatMap(({ selector, speed, all }) => {
  const wraps = all
    ? [...document.querySelectorAll(selector)]
    : [document.querySelector(selector)].filter(Boolean);
  return wraps.map(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return null;
    // Збільшуємо через CSS — без зміни DOM
    img.style.transform = 'scale(' + PARALLAX_SCALE + ')';
    img.style.willChange = 'transform';
    return { wrap, img, speed };
  }).filter(Boolean);
});

if (parallaxItems.length) {
  function runParallax() {
    const wh = window.innerHeight;
    parallaxItems.forEach(({ wrap, img, speed }) => {
      const rect   = wrap.getBoundingClientRect();
      const center = (rect.top + rect.height / 2 - wh / 2) / wh; // -0.5…+0.5
      const maxPx  = rect.height * PARALLAX_MAX;
      const y      = Math.max(-maxPx, Math.min(maxPx, center * wh * speed));
      img.style.transform = `scale(${PARALLAX_SCALE}) translateY(${y.toFixed(1)}px)`;
    });
  }

  if (lenis) {
    lenis.on('scroll', runParallax);
  } else {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { runParallax(); ticking = false; }); }
    }, { passive: true });
  }

  runParallax();
}

/* ========================================
   Custom File Upload
   ======================================== */
(function () {
  const area  = document.getElementById('file-upload-area');
  const input = document.getElementById('resume');
  if (!area || !input) return;

  const zone  = area.querySelector('.file-upload__zone');
  const label = area.querySelector('.file-upload__name');

  function setFile(file) {
    if (!file) return;
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      label.textContent = 'Файл занадто великий (макс. 5MB)';
      label.style.color = 'red';
      input.value = '';
      return;
    }
    label.style.color = '';
    label.textContent = file.name;
  }

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) setFile(input.files[0]);
  });

  zone.addEventListener('click', (e) => {
    if (e.target.tagName === 'LABEL') return;
    input.click();
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('file-upload--drag');
  });

  zone.addEventListener('dragleave', () => {
    area.classList.remove('file-upload--drag');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('file-upload--drag');
    const file = e.dataTransfer.files[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      setFile(file);
    }
  });
})();

/* ========================================
   Contact Form Modal
   ======================================== */
(function () {
  const submitBtn   = document.getElementById('submitBtn');
  const modal       = document.getElementById('contactModal');
  const closeBtn    = document.getElementById('contactModalClose');
  const overlay     = document.getElementById('contactModalOverlay');
  if (!submitBtn || !modal) return;

  function openModal() {
    modal.hidden = false;
    if (lenis) lenis.stop();
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    if (lenis) lenis.start();
    submitBtn.focus();
  }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);

  modal.querySelector('.contact-modal__inner').addEventListener('click', (e) => {
    if (!e.target.closest('.contact-modal__box')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
