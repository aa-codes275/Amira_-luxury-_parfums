/* Amira — تحسينات الواجهة: قائمة الجوال، أيقونات، التقييمات، التواصل */
const ICONS = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  snap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 0 5.2 2.3 5.2 5.3v2.3c.5.2 1.1 0 1.6-.2.6-.2 1.2.5.7 1-.6.6-1.8.8-2.2 1.3.5 2 2.3 3.8 4.3 4.3.4.1.5.6.1.8-.8.4-1.8.5-2.4.8-.3.5-.2 1.2-.7 1.3-.7.1-1.6-.3-2.6 0-1.2.3-2 1.9-4 1.9s-2.8-1.6-4-1.9c-1-.3-1.9.1-2.6 0-.5-.1-.4-.8-.7-1.3-.6-.3-1.6-.4-2.4-.8-.4-.2-.3-.7.1-.8 2-.5 3.8-2.3 4.3-4.3-.4-.5-1.6-.7-2.2-1.3-.5-.5.1-1.2.7-1 .5.2 1.1.4 1.6.2V7.3C6.8 4.3 9 2 12 2z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.3 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7A4.6 4.6 0 0 1 16.6 2z"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 7h16l-1.2 12.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.6-7.3H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};
const socialIcon = s => /wa\.me|واتساب/.test(s.href + s.label) ? ICONS.wa : /snap/.test(s.href) ? ICONS.snap : /tiktok/.test(s.href) ? ICONS.tiktok : /instagram/.test(s.href) ? ICONS.insta : ICONS.store;

function enhanceHeader() {
  const bar = document.querySelector('header.site .bar'), nav = document.querySelector('nav.links');
  if (!bar || !nav || el('menuBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'menuBtn'; btn.className = 'menu-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'القائمة'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  bar.prepend(btn);
  btn.onclick = () => { const open = document.body.classList.toggle('nav-open'); btn.setAttribute('aria-expanded', String(open)); };
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
  const cartBtn = el('cartBtn');
  if (cartBtn) { const count = el('cartCount'); cartBtn.innerHTML = ICONS.cart; cartBtn.append(count); cartBtn.classList.add('cart-icon'); cartBtn.setAttribute('aria-label', 'السلة'); }
  const fw = document.querySelector('.float-wa'); if (fw) fw.innerHTML = ICONS.wa;
}

function enhanceSocials() {
  document.querySelectorAll('#socials').forEach(box => {
    box.innerHTML = (SITE.socials || []).map(s => `<a href="${escapeHTML(s.href)}" target="_blank" rel="noopener" aria-label="${escapeHTML(s.label)}" title="${escapeHTML(s.label)} · ${escapeHTML(s.handle)}">${socialIcon(s)}</a>`).join('');
  });
  document.querySelectorAll('[data-ico]').forEach(n => n.innerHTML = ICONS[n.dataset.ico] || '');
  document.querySelectorAll('.contact-address').forEach(n => n.textContent = SITE.address);
  document.querySelectorAll('.contact-hours').forEach(n => n.textContent = SITE.hours);
}

function perfumeOptions(select) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">اختر العطر</option>' + PRODUCTS.map(p => `<option>${escapeHTML(p.name)}</option>`).join('');
  select.value = current;
}

/* ---------- صفحة التقييمات (تستبدل العرض السابق) ---------- */
function splitReview(comment) {
  const m = String(comment || '').match(/^\[(.+?)\]\s*([\s\S]*)$/);
  return m ? { perfume: m[1], text: m[2] } : { perfume: '', text: comment || '' };
}
async function renderReviews() {
  const container = el('reviewsSection'); if (!container) return;
  let reviews = [], readError = false;
  try {
    const { data, error } = await dbClient.from('fragrance_reviews').select('*').order('created_at', { ascending: false });
    if (error) throw error; reviews = data || [];
  } catch { readError = true; }
  const score = reviews.length ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1) : '—';
  const stars = n => '★'.repeat(Math.max(0, Math.min(5, Number(n) || 0))) + '<i>' + '★'.repeat(5 - Math.max(0, Math.min(5, Number(n) || 0))) + '</i>';
  container.innerHTML = `<div class="wrap">
    <div class="head"><span class="kicker">CLIENT REVIEWS</span><h1 class="script">آراء عملاء أميرة</h1><div class="hairline"></div></div>
    <div class="rv-summary"><b>${score}</b><div><div class="rv-stars">${stars(Math.round(Number(score) || 0))}</div><span>${reviews.length} تقييم من عملائنا</span></div></div>
    ${readError ? '<p class="empty">تعذر تحميل التقييمات حاليًا. حاول لاحقًا.</p>' : ''}
    <div class="rv-layout">
      <form id="reviewForm" class="rv-form form-stack"><h2 class="script">شاركنا تجربتك</h2>
        <div class="field"><label for="revName">الاسم</label><input id="revName" required maxlength="100" autocomplete="name"></div>
        <div class="field"><label for="revPerfume">اسم العطر</label><select id="revPerfume" required><option value="">اختر العطر</option></select></div>
        <div class="field"><label>التقييم</label><div class="star-input" role="group" aria-label="التقييم">${[1,2,3,4,5].map(i => `<button type="button" class="selected" data-rating="${i}" aria-label="${i} من 5">★</button>`).join('')}</div></div>
        <div class="field"><label for="revComment">رأيك في العطر</label><textarea id="revComment" rows="4" required maxlength="2000"></textarea></div>
        <button class="btn gold" id="reviewSubmit">إرسال التقييم</button><p id="reviewStatus" role="status"></p>
      </form>
      <div class="rv-list">${reviews.map(r => { const x = splitReview(r.comment); return `<article class="rv-card"><header><span class="rv-avatar">${escapeHTML(String(r.customer_name || r.name || '؟').trim().charAt(0))}</span><div><b>${escapeHTML(r.customer_name || r.name)}</b>${x.perfume ? `<small class="rv-perfume">${escapeHTML(x.perfume)}</small>` : ''}</div><span class="rv-stars">${stars(r.rating)}</span></header><p>${escapeHTML(x.text)}</p><small>${escapeHTML(String(r.created_at || '').split('T')[0])}</small></article>`; }).join('') || (!readError ? '<p class="empty">كن أول من يشارك تجربته مع عطور أميرة</p>' : '')}</div>
    </div></div>`;
  perfumeOptions(el('revPerfume'));
  let rating = 5;
  container.querySelectorAll('[data-rating]').forEach(b => b.onclick = () => {
    rating = Number(b.dataset.rating);
    container.querySelectorAll('[data-rating]').forEach(s => s.classList.toggle('selected', Number(s.dataset.rating) <= rating));
  });
  el('reviewForm').onsubmit = async e => {
    e.preventDefault();
    const customer_name = el('revName').value.trim(), perfume = el('revPerfume').value, text = el('revComment').value.trim();
    if (!customer_name || !perfume || !text) { el('reviewStatus').textContent = 'أدخل الاسم واسم العطر ورأيك.'; return; }
    const submit = el('reviewSubmit'); submit.disabled = true; el('reviewStatus').textContent = 'جاري الإرسال…';
    try {
      const { error } = await dbClient.from('fragrance_reviews').insert([{ customer_name, rating, comment: `[${perfume}] ${text}` }]);
      if (error) throw error;
      await renderReviews(); el('reviewStatus').textContent = 'شكرًا لك! تم حفظ تقييمك.';
    } catch { el('reviewStatus').textContent = 'تعذر حفظ التقييم الآن؛ حاول لاحقًا.'; submit.disabled = false; }
  };
}

function enhanceContact() {
  const form = el('contactForm'); if (!form || !el('contactPerfume')) return;
  perfumeOptions(el('contactPerfume'));
  form.onsubmit = e => {
    e.preventDefault();
    const msg = `مرحبًا ${SITE.name}\nالاسم: ${el('contactName').value.trim()}\nالعنوان: ${el('contactAddress').value.trim()}\nالعطر: ${el('contactPerfume').value}\n${el('contactMessage').value.trim()}`;
    window.open('https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  if (el('waQR') && window.QRCode) window.QRCode.toDataURL('https://wa.me/' + SITE.whatsapp, { width: 360, margin: 1 }).then(src => el('waQR').innerHTML = `<img src="${src}" alt="رمز QR لواتساب أميرة">`);
}

document.addEventListener('DOMContentLoaded', () => { enhanceHeader(); enhanceSocials(); enhanceContact(); });
document.addEventListener('amira:products', () => { perfumeOptions(el('contactPerfume')); perfumeOptions(el('revPerfume')); });
