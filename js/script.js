/* =========================================================
   PURE INDIA — shared site script
   ========================================================= */

/* --------------------------------------------------------
   1. SET YOUR AMAZON LISTING LINK HERE — updates every
      "Buy on Amazon" button across every page automatically.
   -------------------------------------------------------- */
const AMAZON_LINK = "https://amzn.in/d/0aczdDut"; // Spearmint Tea (default — used anywhere a button doesn't set its own data-amazon-link)
const AMAZON_LINK_HIBISCUS = "https://www.amazon.in/dp/B0HHN81339";
const AMAZON_LINK_TRAILMIX = "https://www.amazon.in/dp/B0HHMR45QD";
const AMAZON_LINK_BUTTERFLYPEA = "https://amzn.in/d/01SbkFHP";
const FLIPKART_LINK = "https://www.flipkart.com/"; // TODO: replace with your real Pure India Flipkart listing URL
const MEESHO_LINK = "https://www.meesho.com/s/p/gzcj8j?utm_source=s_w";

/* ---------------- WhatsApp customer support link ---------------- */
const WHATSAPP_NUMBER = "919877934136"; // Pure India customer support
const WHATSAPP_MESSAGE = "Hi Pure India! I'd like to place a direct order and get free shipping.";
const WHATSAPP_LINK = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);

/* ---------------- Site loader ---------------- */
(() => {
  const loader = document.getElementById('siteLoader');
  if (!loader) return;
  const MIN_VISIBLE = 650; // keep it on screen briefly even on fast loads
  const shownAt = Date.now();

  const hide = () => {
    const wait = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt));
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.documentElement.classList.remove('is-loading');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, wait);
  };

  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
})();

document.addEventListener('DOMContentLoaded', () => {

  // Apply the marketplace links everywhere.
  // Buttons on the Hibiscus and Trail Mix pages carry a data-amazon-link
  // attribute pointing at their own listing; every other Amazon button
  // (footer, homepage, the Spearmint page) falls back to AMAZON_LINK.
  document.querySelectorAll('.amazon-cta').forEach(el => {
    el.href = el.dataset.amazonLink || AMAZON_LINK;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll('.flipkart-cta').forEach(el => {
    el.href = FLIPKART_LINK;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll('.meesho-cta').forEach(el => {
    el.href = MEESHO_LINK;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll('.whatsapp-cta').forEach(el => {
    el.href = WHATSAPP_LINK;
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav){
    menuToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
  }

  /* ---------------- Search bar ---------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchBar){
    searchToggle.addEventListener('click', () => {
      const open = searchBar.classList.toggle('open');
      if (open && searchInput) searchInput.focus();
    });
  }
  if (searchBar){
    searchBar.addEventListener('submit', (e) => {
      e.preventDefault();
      // Sends every search to the Shop catalog page for now.
      // Swap this for real search/filtering once the catalogue grows further.
      window.location.href = 'shop.html';
    });
  }

  /* ---------------- Accordion (Shop + FAQ pages) ---------------- */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------------- FAQ category filter ---------------- */
  const catButtons = document.querySelectorAll('.faq-cat-btn');
  const faqGroups = document.querySelectorAll('.faq-group');
  if (catButtons.length){
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        faqGroups.forEach(group => {
          group.style.display = (target === 'all' || group.dataset.cat === target) ? 'block' : 'none';
        });
      });
    });
  }

  /* ---------------- Quantity steppers (Shop page + Home product showcase) ---------------- */
  document.querySelectorAll('.qty-box').forEach(box => {
    const display = box.querySelector('span');
    let qty = parseInt(display.textContent, 10) || 1;
    const setQty = (val) => {
      qty = Math.min(10, Math.max(1, val));
      display.textContent = qty;
    };
    box.querySelector('.qty-minus').addEventListener('click', () => setQty(qty - 1));
    box.querySelector('.qty-plus').addEventListener('click', () => setQty(qty + 1));
    box._setQty = setQty;
  });

  /* ---------------- Pack size selector (Home showcase + every Shop product page) ---------------- */
  document.querySelectorAll('.pack-scroller').forEach(scroller => {
    const cards = scroller.querySelectorAll('.pack-card');
    const section = scroller.closest('.product-showcase, .product-detail') || document;
    const qtyBox = section.querySelector('.qty-box');
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (qtyBox && qtyBox._setQty){
          qtyBox._setQty(i + 1);
        }
      });
    });
  });

  /* ---------------- Newsletter + Contact forms (no backend yet) ---------------- */
  document.querySelectorAll('[data-fake-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      if (msg){
        msg.textContent = form.dataset.successMsg || "Thanks — we'll be in touch soon!";
        msg.classList.add('show');
      }
      form.reset();
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Hero carousel (Home page) ---------------- */
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel){
    const track = heroCarousel.querySelector('.carousel-track');
    const slides = heroCarousel.querySelectorAll('.carousel-slide');
    const dots = heroCarousel.querySelectorAll('.dot');
    const prevBtn = heroCarousel.querySelector('.carousel-arrow.prev');
    const nextBtn = heroCarousel.querySelector('.carousel-arrow.next');
    let index = 0;
    let timer;

    function goTo(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    function play(){
      timer = setInterval(() => goTo(index + 1), 6500);
    }
    function pause(){ clearInterval(timer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); pause(); play(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); pause(); play(); });
    dots.forEach(dot => dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); pause(); play(); }));
    heroCarousel.addEventListener('mouseenter', pause);
    heroCarousel.addEventListener('mouseleave', play);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) play();
  }

  /* ---------------- Gallery thumb swap (Shop page) ---------------- */
  const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
  const mainImage = document.querySelector('.gallery-main img');
  if (thumbs.length && mainImage){
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const thumbImg = thumb.querySelector('img');
        mainImage.src = thumbImg.src;
        mainImage.alt = thumbImg.alt;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  /* ---------------- Dynamic product image folders ---------------- */
  initDynamicThumbnails();
  initDynamicGalleries();
});

/* =========================================================
   DYNAMIC PRODUCT IMAGES
   Drop photos into a product's public/"<name> images" folder
   named main.jpg, alt1.jpg, alt2.jpg, alt3.jpg ... (jpg/jpeg/png/webp
   all work) and they are picked up automatically — no code edits
   needed. Elements opt in with data-dynamic-image-folder (small
   card/cross-sell thumbnails) or data-gallery-folder (full product
   gallery + thumb strip). If a folder has no images yet, the
   existing placeholder graphic stays exactly as it is.
   ========================================================= */
const DYNAMIC_IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const DYNAMIC_IMG_MAX_ALTS = 20;

function dynamicImageCheck(src){
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function dynamicImageFind(folder, baseName){
  for (const ext of DYNAMIC_IMG_EXTENSIONS){
    const hit = await dynamicImageCheck(`${folder}/${baseName}.${ext}`);
    if (hit) return hit;
  }
  return null;
}

async function dynamicImageLoadAll(folder){
  const names = ['main'];
  for (let i = 1; i <= DYNAMIC_IMG_MAX_ALTS; i++) names.push('alt' + i);
  const results = await Promise.all(names.map(name => dynamicImageFind(folder, name)));
  return results.filter(Boolean);
}

async function dynamicImageFindOne(folder){
  const main = await dynamicImageFind(folder, 'main');
  if (main) return main;
  for (let i = 1; i <= DYNAMIC_IMG_MAX_ALTS; i++){
    const alt = await dynamicImageFind(folder, 'alt' + i);
    if (alt) return alt;
  }
  return null;
}

async function initDynamicThumbnails(){
  const nodes = document.querySelectorAll('[data-dynamic-image-folder]');
  await Promise.all(Array.from(nodes).map(async node => {
    const folder = node.dataset.dynamicImageFolder;
    const src = await dynamicImageFindOne(folder);
    if (!src) return; // no photos yet — leave the placeholder graphic as-is
    const alt = node.dataset.dynamicImageAlt || '';
    const DYNAMIC_IMG_MODIFIER_CLASSES = [
      'placeholder-hibiscus', 'placeholder-trailmix', 'placeholder-bundle',
      'crosssell-hibiscus', 'crosssell-trailmix', 'crosssell-spearmint'
    ];
    DYNAMIC_IMG_MODIFIER_CLASSES.forEach(cls => node.classList.remove(cls));
    node.innerHTML = '';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = alt;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    node.appendChild(img);
  }));
}

async function initDynamicGalleries(){
  const wraps = document.querySelectorAll('[data-gallery-folder]');
  await Promise.all(Array.from(wraps).map(async wrap => {
    const folder = wrap.dataset.galleryFolder;
    const name = wrap.dataset.galleryName || '';
    const images = await dynamicImageLoadAll(folder);
    if (!images.length) return; // no photos yet — leave the placeholder gallery as-is

    const mainEl = wrap.querySelector('.gallery-main');
    if (!mainEl) return;
    mainEl.className = 'gallery-main';
    mainEl.innerHTML = '';
    const mainImg = document.createElement('img');
    mainImg.src = images[0];
    mainImg.alt = name;
    mainEl.appendChild(mainImg);

    let thumbsEl = wrap.querySelector('.gallery-thumbs');
    if (!thumbsEl){
      thumbsEl = document.createElement('div');
      thumbsEl.className = 'gallery-thumbs';
      mainEl.insertAdjacentElement('afterend', thumbsEl);
    }
    thumbsEl.innerHTML = images.map((src, i) =>
      `<div class="thumb${i === 0 ? ' active' : ''}"><img loading="lazy" src="${src}" alt="${name}"></div>`
    ).join('');

    const thumbEls = thumbsEl.querySelectorAll('.thumb');
    thumbEls.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const thumbImg = thumb.querySelector('img');
        mainImg.src = thumbImg.src;
        mainImg.alt = thumbImg.alt;
        thumbEls.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }));
}
