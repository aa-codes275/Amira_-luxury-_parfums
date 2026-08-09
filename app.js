/* ===========================================================
   Amira للعطور — منطق الموقع (بدون أي مكتبات خارجية)
   يقرأ البيانات من localStorage إن وُجدت (من صفحة admin.html)
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
{
  label: "واتساب",
  href: "https://wa.me/966558787732",
  handle: "+966 55 878 7732"
},
{
  label: "سناب شات",
  href: "https://snapchat.com/t/YV11SKgs",
  handle: "@amira.parfums"
},
{
  label: "تيك توك",
  href: "https://www.tiktok.com/@amira.parfums1",
  handle: "@amira.parfums1"
},
{
  label: "إنستجرام",
  href: "https://www.instagram.com/amira.parfums.1",
  handle: "@amira.parfums.1"
},
{
  label: "متجر سلة",
  href: "https://salla.sa/shmatalmsa",
  handle: "متجر عطور أميرة"
}  ],
};

const PRODUCTS_DEFAULT = [
  {
    id: "shahrazad", name: "شهرزاد", latin: "Shahrazad",
    tagline: "أنثى من عود وزهر الليل، حضور لا يُنسى.",
    notes: ["عود", "ياسمين", "فانيلا"], price: 199, oldPrice: 230,
    size: "100 مل", badge: "الأكثر طلباً", gender: "نسائي",
    gallery: ["amira-red-bottle.jpg", "shahrazad-poster.jpg", "trio-table.jpg", "amira-trio-ad.jpg"],
  },
  {
    id: "shahryar", name: "شهريار", latin: "Shahryar",
    tagline: "توقيع رجالي جسور من الجلد والتوابل والعود.",
    notes: ["جلد", "فلفل أسود", "عود"], price: 199, oldPrice: 230,
    size: "100 مل", badge: "توقيع رجالي", gender: "رجالي",
    gallery: ["shahryar-closeup.jpg", "shahryar-ottoman.jpg", "shahryar-hand.jpg", "shahryar-box-bag.jpg"],
  },
  {
    id: "kahraman", name: "كهرمان", latin: "Kahraman",
    tagline: "دفء الكهرمان وبرودة المسك في نفس واحد.",
    notes: ["كهرمان", "مسك", "برغموت"], price: 199, oldPrice: 230,
    size: "100 مل", gender: "للجنسين",
    gallery: ["kahraman-flowers.jpg", "kahraman-box.jpg", "amira-clear-bottle.jpg", "amira-box-bag.jpg"],
  },
  {
    id: "layali", name: "ليالي", latin: "Layali",
    tagline: "ورد أحمر مخملي يشتعل مع كل رشة.",
    notes: ["ورد طائفي", "زعفران", "صندل"], price: 199, oldPrice: 230,
    size: "100 مل", badge: "إصدار محدود", gender: "نسائي",
    gallery: ["amira-red-bottle.jpg", "shahrazad-poster.jpg", "amira-trio-ad.jpg"],
  },
  {
    id: "trio-box", name: "بكج الثلاثية", latin: "Trio Box",
    tagline: "ثلاثة عطور، ثلاث شخصيات، بصمة واحدة.",
    notes: ["شهرزاد", "شهريار", "كهرمان"], price: 597, oldPrice: 690,
    size: "3 × 100 مل", badge: "هدية فاخرة", gender: "للجنسين",
    gallery: ["trio-table.jpg", "amira-trio-ad.jpg", "amira-black-ad.jpg", "amira-red-bottle.jpg"],
  },
  {
    id: "tawzeeh", name: "بكج التوزيع", latin: "Tawzeeh Box",
    tagline: "علبة توزيعات فاخرة بنقشة الأزقة القديمة — جاهزة للمناسبات والأعراس.",
    notes: ["توزيعات", "تغليف فاخر", "مناسبات"], price: 65,
    size: "علبة توزيعات", badge: "الأفضل للمناسبات", gender: "للجنسين",
    gallery: ["tawzeeh-box.jpg", "shahryar-box-bag.jpg", "amira-box-bag.jpg", "kahraman-box.jpg"],
  },
];

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

/* ---------- التخزين ---------- */
const LS = { site: "amira_site", products: "amira_products", ads: "amira_ads", cart: "amira_cart" };
const read = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const SITE = { ...SITE_DEFAULT, ...read(LS.site, {}) };
const PRODUCTS = read(LS.products, PRODUCTS_DEFAULT);
const ADS = read(LS.ads, ADS_DEFAULT);
let cart = read(LS.cart, {});
let filter = "الكل";
let qty = {};

const money = (n) => `${Number(n).toLocaleString("ar-EG")} ${SITE.currency || "ر.س"}`;
const el = (id) => document.getElementById(id);

/* ---------- الهيرو ---------- */
let heroIdx = 0;
function buildHero() {
  const media = el("heroMedia"), dots = el("heroDots");
  if (!media) return;
  media.innerHTML = HERO_SLIDES.map((s, i) => `<img src="${IMG + s.src}" alt="${s.title}" class="${i === 0 ? "on" : ""}">`).join("") +
    '<div class="hero-veil"></div>';
  dots.innerHTML = HERO_SLIDES.map((_, i) => `<i class="${i === 0 ? "on" : ""}" data-i="${i}"></i>`).join("");
  dots.querySelectorAll("i").forEach((d) => d.addEventListener("click", () => setHero(+d.dataset.i)));
  paintHero();
  setInterval(() => setHero((heroIdx + 1) % HERO_SLIDES.length), 5200);
}
function setHero(i) { heroIdx = i; paintHero(); }
function paintHero() {
  const s = HERO_SLIDES[heroIdx];
  document.querySelectorAll("#heroMedia img").forEach((img, i) => img.classList.toggle("on", i === heroIdx));
  document.querySelectorAll("#heroDots i").forEach((d, i) => d.classList.toggle("on", i === heroIdx));
  el("heroKicker").textContent = s.kicker;
  el("heroTitle").innerHTML = s.title.replace(/(Amira|شهرزاد)/, '<span class="text-gold">$1</span>');
  el("heroText").textContent = s.text;
}

/* ---------- المنتجات ---------- */
function buildFilters() {
  const kinds = ["الكل", "نسائي", "رجالي", "للجنسين"];
  el("filters").innerHTML = kinds.map((k) => `<button class="chip ${k === filter ? "on" : ""}" data-k="${k}">${k}</button>`).join("");
  el("filters").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.k; buildFilters(); buildProducts(); }));
}

function buildProducts() {
  const list = PRODUCTS.filter((p) => filter === "الكل" || p.gender === filter);
  el("grid").innerHTML = list.map((p) => {
    const active = qty[p.id]?.img || 0;
    const n = qty[p.id]?.n || 1;
    return `<article class="card">
      <div class="ph">
        <img src="${IMG + p.gallery[active]}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="zoom" data-zoom="${p.id}" aria-label="تكبير صورة ${p.name}">⤢</button>
      </div>
      <div class="thumbs">
        ${p.gallery.map((g, i) => `<button class="${i === active ? "on" : ""}" data-thumb="${p.id}" data-i="${i}" aria-label="صورة ${i + 1}"><img src="${IMG + g}" alt=""></button>`).join("")}
      </div>
      <div class="body">
        <div>
          <span class="lat">${p.latin}</span>
          <h3>${p.name}</h3>
        </div>
        <p class="tag">${p.tagline}</p>
        <div class="notes">${(p.notes || []).map((x) => `<span>${x}</span>`).join("")}<span>${p.size}</span></div>
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

  el("grid").querySelectorAll("[data-thumb]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.thumb; qty[id] = { ...(qty[id] || {}), img: +b.dataset.i }; buildProducts();
  }));
  el("grid").querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.id, cur = qty[id]?.n || 1;
    qty[id] = { ...(qty[id] || {}), n: Math.max(1, cur + +b.dataset.step) }; buildProducts();
  }));
  el("grid").querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => addToCart(b.dataset.add)));
  el("grid").querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    const p = PRODUCTS.find((x) => x.id === b.dataset.zoom);
    openLightbox(p.gallery.map((g) => ({ src: g, title: p.name })), qty[p.id]?.img || 0);
  }));
}

/* ---------- الإعلانات ---------- */
function buildAds() {
  el("ads").innerHTML = ADS.map((a, i) => `<button data-ad="${i}" aria-label="تكبير ${a.title}">
      <img src="${IMG + a.src}" alt="${a.title}" loading="lazy">
      <span class="shade"></span>
      <span class="cap"><small>${a.kicker}</small><p class="text-gold">${a.title}</p></span>
    </button>`).join("");
  el("ads").querySelectorAll("[data-ad]").forEach((b) => b.addEventListener("click", () =>
    openLightbox(ADS.map((a) => ({ src: a.src, title: a.title })), +b.dataset.ad)));
}

/* ---------- الفيديو ---------- */
const FILM = { src: "media/amira-film.mp4", poster: "media/amira-film-poster.jpg" };
function buildFilm() {
  const v = el("filmVideo"), btn = el("filmPlay"), toggle = el("filmToggle"), sound = el("filmSound");
  if (!v) return;
  v.src = FILM.src; v.poster = FILM.poster; v.muted = true;
  const sync = () => {
    const on = !v.paused;
    btn.style.display = on ? "none" : "grid";
    toggle.textContent = on ? "⏸" : "▶";
  };
  const play = () => { v.paused ? v.play().catch(() => {}) : v.pause(); };
  [btn, toggle, v].forEach((n) => n.addEventListener("click", play));
  sound.addEventListener("click", () => { v.muted = !v.muted; sound.textContent = v.muted ? "🔇" : "🔊"; });
  v.addEventListener("play", sync); v.addEventListener("pause", sync);
  sound.textContent = "🔇"; sync();
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
  el("lbImg").src = IMG + it.src;
  el("lbImg").alt = it.title;
  el("lbImg").style.transform = `scale(${lbZoom})`;
  el("lbTitle").textContent = it.title;
  el("lbCount").textContent = `${lbIdx + 1} / ${lbItems.length}`;
  el("lbThumbs").innerHTML = lbItems.map((x, i) => `<img src="${IMG + x.src}" alt="" class="${i === lbIdx ? "on" : ""}" data-i="${i}">`).join("");
  el("lbThumbs").querySelectorAll("img").forEach((t) => t.addEventListener("click", () => { lbIdx = +t.dataset.i; lbZoom = 1; paintLb(); }));
}
function lbMove(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; lbZoom = 1; paintLb(); }

/* ---------- السلة ---------- */
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
  el("cartCount").textContent = count;
  el("cartTotal").textContent = money(total);
  el("cartItems").innerHTML = lines.length ? lines.map((l) => `<div class="line">
      <img src="${IMG + l.p.gallery[0]}" alt="${l.p.name}">
      <div class="info"><b>${l.p.name}</b><br><small>${money(l.p.price)} × ${l.n}</small></div>
      <div class="qty">
        <button data-c="-1" data-id="${l.p.id}">−</button><span>${l.n}</span>
        <button data-c="1" data-id="${l.p.id}">+</button>
      </div>
    </div>`).join("") : '<p class="empty">سلتك فاضية… اختر عطرك المفضل ✨</p>';
  el("cartItems").querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () =>
    setCart(b.dataset.id, (cart[b.dataset.id] || 0) + +b.dataset.c)));
}
const openCart = () => { el("drawer").classList.add("on"); el("overlay").classList.add("on"); };
const closeCart = () => { el("drawer").classList.remove("on"); el("overlay").classList.remove("on"); };

function checkout() {
  const lines = cartLines();
  if (!lines.length) return;
  const total = lines.reduce((s, l) => s + l.n * l.p.price, 0);
  const msg = `مرحباً ${SITE.name} 🌙%0Aأرغب بطلب:%0A` +
    lines.map((l) => `• ${l.p.name} (${l.p.size}) × ${l.n} = ${l.n * l.p.price} ${SITE.currency}`).join("%0A") +
    `%0A—%0Aالإجمالي: ${total} ${SITE.currency}`;
  window.open(`https://wa.me/${SITE.whatsapp}?text=${msg}`, "_blank");
}

/* ---------- التواصل والفوتر ---------- */
function buildContact() {
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = `https://wa.me/${SITE.whatsapp}`));
  document.querySelectorAll("[data-tel]").forEach((a) => { a.href = `tel:${SITE.phone}`; if (a.dataset.tel === "text") a.textContent = SITE.phoneDisplay; });
  document.querySelectorAll("[data-mail]").forEach((a) => { a.href = `mailto:${SITE.email}`; a.textContent = SITE.email; });
  el("fAddress").textContent = SITE.address;
  el("fHours").textContent = SITE.hours;
  el("fPhone").textContent = SITE.phoneDisplay;
  el("socials").innerHTML = (SITE.socials || []).map((s) =>
    `<a href="${s.href}" target="_blank" rel="noopener">${s.label} · ${s.handle}</a>`).join("");
  el("year").textContent = new Date().getFullYear();
  el("brandName").textContent = SITE.name;
}

/* ---------- التشغيل ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildHero(); buildFilters(); buildProducts(); buildFilm(); buildAds(); paintCart(); buildContact();
  el("cartBtn").addEventListener("click", openCart);
  el("overlay").addEventListener("click", closeCart);
  el("closeCart").addEventListener("click", closeCart);
  el("checkout").addEventListener("click", checkout);
  el("lbClose").addEventListener("click", closeLightbox);
  el("lbPrev").addEventListener("click", () => lbMove(-1));
  el("lbNext").addEventListener("click", () => lbMove(1));
  el("lbZoomIn").addEventListener("click", () => { lbZoom = Math.min(2.6, lbZoom + 0.25); paintLb(); });
  el("lbZoomOut").addEventListener("click", () => { lbZoom = Math.max(1, lbZoom - 0.25); paintLb(); });
  el("lb").addEventListener("click", (e) => { if (e.target.id === "lb") closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!el("lb").classList.contains("on")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lbMove(-1);
    if (e.key === "ArrowLeft") lbMove(1);
  });
});
