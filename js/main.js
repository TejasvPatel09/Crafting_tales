(function () {
  'use strict';

  /* ============================================================
     FALLBACK DATA — used when fetch() is blocked (e.g. file://).
     Keep in sync with config/products.json (that file is the DB).
     ============================================================ */
  const FALLBACK_DATA = {
    settings: { whatsapp: "918435588589", instagram: "crafting_tales_by_vaishnavi", currency: "₹", processingDays: [15, 20], deliveryDays: [7, 10] },
    categories: [
      { slug: "all", label: "All" },
      { slug: "preservation", label: "Preservation" },
      { slug: "frames", label: "Frames" },
      { slug: "keychains", label: "Keychains" },
      { slug: "resin-art", label: "Resin Art" },
      { slug: "gifts", label: "Gifts" }
    ],
        products: [
      {id:"letter-keychain",name:"Initial Letter Keychain",category:"keychains",tags:["keychains","gifts"],price:100,featured:true,customizable:true,customLabel:"Preferred initial / letter",badge:"Bestseller",description:"A tiny, precious world — dried petals and gold flakes suspended in a resin initial you carry everywhere. A piece of the garden, always with you.",specs:[["Size","3 inches approx."],["Material","Crystal-clear epoxy resin"],["Inclusions","Dried florals + gold leaf"],["Personalisation","Any single initial (A-Z)"]],media:[{type:"image",src:"assets/images/products/letter keychain/IMG-20260705-WA0099.jpg"},{type:"image",src:"assets/images/products/letter keychain/IMG-20260705-WA0100.jpg"},{type:"video",src:"assets/images/products/letter keychain/VID-20260705-WA0102.mp4"},{type:"video",src:"assets/images/products/letter keychain/VID-20260705-WA0106.mp4"}]},
      {id:"photo-keychain",name:"Photo Keychain",category:"keychains",tags:["keychains","gifts"],price:200,featured:true,customizable:true,customLabel:"Photo to set inside",description:"Your favourite photograph, sealed in resin and framed in gold flakes — the people you love, kept close on every set of keys.",specs:[["Size","3 inches approx."],["Material","Crystal-clear epoxy resin"],["Inclusions","Your printed photo + gold leaf"],["Personalisation","Any single photo"]],media:[{type:"image",src:"assets/images/products/photo key chain/IMG-20260705-WA0095.jpg"},{type:"image",src:"assets/images/products/photo key chain/IMG-20260705-WA0096.jpg"},{type:"image",src:"assets/images/products/photo key chain/IMG-20260705-WA0097.jpg"},{type:"image",src:"assets/images/products/photo key chain/IMG-20260705-WA0101.jpg"},{type:"video",src:"assets/images/products/photo key chain/VID-20260705-WA0103.mp4"}]},
      {id:"varmala-frame",name:"Varmala Preservation Frame",category:"frames",tags:["frames","preservation"],price:1700,featured:true,customizable:true,customLabel:"Reference photo of your varmala",badge:"Wedding favourite",description:"Your wedding varmala, arranged and cast in resin, set inside a handcrafted frame to hang as a keepsake of the day it all began. Choose from two frame designs.",specs:[["Size","10 inch"],["Features","With stand"],["Frame Material","Premium teakwood"],["Finish","Crystal-clear epoxy resin"]],variants:{type:"Design",options:[{value:"Frame 1",media:[{type:"image",src:"assets/images/products/frame 1 varamal preservation (10 inches)/IMG-20260705-WA0032.jpg"},{type:"image",src:"assets/images/products/frame 1 varamal preservation (10 inches)/IMG-20260705-WA0051.jpg"},{type:"image",src:"assets/images/products/frame 1 varamal preservation (10 inches)/IMG-20260705-WA0052.jpg"},{type:"image",src:"assets/images/products/frame 1 varamal preservation (10 inches)/IMG-20260705-WA0053.jpg"}]}]},media:[{type:"image",src:"assets/images/products/frame 1 varamal preservation (10 inches)/IMG-20260705-WA0032.jpg"}]},
      {id:"deep-cast",name:"Deep Cast Preservation",category:"preservation",tags:["preservation","gifts"],price:5000,featured:true,customizable:true,customLabel:"Reference photo of your flowers",badge:"Signature",description:"A deep resin block that lets your flowers float at different depths inside the cast — a three-dimensional window into your most sentimental moment, mounted in premium teakwood.",specs:[["Size","9x12 inch"],["Depth","35 mm"],["Frame Material","Teakwood"],["Finish","Crystal-clear epoxy resin"]],media:[{type:"image",src:"assets/images/products/deep cast varmala preservation/deep cast 1.jpg"},{type:"image",src:"assets/images/products/deep cast varmala preservation/deep cast.jpg"},{type:"video",src:"assets/images/products/deep cast varmala preservation/VID-20260705-WA0063.mp4"},{type:"video",src:"assets/images/products/deep cast varmala preservation/VID-20260705-WA0080.mp4"},{type:"video",src:"assets/images/products/deep cast varmala preservation/VID-20260705-WA0081.mp4"},{type:"video",src:"assets/images/products/deep cast varmala preservation/VID-20260705-WA0082.mp4"}]},
      {id:"full-varmala",name:"Full Varmala Preservation",category:"preservation",tags:["preservation"],price:5000,featured:true,customizable:true,customLabel:"Reference photo of your varmala",description:"Semi deep preservation with acrylic slidders. The full wedding garland — without breaking a single bloom — preserved intact and cast in crystal-clear resin.",specs:[["Size","12x18 inch"],["Material","Crystal-clear epoxy resin"],["Preservation","Full intact garland"],["Features","Acrylic sliders"]],media:[{type:"image",src:"assets/images/products/Full varmala preservation/IMG-20260705-WA0054.jpg"},{type:"image",src:"assets/images/products/Full varmala preservation/IMG-20260705-WA0055.jpg"},{type:"image",src:"assets/images/products/Full varmala preservation/IMG-20260705-WA0056.jpg"},{type:"video",src:"assets/images/products/Full varmala preservation/VID-20260705-WA0057.mp4"}]},
      {id:"3d-block",name:"Varmala Preservation — 3D Block",category:"preservation",tags:["preservation","gifts"],price:2500,featured:true,customizable:true,customLabel:"Reference photo of your flowers",description:"A three-dimensional resin block with flowers suspended at layered depths — a solid, sculptural keepsake that catches the light from every angle.",specs:[["Size","6.5 inches"],["Material","Crystal-clear epoxy resin"],["Style","Layered 3D suspension"]],media:[{type:"image",src:"assets/images/products/varamal preservation 3D block/IMG-20260705-WA0022.jpg"},{type:"image",src:"assets/images/products/varamal preservation 3D block/IMG-20260705-WA0023.jpg"},{type:"image",src:"assets/images/products/varamal preservation 3D block/IMG-20260705-WA0024.jpg"},{type:"image",src:"assets/images/products/varamal preservation 3D block/IMG-20260705-WA0025.jpg"}]},
      {id:"love-letter",name:"Love Letter & Rose Preservation",category:"preservation",tags:["preservation","gifts"],price:1800,featured:true,customizable:true,customLabel:"Your letter + note",description:"Words and petals, together forever. A handwritten letter and a rose sealed side by side in warm resin — preserved the way the moment felt.",specs:[["Size","9x12 inch"],["Material","Crystal-clear epoxy resin"],["Inclusions","Handwritten letter + rose"]],media:[{type:"image",src:"assets/images/products/love letter/IMG-20260705-WA0064.jpg"},{type:"image",src:"assets/images/products/love letter/IMG-20260705-WA0065.jpg"}],variants:{type:"Option",options:[{value:"Without Stand",price:1800},{value:"With Stand",price:1900}]}},
      {id:"flower-preservation",name:"Flower Preservation Wooden Frame",category:"preservation",tags:["preservation","gifts"],price:2100,featured:false,customizable:true,customLabel:"Reference photo of your flowers",description:"Delicate dried blooms sealed forever in warm amber resin. A timeless way to hold on to what once bloomed.",specs:[["Size","10 inch"],["Material","Crystal-clear epoxy resin"],["Inclusions","Dried florals"],["Features","With Stand"]],media:[{type:"image",src:"assets/images/products/flower preservation/IMG-20260705-WA0058.jpg"},{type:"image",src:"assets/images/products/flower preservation/IMG-20260705-WA0059.jpg"}]},
      {id:"geode-clock",name:"Resin Geode Wall Clock",category:"resin-art",tags:["resin-art","gifts"],price:3000,featured:true,customizable:false,description:"A statement wall clock that doubles as a geode painting. Layers of amber, sage, and rose resin build a gemstone landscape that marks every hour beautifully.",specs:[["Size","18x16 inch approx."],["Material","Resin on wood base"],["Mechanism","Silent sweep quartz"]],media:[{type:"image",src:"assets/images/products/resin geode clock/IMG-20260705-WA0035.jpg"},{type:"image",src:"assets/images/products/resin geode clock/IMG-20260705-WA0037.jpg"},{type:"image",src:"assets/images/products/resin geode clock/IMG-20260705-WA0042.jpg"},{type:"video",src:"assets/images/products/resin geode clock/VID-20260705-WA0039.mp4"}]},
      {id:"beach-clock",name:"Resin Beach Theme Clock",category:"resin-art",tags:["resin-art","gifts"],price:2000,featured:true,customizable:false,description:"Ocean waves, shells, and sand — all suspended in resin and working as your clock. For those who carry the coast wherever they go.",specs:[["Size","14 inch (can be customized)"],["Material","Resin on wood base"],["Mechanism","Silent sweep quartz"]],media:[{type:"image",src:"assets/images/products/resin beach clock/IMG-20260705-WA0026.jpg"},{type:"image",src:"assets/images/products/resin beach clock/IMG-20260705-WA0027.jpg"},{type:"image",src:"assets/images/products/resin beach clock/IMG-20260705-WA0028.jpg"},{type:"image",src:"assets/images/products/resin beach clock/IMG-20260705-WA0029.jpg"},{type:"image",src:"assets/images/products/resin beach clock/IMG-20260705-WA0030.jpg"}]},
      {id:"nameplate",name:"Resin Nameplate",category:"resin-art",tags:["resin-art","gifts"],price:2000,featured:false,customizable:true,customLabel:"Name / text for the plate",description:"A handcrafted resin nameplate with botanical inclusions and warm amber swirls — a personalised welcome at your door, unlike anything mass-produced.",specs:[["Size","14 inch"],["Material","Resin on wood base"],["Personalisation","Your name / family name"]],media:[{type:"image",src:"assets/images/products/resin nameplate/IMG-20260705-WA0047.jpg"},{type:"image",src:"assets/images/products/resin nameplate/IMG-20260705-WA0050.jpg"},{type:"video",src:"assets/images/products/resin nameplate/VID-20260705-WA0044.mp4"}]},
      {id:"resin-toran",name:"Resin Toran",category:"resin-art",tags:["resin-art","gifts"],price:3200,featured:false,customizable:false,description:"A traditional toran reimagined in resin — marigolds, roses, and mango leaves preserved and hung at your doorway as a permanent blessing. A festive piece that lives forever.",specs:[["Size","36x7 inch"],["Base","MDF"],["Material","Crystal-clear epoxy resin"],["Occasion","Festive doorway decor"]],variants:{type:"Color",options:[{value:"Golden Orange",media:[{type:"image",src:"assets/images/products/resin toran golden orange/IMG-20260705-WA0085.jpg"},{type:"image",src:"assets/images/products/resin toran golden orange/IMG-20260705-WA0086.jpg"},{type:"image",src:"assets/images/products/resin toran golden orange/Resin toran.jpg"}]},{value:"Purple",media:[{type:"image",src:"assets/images/products/resin toran purple/IMG-20260705-WA0090.jpg"},{type:"image",src:"assets/images/products/resin toran purple/IMG-20260705-WA0092.jpg"}]}]},media:[{type:"image",src:"assets/images/products/resin toran golden orange/IMG-20260705-WA0085.jpg"}]}
    ]
  };

  /* ============================================================
     STATE
     ============================================================ */
  let DATA = FALLBACK_DATA;
  let SETTINGS = DATA.settings;
  let PRODUCTS = DATA.products;
  const byId = {};

  let activeFilter = 'all';
  let activeSort = 'featured';

  let cart = load('cbv_cart', []);
  let wishlist = load('cbv_wishlist', []);
  // In-memory store for uploaded custom files (not persisted).
  const customFiles = {};

  /* ============================================================
     UTILITIES
     ============================================================ */
  function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { } }
  function $(sel, root = document) { return root.querySelector(sel); }
  function url(src) { 
    if (!src) return '';
    if (String(src).startsWith('http')) return src;
    return encodeURI(src); 
  }
  function money(n) { return SETTINGS.currency + Number(n).toLocaleString('en-IN'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function priceRange(p) {
      const prices = p.variants.options.map(o => (typeof o.price === 'number' ? o.price : p.price));
      const min = Math.min(...prices), max = Math.max(...prices);
      return { min, max, varies: min !== max };
    }
    return { min: p.price, max: p.price, varies: false };
  }

  function fmtDate(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function isVideo(src) { return /\.(mp4|webm|mov|m4v)$/i.test(src); }

  function mediaThumbHTML(m) {
    if (m.type === 'video' || isVideo(m.src)) {
      return `<video src="${url(m.src)}" muted loop playsinline preload="metadata"></video>`;
    }
    return `<img src="${url(m.src)}" alt="" loading="lazy" />`;
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    initTheme();
    await loadData();
    PRODUCTS.forEach(p => (byId[p.id] = p));
    renderCurated();
    renderFilters();
    renderCatalog();
    initCatalogEvents();
    initDrawers();
    initProductModal();
    initHeaderScroll();
    initHeroAnimation();
    updateCartUI();
    updateWishlistUI();
    wireWhatsAppLinks();
    initScrollReveal();
    const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
    checkUrlForProduct();
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.pid) {
        openProduct(e.state.pid, true);
      } else {
        closeProduct(true);
      }
    });
  }

  function checkUrlForProduct() {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('p');
    if (pid && byId[pid]) {
      openProduct(pid, true);
    }
  }

  async function loadData() {
    try {
      if (typeof sb === 'undefined') throw new Error('supabase client not loaded');

      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        sb.from('products').select('data').eq('status', 'active').order('sort_order'),
        sb.from('categories').select('slug,label').order('sort_order'),
        sb.from('site_settings').select('*').eq('id', 1).single()
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (settingsRes.error) throw settingsRes.error;

      const products = productsRes.data.map(row => row.data);
      const categories = categoriesRes.data;
      const s = settingsRes.data;

      DATA = {
        settings: {
          whatsapp: s.whatsapp,
          instagram: s.instagram,
          currency: s.currency,
          processingDays: [s.processing_days_min, s.processing_days_max],
          deliveryDays: [s.delivery_days_min, s.delivery_days_max]
        },
        categories,
        products
      };
      SETTINGS = DATA.settings;
      PRODUCTS = DATA.products;
    } catch (e) {
      // Supabase unreachable/misconfigured — silently use inlined fallback.
      console.info('[Craft] Using inlined product data (Supabase fetch unavailable).', e);
    }
  }

  /* ============================================================
     THEME
     ============================================================ */
  function initTheme() {
    const saved = load('cbv_theme', null);
    const theme = saved || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    $('#theme-toggle-btn')?.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      save('cbv_theme', next);
    });
  }

  /* ============================================================
     CATALOG RENDER
     ============================================================ */
  function renderCurated() {
    const rail = $('#curated-rail');
    if (!rail) return;
    rail.innerHTML = '';
    PRODUCTS.filter(p => p.featured).forEach(p => rail.appendChild(buildCard(p)));
  }

  function renderFilters() {
    const wrap = $('#filter-links');
    if (!wrap) return;
    wrap.innerHTML = '';
    DATA.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-link' + (cat.slug === activeFilter ? ' active' : '');
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        activeFilter = cat.slug;
        wrap.querySelectorAll('.filter-link').forEach(b => b.classList.toggle('active', b === btn));
        renderCatalog();
      });
      wrap.appendChild(btn);
    });
  }

  function renderCatalog() {
    const grid = $('#product-grid');
    const empty = $('#empty-state');
    if (!grid) return;

    let list = PRODUCTS.filter(p => activeFilter === 'all' || (p.tags || [p.category]).includes(activeFilter));

    if (activeSort === 'price-asc') list.sort((a, b) => priceRange(a).min - priceRange(b).min);
    else if (activeSort === 'price-desc') list.sort((a, b) => priceRange(b).min - priceRange(a).min);
    else if (activeSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => (b.featured === true) - (a.featured === true));

    grid.innerHTML = '';
    list.forEach((p, i) => {
      const card = buildCard(p);
      card.style.animationDelay = (i * 0.04) + 's';
      grid.appendChild(card);
    });
    if (empty) empty.hidden = list.length > 0;
  }

  function initCatalogEvents() {
    $('#sort-select')?.addEventListener('change', e => { activeSort = e.target.value; renderCatalog(); });
  }

  function buildCard(p) {
    const range = priceRange(p);
    const firstMedia = p.media[0];
    const inWish = wishlist.includes(p.id);
    const priceHTML = range.varies
      ? `<span class="from">from</span>${money(range.min)}`
      : money(range.min);

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-media" data-open="${p.id}">
        ${mediaThumbHTML(firstMedia)}
        ${p.badge ? `<span class="card-badge">${esc(p.badge)}</span>` : ''}
        <button class="card-wish${inWish ? ' active' : ''}" data-wish="${p.id}" aria-label="Save to wishlist">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
        </button>
      </div>
      <div class="card-info">
        <h3 class="card-title" data-open="${p.id}">${esc(p.name)}</h3>
        <div class="card-foot">
          <span class="card-price">${priceHTML}</span>
          <button class="card-add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
        </div>
      </div>`;

    card.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openProduct(p.id)));
    card.querySelector('[data-wish]').addEventListener('click', e => { e.stopPropagation(); toggleWishlist(p.id); });
    card.querySelector('[data-add]').addEventListener('click', e => {
      e.stopPropagation();
      // Products needing a choice (variant or custom photo) open the modal instead of blind-adding.
      if (p.variants || p.customizable) { openProduct(p.id); }
      else { addToCart(p, {}); }
    });
    return card;
  }

  /* ============================================================
     PRODUCT DETAIL MODAL
     ============================================================ */
  let current = null;        // current product
  let curVariant = null;     // selected variant option object
  let curMedia = [];         // active media list
  let curQty = 1;
  let curCustomFile = null;

  function initProductModal() {
    $('#pd-close-btn')?.addEventListener('click', closeProduct);
    $('#pd-overlay')?.addEventListener('click', closeProduct);
    $('#pd-qty-minus')?.addEventListener('click', () => { if (curQty > 1) { curQty--; syncQty(); } });
    $('#pd-qty-plus')?.addEventListener('click', () => { curQty++; syncQty(); });

    $('#pd-add-btn')?.addEventListener('click', addFromModal);
    $('#pd-order-wa-btn')?.addEventListener('click', orderDirectWhatsApp);
    $('#sticky-add-btn')?.addEventListener('click', addFromModal);
    $('#sticky-wa-btn')?.addEventListener('click', orderDirectWhatsApp);
    $('#pd-wish-btn')?.addEventListener('click', () => current && toggleWishlist(current.id, true));

    // Tabs
    document.querySelectorAll('.pd-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $(`.pd-tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
      });
    });

    // Upload
    const uploadBox = $('#pd-upload-box');
    const fileInput = $('#pd-custom-file');
    uploadBox?.addEventListener('click', () => fileInput.click());
    fileInput?.addEventListener('change', () => {
      const f = fileInput.files[0];
      if (f) {
        curCustomFile = f;
        uploadBox.classList.add('has-file');
        $('#pd-upload-text').textContent = f.name;
      } else {
        curCustomFile = null;
        uploadBox.classList.remove('has-file');
        $('#pd-upload-text').textContent = 'Upload your photo (optional)';
      }
    });

    // Lightbox
    $('#lightbox-close')?.addEventListener('click', closeLightbox);
    $('#lightbox')?.addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if ($('#lightbox').classList.contains('open')) closeLightbox();
      else if ($('#product-modal').classList.contains('open')) closeProduct();
      else closeDrawers();
    });
  }

  function openProduct(id, skipState = false) {
    const p = byId[id];
    if (!p) return;
    if (!skipState) {
      const url = new URL(window.location);
      url.searchParams.set('p', id);
      window.history.pushState({ pid: id }, '', url);
    }
    current = p;
    curQty = 1;
    curCustomFile = null;
    curVariant = p.variants ? p.variants.options[0] : null;
    curMedia = (curVariant && curVariant.media) ? curVariant.media : p.media;

    // Heading
    const badge = $('#pd-badge');
    if (p.badge) { badge.textContent = p.badge; badge.hidden = false; } else { badge.hidden = true; }
    $('#pd-title').textContent = p.name;
    $('#pd-desc').textContent = p.description;

    // Specs table
    $('#pd-specs').innerHTML = (p.specs || []).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');

    // Variants
    const vField = $('#pd-variant-field');
    if (p.variants) {
      vField.hidden = false;
      $('#pd-variant-label').textContent = p.variants.type;
      const opts = $('#pd-variant-options');
      opts.innerHTML = '';

      if (p.variants.type === 'Size' && p.variants.options.every(o => typeof o.price === 'number')) {
        // Render as styled select dropdown for size+price variants
        const sel = document.createElement('select');
        sel.className = 'variant-select';
        sel.id = 'pd-variant-select';
        p.variants.options.forEach((opt, i) => {
          const op = document.createElement('option');
          op.value = i;
          op.textContent = opt.value + ' · ' + money(typeof opt.price === 'number' ? opt.price : p.price);
          sel.appendChild(op);
        });
        sel.addEventListener('change', () => {
          const opt = p.variants.options[+sel.value];
          const fakeChip = { classList: { add() { }, remove() { } } };
          selectVariant(opt, fakeChip);
        });
        opts.appendChild(sel);
      } else {
        // Chip buttons for Design/Color variants
        p.variants.options.forEach((opt, i) => {
          const chip = document.createElement('button');
          chip.className = 'variant-chip' + (i === 0 ? ' active' : '');
          chip.textContent = opt.value + (typeof opt.price === 'number' && opt.price !== p.price ? ` · ${money(opt.price)}` : '');
          chip.addEventListener('click', () => selectVariant(opt, chip));
          opts.appendChild(chip);
        });
      }
    } else {
      vField.hidden = true;
    }

    // Custom upload
    const cField = $('#pd-custom-field');
    if (p.customizable) {
      cField.hidden = false;
      $('#pd-custom-label').textContent = p.customLabel || 'Personalise this piece';
      $('#pd-upload-box').classList.remove('has-file');
      $('#pd-upload-text').textContent = 'Upload your photo (optional)';
      $('#pd-custom-file').value = '';
    } else {
      cField.hidden = true;
    }

    // Wishlist button state
    $('#pd-wish-btn').classList.toggle('active', wishlist.includes(p.id));

    // Reset tabs to description
    document.querySelector('.pd-tab-btn[data-tab="desc"]').click();

    renderGallery();
    updatePriceUI();
    syncQty();

    // Open
    $('#pd-overlay').classList.add('open');
    $('#product-modal').classList.add('open');
    $('#product-modal').setAttribute('aria-hidden', 'false');
    $('#product-modal').scrollTop = 0;
    $('#sticky-buy-bar').classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function selectVariant(opt, chip) {
    curVariant = opt;
    document.querySelectorAll('#pd-variant-options .variant-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    if (opt.media) { curMedia = opt.media; renderGallery(); }
    updatePriceUI();
  }

  function currentUnitPrice() {
    if (curVariant && typeof curVariant.price === 'number') return curVariant.price;
    return current.price;
  }

  function updatePriceUI() {
    const price = money(currentUnitPrice());
    $('#pd-price').textContent = price;
    $('#sticky-amount').textContent = price;
    $('#sticky-name').textContent = current.name;
  }

  function renderGallery() {
    const stage = $('#pd-stage');
    const thumbs = $('#pd-thumbs');
    setStage(curMedia[0]);

    thumbs.innerHTML = '';
    curMedia.forEach((m, i) => {
      const t = document.createElement('div');
      t.className = 'pd-thumb' + (i === 0 ? ' active' : '');
      t.innerHTML = mediaThumbHTML(m) + (m.type === 'video' ? `<span class="play-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>` : '');
      t.addEventListener('click', () => {
        setStage(m);
        thumbs.querySelectorAll('.pd-thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      });
      thumbs.appendChild(t);
    });
  }

  function setStage(m) {
    const stage = $('#pd-stage');
    if (m.type === 'video') {
      stage.innerHTML = `<video src="${url(m.src)}" autoplay muted loop playsinline controls></video>`;
      stage.style.cursor = 'default';
    } else {
      stage.innerHTML = `<img src="${url(m.src)}" alt="${esc(current.name)}" /><span class="zoom-hint">Click to zoom</span>`;
      stage.style.cursor = 'zoom-in';
      stage.querySelector('img').addEventListener('click', () => openLightbox(m));
    }
  }

  function addFromModal() {
    addToCart(current, {
      variant: curVariant ? curVariant.value : null,
      variantType: current.variants ? current.variants.type : null,
      unitPrice: currentUnitPrice(),
      qty: curQty,
      image: curMedia[0].type === 'image' ? curMedia[0].src : (current.media.find(m => m.type === 'image')?.src || curMedia[0].src),
      customFile: curCustomFile
    });
    closeProduct();
  }

  function orderDirectWhatsApp() {
    if (!current) return;
    const msg = buildOrderMessage();
    const waUrl = `https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(msg)}`;
    openExternal(waUrl);
  }


  function buildOrderMessage() {
    const price = currentUnitPrice();
    const variantType = current.variants ? current.variants.type : null;
    const variant = curVariant ? curVariant.value : null;
    let msg = `Hello Crafting Tales by Vaishnavi! I'd like to order:\n\n`;
    msg += `• ${current.name}`;
    if (variant) msg += ` (${variantType}: ${variant})`;
    msg += `\n   Qty: ${curQty} × ${money(price)} = ${money(price * curQty)}\n`;
    msg += `   Link: ${window.location.origin + window.location.pathname + '?p=' + current.id}\n`;
    if (curCustomFile) msg += `   ✎ I have a custom photo / reference image for this.\n`;
    msg += `\nSubtotal: ${money(price * curQty)}\n`;
    msg += `Making & Delivery: ${SETTINGS.processingDays[0]}–${SETTINGS.processingDays[1]} days\n`;
    if (curCustomFile) msg += `\nNote: I have a custom image for this order. I will send it in this chat now.\n`;
    msg += `\nPlease confirm availability and payment. Thank you!`;
    return msg;
  }

  function openExternal(href) {
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function closeProduct(skipState = false) {
    if (skipState !== true && $('#product-modal').classList.contains('open')) {
      const url = new URL(window.location);
      url.searchParams.delete('p');
      window.history.pushState({}, '', url);
    }
    $('#pd-overlay').classList.remove('open');
    $('#product-modal').classList.remove('open');
    $('#product-modal').setAttribute('aria-hidden', 'true');
    $('#sticky-buy-bar').classList.remove('visible');
    // stop any playing stage video
    const v = $('#pd-stage video'); if (v) v.pause();
    document.body.style.overflow = '';
  }

  function syncQty() { $('#pd-qty-input').value = curQty; }

  function openLightbox(m) {
    const c = $('#lightbox-content');
    c.innerHTML = m.type === 'video'
      ? `<video src="${url(m.src)}" controls autoplay loop playsinline></video>`
      : `<img src="${url(m.src)}" alt="" />`;
    $('#lightbox').classList.add('open');
    $('#lightbox').setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    $('#lightbox').classList.remove('open');
    $('#lightbox').setAttribute('aria-hidden', 'true');
    $('#lightbox-content').innerHTML = '';
  }

  /* ============================================================
     CART
     ============================================================ */
  function addToCart(p, { variant = null, variantType = null, unitPrice = null, qty = 1, image = null, customFile = null } = {}) {
    const price = unitPrice != null ? unitPrice : p.price;
    const img = image || (p.media.find(m => m.type === 'image')?.src) || p.media[0].src;
    const hasCustom = !!customFile;
    // Identity: same product + variant + (no custom) merge; custom items stay separate lines.
    const key = `${p.id}|${variant || ''}|${hasCustom ? 'c' + Date.now() : ''}`;

    const existing = !hasCustom && cart.find(i => i.productId === p.id && i.variant === variant && !i.custom);
    if (existing) {
      existing.qty += qty;
    } else {
      const line = { lineId: key, productId: p.id, name: p.name, variant, variantType, unitPrice: price, qty, image: img, custom: hasCustom, customName: hasCustom ? customFile.name : null };
      if (hasCustom) customFiles[key] = customFile;
      cart.push(line);
    }
    persistCart();
    updateCartUI();
    openCart();
    toast(`${p.name} added to cart`);
  }

  function changeQty(lineId, delta) {
    const item = cart.find(i => i.lineId === lineId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeLine(lineId);
    else { persistCart(); updateCartUI(); }
  }

  function removeLine(lineId) {
    cart = cart.filter(i => i.lineId !== lineId);
    delete customFiles[lineId];
    persistCart();
    updateCartUI();
  }

  function persistCart() {
    // Persist everything except the raw File objects.
    save('cbv_cart', cart);
  }

  function updateCartUI() {
    const wrap = $('#cart-items');
    const countBadge = $('#cart-count');
    if (!wrap) return;

    let items = 0, subtotal = 0;
    wrap.innerHTML = '';

    cart.forEach(item => {
      items += item.qty;
      subtotal += item.unitPrice * item.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      const metaBits = [];
      if (item.variant) metaBits.push(`${esc(item.variantType || '')}: ${esc(item.variant)}`);
      if (item.custom) metaBits.push(`<span class="custom-flag">✎ custom photo attached</span>`);
      div.innerHTML = `
        <div class="cart-item-media">${mediaThumbHTML({ type: 'image', src: item.image })}</div>
        <div class="cart-item-info">
          <p class="cart-item-title">${esc(item.name)}</p>
          ${metaBits.length ? `<p class="cart-item-meta">${metaBits.join(' · ')}</p>` : ''}
          <div class="cart-item-controls">
            <div class="qty-selector">
              <button class="qty-btn" data-dec="${item.lineId}">−</button>
              <input class="qty-input" value="${item.qty}" readonly />
              <button class="qty-btn" data-inc="${item.lineId}">+</button>
            </div>
            <span class="cart-item-price">${money(item.unitPrice * item.qty)}</span>
          </div>
          <button class="cart-item-remove" data-remove="${item.lineId}">Remove</button>
        </div>`;
      wrap.appendChild(div);
    });

    if (cart.length === 0) {
      wrap.innerHTML = `<p class="cart-empty">Your cart is empty.<br>Find something to preserve.</p>`;
    }

    wrap.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
    wrap.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, 1)));
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeLine(b.dataset.remove)));

    $('#cart-item-count').textContent = items;
    $('#cart-subtotal').textContent = money(subtotal);
    countBadge.textContent = items;
    countBadge.hidden = items === 0;

    // Delivery estimates (from today)
    const proc = SETTINGS.processingDays[1];
    $('#est-processing').textContent = 'By ' + fmtDate(proc);
  }

  function buildCartMessage() {
    let msg = 'Hello Crafting Tales by Vaishnavi! I would like to place an order:\n\n';
    let total = 0;
    let anyCustom = false;
    cart.forEach((item, i) => {
      const line = item.unitPrice * item.qty;
      total += line;
      msg += `${i + 1}. ${item.name}`;
      if (item.variant) msg += ` (${item.variantType}: ${item.variant})`;
      msg += `\n   Qty: ${item.qty} × ${money(item.unitPrice)} = ${money(line)}\n`;
      msg += `   Link: ${window.location.origin + window.location.pathname + '?p=' + item.productId}\n`;
      if (item.custom) { anyCustom = true; msg += `   ✎ Custom photo/design attached\n`; }
      msg += '\n';
    });
    msg += `Subtotal: ${money(total)}\n`;
    msg += `Making & Delivery: ${SETTINGS.processingDays[0]}–${SETTINGS.processingDays[1]} days\n`;
    if (anyCustom) msg += `\nNote: I have a custom image for this order. I will send it in this chat now.\n`;
    msg += `\nPlease confirm availability, shipping and payment. Thank you!`;
    return msg;
  }

  function checkoutWhatsApp() {
    if (cart.length === 0) { toast('Your cart is empty'); return; }
    const msg = buildCartMessage();
    const waUrl = `https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(msg)}`;
    openExternal(waUrl);
  }


  /* ============================================================
     WISHLIST
     ============================================================ */
  function toggleWishlist(id, fromModal) {
    const p = byId[id];
    if (wishlist.includes(id)) { wishlist = wishlist.filter(x => x !== id); toast(`${p.name} removed from wishlist`); }
    else { wishlist.push(id); toast(`${p.name} saved to wishlist`); }
    save('cbv_wishlist', wishlist);
    // refresh card + modal states
    document.querySelectorAll(`[data-wish="${id}"]`).forEach(b => b.classList.toggle('active', wishlist.includes(id)));
    if (fromModal) $('#pd-wish-btn').classList.toggle('active', wishlist.includes(id));
    updateWishlistUI();
  }

  function updateWishlistUI() {
    const badge = $('#wishlist-count');
    badge.textContent = wishlist.length;
    badge.hidden = wishlist.length === 0;

    const wrap = $('#wishlist-items');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (wishlist.length === 0) {
      wrap.innerHTML = `<p class="cart-empty">No saved pieces yet.<br>Tap the ♡ on anything you love.</p>`;
      return;
    }
    wishlist.forEach(id => {
      const p = byId[id];
      if (!p) return;
      const div = document.createElement('div');
      div.className = 'cart-item';
      const img = p.media.find(m => m.type === 'image')?.src || p.media[0].src;
      div.innerHTML = `
        <div class="cart-item-media">${mediaThumbHTML({ type: 'image', src: img })}</div>
        <div class="cart-item-info">
          <p class="cart-item-title">${esc(p.name)}</p>
          <p class="cart-item-meta">${money(priceRange(p).min)}</p>
          <div class="cart-item-controls">
            <button class="btn-primary" data-view="${id}" style="padding:0.5rem 1rem;font-size:0.8rem;">View</button>
            <button class="cart-item-remove" data-unwish="${id}">Remove</button>
          </div>
        </div>`;
      wrap.appendChild(div);
    });
    wrap.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { closeDrawers(); openProduct(b.dataset.view); }));
    wrap.querySelectorAll('[data-unwish]').forEach(b => b.addEventListener('click', () => toggleWishlist(b.dataset.unwish)));
  }

  /* ============================================================
     DRAWERS
     ============================================================ */
  function openCart() { $('#cart-drawer').classList.add('open'); $('#cart-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function openWishlist() { $('#wishlist-drawer').classList.add('open'); $('#wishlist-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawers() {
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
    $('#cart-overlay').classList.remove('open');
    $('#wishlist-overlay').classList.remove('open');
    if (!$('#product-modal').classList.contains('open')) document.body.style.overflow = '';
  }

  function initDrawers() {
    $('#cart-toggle-btn')?.addEventListener('click', openCart);
    $('#cart-close-btn')?.addEventListener('click', closeDrawers);
    $('#cart-overlay')?.addEventListener('click', closeDrawers);
    $('#wishlist-toggle-btn')?.addEventListener('click', openWishlist);
    $('#wishlist-close-btn')?.addEventListener('click', closeDrawers);
    $('#wishlist-overlay')?.addEventListener('click', closeDrawers);
    $('#checkout-btn')?.addEventListener('click', checkoutWhatsApp);
  }

  function wireWhatsAppLinks() {
    const link = $('#footer-whatsapp');
    if (link) {
      link.href = `https://wa.me/${SETTINGS.whatsapp}`;
      link.target = '_blank';
      link.rel = 'noopener';
    }
  }

  /* ============================================================
     HEADER SCROLL + HERO ANIMATION
     ============================================================ */
  function initHeaderScroll() {
    const header = $('#header');
    const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initHeroAnimation() {
    const heroArea = document.querySelector('.hero-area');
    const header = $('#header');
    if (!heroArea) return;

    // Header scrolled glass state
    const heroH = () => heroArea.offsetHeight + heroArea.offsetTop;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > heroH() * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     SCROLL REVEAL — IntersectionObserver fade-ups
     ============================================================ */
  function initScrollReveal() {
    // Mark elements that should fade in on scroll
    const revealSelectors = [
      '.scrapbook-heading',
      '.editorial-row',
      '.craft-grid',
      '.footer-inner',
      '.footer-legal',
    ];
    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    // Stagger the product grid and curated rail children
    const staggerSelectors = ['.product-grid', '.curated-rail', '.footer-cols'];
    staggerSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal-stagger'));
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // fire once only
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

})();


