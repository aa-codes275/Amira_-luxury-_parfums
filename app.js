/* ===========================================================
   Amira للعطور — منطق الموقع الكامل مع Supabase ونظام التقييمات
   =========================================================== */

const IMG = "images/";
const SITE_DEFAULT = {
  name: "Amira للعطور",
  phoneDisplay: "+966 55 878 7732",
  phone: "+966558787732",
  whatsapp: "966558787732",
  email: "info@ameraksa.com",
  address: "المملكة العربية السعودية — الرياض",
  hours: "يومياً من 10 صباحاً حتى 11 مساءً",
  currency: "ر.س",
  socials: [
    { label: "واتساب", href: "https://wa.me/966558787732", handle: "+966 55 878 7732" },
    { label: "سناب شات", href: "https://snapchat.com/t/YV11SKgs", handle: "@amira.parfums" },
    { label: "تيك توك", href: "https://www.tiktok.com/@amira.parfums1", handle: "@amira.parfums1" },
    { label: "إنستجرام", href: "https://www.instagram.com/amira.parfums.1", handle: "@amira.parfums.1" },
    { label: "متجر سلة", href: "https://salla.sa/shmatalmsa", handle: "متجر عطور أميرة" }
  ],
};

/* ===========================================================
   إعدادات Supabase المتوافقة مع مشروعك
   =========================================================== */
const SUPABASE_CONFIG = {
  url: "https://fpwipcymceuauksbdsiy.supabase.co",
  key: "sb_publishable_U16v3EtalNf4Ip--dUnyiA_3WVIGewQ"
};

// استخدام dbClient بدلاً من supabase لمنع التعارض مع اسم المكتبة CDN
const dbClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

let PRODUCTS = [];
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mediaUrl = value => /^(https?:|data:|blob:|\/)/.test(value || "") || String(value).startsWith("images/") ? value : IMG + value;

const ADS_DEFAULT = [
  { src: "tawzeeh-box.jpg", kicker: "بكج التوزيع", title: "توزيعات بروح الشرق" },
  { src: "shahrazad-poster.jpg", kicker: "شهرزاد", title: "فتنة عطرية آسرة" },
  { src: "amira-black-ad.jpg", kicker: "إصدار الليل", title: "شهرزاد" },
  { src: "shahryar-ottoman.jpg", kicker: "شهريار", title: "أجواء عثمانية" },
  { src: "amira-trio-ad.jpg", kicker: "الثلاثية", title: "عطرٌ يتكلّم عنك" },
  { src: "trio-table.jpg", kicker: "المجموعة كاملة", title: "ثلاث بصمات" },
  { src: "kahraman-flowers.jpg", kicker: "كهرمان", title: "نقاء الكريستال" },
  { src: "shahryar-closeup.jpg", kicker: "تفاصيل", title: "أناقة الأسود" },
  { src: "shahryar-box-bag.jpg", kicker: "جاهز للإهداء", title: "تغليف فاخر" },
  { src: "kahraman-box.jpg", kicker: "كهرمان", title: "علبة بحكاية" },
  { src: "shahryar-hand.jpg", kicker: "كواليس", title: "من عدسة Amira" },
];

const HERO_SLIDES = [
  { src: "amira-black-ad.jpg", kicker: "AMIRA PARFUMS", title: "عطر يليق بحضورك", text: "ثبات يدوم طويلاً وتركيبة فاخرة بجودة مضمونة." },
  { src: "amira-trio-ad.jpg", kicker: "THE TRIO", title: "ثلاث شخصيات… بصمة واحدة", text: "شهرزاد، شهريار، وكهرمان في بكج فاخر جاهز للإهداء." },
  { src: "shahrazad-poster.jpg", kicker: "SHAHRAZAD", title: "فتنة عطرية آسرة", text: "أحمر مخملي بتغليف يليق بأجمل المناسبات." },
];

/* ---------- التخزين المحلي ---------- */
const LS = { site: "amira_site", cart: "amira_cart", reviews: "amira_reviews" };
const read = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const SITE = { ...SITE_DEFAULT, ...read(LS.site, {}) };
let cart = read(LS.cart, {});
let filter = "الكل";
let qty = {};

const money = (n) => `${Number(n).toLocaleString("ar-EG")} ${SITE.currency || "ر.س"}`;
const el = (id) => document.getElementById(id);

/* ---------- جلب المنتجات من جدول luxury_products في Supabase ---------- */
async function fetchProductsFromSupabase() {
  try {
    const { data, error } = await dbClient
      .from('luxury_products')
      .select('*');

    if (error) throw error;

    if (data && data.length > 0) {
      PRODUCTS = data.map(item => ({
        id: String(item.product_slug || item.id),
        name: item.product_name_ar,
        latin: item.product_slug,
        tagline: item.exquisite_description || "عطر فاخر مصمم بعناية",
        notes: ["عود", "مسك", "عطور شرقية"],
        price: item.discounted_price ?? item.price_aqsa,
        oldPrice: item.discounted_price ? item.price_aqsa : null,
        size: "100 مل",
        badge: item.stock_status > 0 ? "متوفر" : "طلب خاص",
        gender: item.product_name_ar.includes("نسائي") ? "نسائي" : item.product_name_ar.includes("رجالي") ? "رجالي" : "للجنسين",
        gallery: [item.supreme_image_url || "amira-red-bottle.jpg", "trio-table.jpg"],
        sourceId: item.id
      }));
      const overrides = read("amira_products", []);
      PRODUCTS = PRODUCTS.map(p => ({...p, ...(overrides.find(x => String(x.id) === p.id) || {})}));
      buildProducts(); paintCart();
      document.dispatchEvent(new Event("amira:products"));
    }
  } catch (err) {
    console.error("فشل تحميل المنتجات:", err.message);
    if(el("grid")) el("grid").innerHTML = '<p class="empty">تعذر تحميل المنتجات. أعد تحميل الصفحة أو تواصل معنا على واتساب.</p>';
  }
}

/* ---------- الهيرو ---------- */
let heroIdx = 0;
function buildHero() {
  const media = el("heroMedia"), dots = el("heroDots");
  if (!media) return;
  media.innerHTML = HERO_SLIDES.map((s, i) => `<img src="${mediaUrl(s.src)}" alt="${s.title}" class="${i === 0 ? "on" : ""}">`).join("") +
    '<div class="hero-veil"></div>';
  dots.innerHTML = HERO_SLIDES.map((_, i) => `<button class="${i === 0 ? "on" : ""}" data-i="${i}" aria-label="العرض ${i + 1}"></button>`).join("");
  dots.querySelectorAll("button").forEach((d) => d.addEventListener("click", () => setHero(+d.dataset.i)));
  paintHero();
  setInterval(() => setHero((heroIdx + 1) % HERO_SLIDES.length), 5200);
}
function setHero(i) { heroIdx = i; paintHero(); }
function paintHero() {
  const s = HERO_SLIDES[heroIdx];
  document.querySelectorAll("#heroMedia img").forEach((img, i) => img.classList.toggle("on", i === heroIdx));
  document.querySelectorAll("#heroDots button").forEach((d, i) => d.classList.toggle("on", i === heroIdx));
  if(el("heroKicker")) el("heroKicker").textContent = s.kicker;
  if(el("heroTitle")) el("heroTitle").innerHTML = s.title.replace(/(Amira|شهرزاد)/, '<span class="text-gold">$1</span>');
  if(el("heroText")) el("heroText").textContent = s.text;
}

/* ---------- عرض المنتجات والفلاتر ---------- */
function buildFilters() {
  const kinds = ["الكل", "نسائي", "رجالي", "للجنسين"];
  const filterEl = el("filters");
  if (!filterEl) return;
  filterEl.innerHTML = kinds.map((k) => `<button class="chip ${k === filter ? "on" : ""}" data-k="${k}">${k}</button>`).join("");
  filterEl.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.k; buildFilters(); buildProducts(); }));
}

function buildProducts() {
  const gridEl = el("grid");
  if (!gridEl) return;
  
  const list = PRODUCTS.filter((p) => filter === "الكل" || p.gender === filter);
  
  if (!list.length) {
    gridEl.innerHTML = '<p class="empty" style="grid-column: 1/-1; text-align:center; padding:40px;">جاري تحميل المنتجات أو لا توجد منتجات متطابقة...</p>';
    return;
  }

  gridEl.innerHTML = list.map((p) => {
    const active = qty[p.id]?.img || 0;
    const n = qty[p.id]?.n || 1;
    const imgSrc = p.gallery[active]?.startsWith("http") ? p.gallery[active] : mediaUrl(p.gallery[active]);
    return `<article class="card">
      <div class="ph">
        <img src="${imgSrc}" alt="${escapeHTML(p.name)}" loading="lazy">
        ${p.badge ? `<span class="badge">${escapeHTML(p.badge)}</span>` : ""}
        <button class="zoom" data-zoom="${p.id}" aria-label="تكبير صورة ${escapeHTML(p.name)}">⤢</button>
      </div>
      <div class="thumbs">
        ${p.gallery.map((g, i) => {
          const thumbSrc = g.startsWith("http") ? g : mediaUrl(g);
          return `<button class="${i === active ? "on" : ""}" data-thumb="${p.id}" data-i="${i}" aria-label="صورة ${i + 1}"><img src="${thumbSrc}" alt=""></button>`;
        }).join("")}
      </div>
      <div class="body">
        <div>
          <span class="lat">${escapeHTML(p.latin)}</span>
          <h3>${escapeHTML(p.name)}</h3>
        </div>
        <p class="tag">${escapeHTML(p.tagline)}</p>
        <div class="notes">${(p.notes || []).map((x) => `<span>${x}</span>`).join("")}<span>${escapeHTML(p.size)}</span></div>
        <div class="price"><b class="text-gold">${money(p.price)}</b>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
        <div class="qty">
          <button data-step="-1" data-id="${p.id}" aria-label="تقليل">−</button>
          <span>${n}</span>
          <button data-step="1" data-id="${p.id}" aria-label="زيادة">+</button>
        </div>
        <button class="btn gold" data-add="${p.id}">أضف إلى السلة</button>
      </div>
    </article>`;
  }).join("");

  gridEl.querySelectorAll("[data-thumb]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.thumb; qty[id] = { ...(qty[id] || {}), img: +b.dataset.i }; buildProducts();
  }));
  gridEl.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.id, cur = qty[id]?.n || 1;
    qty[id] = { ...(qty[id] || {}), n: Math.max(1, cur + +b.dataset.step) }; buildProducts();
  }));
  gridEl.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => addToCart(b.dataset.add)));
  gridEl.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    const p = PRODUCTS.find((x) => x.id === b.dataset.zoom);
    openLightbox(p.gallery.map((g) => ({ src: g.startsWith("http") ? g : mediaUrl(g), title: p.name })), qty[p.id]?.img || 0);
  }));
}

/* ---------- الإعلانات ---------- */
function buildAds() {
  const adsEl = el("ads");
  if (!adsEl) return;
  adsEl.innerHTML = ADS_DEFAULT.map((a, i) => `<button data-ad="${i}" aria-label="تكبير ${escapeHTML(a.title)}">
    <img src="${mediaUrl(a.src)}" alt="${escapeHTML(a.title)}" loading="lazy">
    <span class="shade"></span>
    <span class="cap"><small>${a.kicker}</small><p class="text-gold">${escapeHTML(a.title)}</p></span>
  </button>`).join("");
  adsEl.querySelectorAll("[data-ad]").forEach((b) => b.addEventListener("click", () =>
    openLightbox(ADS_DEFAULT.map((a) => ({ src: mediaUrl(a.src), title: a.title })), +b.dataset.ad)));
}

/* ---------- الفيديو ---------- */
const FILM = { src: "media/amira-film.mp4", poster: "media/amira-film-poster.jpg" };
function buildFilm() {
  const v = el("filmVideo"), btn = el("filmPlay"), toggle = el("filmToggle"), sound = el("filmSound");
  if (!v) return;
  v.src = FILM.src; v.poster = FILM.poster; v.muted = true;
  const sync = () => {
    const on = !v.paused;
    if(btn) btn.style.display = on ? "none" : "grid";
    if(toggle) toggle.textContent = on ? "⏸" : "▶";
  };
  const play = () => { v.paused ? v.play().catch(() => {}) : v.pause(); };
  [btn, toggle, v].forEach((n) => { if(n) n.addEventListener("click", play); });
  if(sound) {
    sound.addEventListener("click", () => { v.muted = !v.muted; sound.textContent = v.muted ? "🔇" : "🔊"; });
    sound.textContent = "🔇";
  }
  sync();
}

/* ---------- اللايت بوكس ---------- */
let lbItems = [], lbIdx = 0, lbZoom = 1;
function openLightbox(items, idx) {
  lbItems = items; lbIdx = idx; lbZoom = 1;
  el("lb").classList.add("on"); document.body.style.overflow = "hidden"; paintLb();
}
function closeLightbox() { el("lb").classList.remove("on"); document.body.style.overflow = ""; }
function paintLb() {
  const it = lbItems[lbIdx];
  el("lbImg").src = it.src.startsWith("http") ? it.src : mediaUrl(it.src);
  el("lbImg").alt = it.title;
  el("lbImg").style.transform = `scale(${lbZoom})`;
  el("lbTitle").textContent = it.title;
  el("lbCount").textContent = `${lbIdx + 1} / ${lbItems.length}`;
  el("lbThumbs").innerHTML = lbItems.map((x, i) => `<img src="${x.src.startsWith("http") ? x.src : mediaUrl(x.src)}" alt="" class="${i === lbIdx ? "on" : ""}" data-i="${i}">`).join("");
  el("lbThumbs").querySelectorAll("img").forEach((t) => t.addEventListener("click", () => { lbIdx = +t.dataset.i; lbZoom = 1; paintLb(); }));
}
function lbMove(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; lbZoom = 1; paintLb(); }

/* ---------- السلة وحفظ الطلب في Supabase ---------- */
function addToCart(id) {
  const n = qty[id]?.n || 1;
  cart[id] = (cart[id] || 0) + n;
  save(LS.cart, cart); paintCart(); openCart();
}
function setCart(id, n) { if (n <= 0) delete cart[id]; else cart[id] = n; save(LS.cart, cart); paintCart(); }
function cartLines() { return Object.entries(cart).map(([id, n]) => ({ p: PRODUCTS.find((x) => x.id === id), n })).filter((l) => l.p); }
function paintCart() {
  const lines = cartLines();
  const count = lines.reduce((s, l) => s + l.n, 0);
  const total = lines.reduce((s, l) => s + l.n * l.p.price, 0);
  if(el("cartCount")) el("cartCount").textContent = count;
  if(el("cartTotal")) el("cartTotal").textContent = money(total);
  if(el("cartItems")) {
    el("cartItems").innerHTML = lines.length ? lines.map((l) => `<div class="line">
      <img src="${l.p.gallery[0].startsWith("http") ? l.p.gallery[0] : mediaUrl(l.p.gallery[0])}" alt="${escapeHTML(l.p.name)}">
      <div class="info"><b>${escapeHTML(l.p.name)}</b><br><small>${money(l.p.price)} × ${l.n}</small></div>
      <div class="qty">
        <button data-c="-1" data-id="${l.p.id}">−</button><span>${l.n}</span>
        <button data-c="1" data-id="${l.p.id}">+</button>
      </div>
    </div>`).join("") : '<p class="empty">سلتك فاضية… اختر عطرك المفضل ✨</p>';
    el("cartItems").querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () =>
      setCart(b.dataset.id, (cart[b.dataset.id] || 0) + +b.dataset.c)));
  }
}
const openCart = () => { el("drawer")?.classList.add("on"); el("overlay")?.classList.add("on"); };
const closeCart = () => { el("drawer")?.classList.remove("on"); el("overlay")?.classList.remove("on"); };

function checkout() { location.href = "booking.html"; }

/* ---------- نظام التقييمات التفاعلي ---------- */
async function buildReviewsSection() { if (typeof renderReviews === "function") await renderReviews(); }

/* ---------- التواصل والفوتر ---------- */
function buildContact() {
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = `https://wa.me/${SITE.whatsapp}`));
  document.querySelectorAll("[data-tel]").forEach((a) => { a.href = `tel:${SITE.phone}`; if (a.dataset.tel === "text") a.textContent = SITE.phoneDisplay; });
  document.querySelectorAll("[data-mail]").forEach((a) => { a.href = `mailto:${SITE.email}`; a.textContent = SITE.email; });
  if(el("fAddress")) el("fAddress").textContent = SITE.address;
  if(el("fHours")) el("fHours").textContent = SITE.hours;
  if(el("fPhone")) el("fPhone").textContent = SITE.phoneDisplay;
  if(el("socials")) el("socials").innerHTML = (SITE.socials || []).map((s) =>
    `<a href="${s.href}" target="_blank" rel="noopener">${s.label} · ${s.handle}</a>`).join("");
  if(el("year")) el("year").textContent = new Date().getFullYear();
  if(el("brandName")) el("brandName").textContent = SITE.name;
}

/* ---------- التشغيل الشامل ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildHero(); 
  buildFilters(); 
  buildFilm(); 
  buildAds(); 
  paintCart(); 
  buildContact();
  buildReviewsSection(); 
  
  fetchProductsFromSupabase();

  el("cartBtn")?.addEventListener("click", openCart);
  el("overlay")?.addEventListener("click", closeCart);
  el("closeCart")?.addEventListener("click", closeCart);
  
  el("lbClose")?.addEventListener("click", closeLightbox);
  el("lbPrev")?.addEventListener("click", () => lbMove(-1));
  el("lbNext")?.addEventListener("click", () => lbMove(1));
  el("lbZoomIn")?.addEventListener("click", () => { lbZoom = Math.min(2.6, lbZoom + 0.25); paintLb(); });
  el("lbZoomOut")?.addEventListener("click", () => { lbZoom = Math.max(1, lbZoom - 0.25); paintLb(); });
  el("lb")?.addEventListener("click", (e) => { if (e.target.id === "lb") closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!el("lb")?.classList.contains("on")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lbMove(-1);
    if (e.key === "ArrowLeft") lbMove(1);
  });
});