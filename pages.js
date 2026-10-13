/* Page-specific additions; the original public connection remains in app.js. */
function publicPage(file, search = '') {
  const name = file.replace(/\.html$/, '');
  if (window.parent !== window && window.parent.location.origin === location.origin) {
    return location.origin + (name === 'index' ? '/' : '/' + name) + search;
  }
  return new URL(file + search, location.href).href;
}
function pageSearch() {
  return new URLSearchParams(window.parent !== window ? window.parent.location.search : location.search);
}
function showMissingImage(img) {
  if (!img.isConnected || img.dataset.failed) return;
  img.dataset.failed = '1';
  if (img.id === 'lbImg') return;
  const placeholder = document.createElement('span');
  placeholder.className = 'media-placeholder';
  placeholder.textContent = img.closest('.brand,footer.site') ? 'A' : 'الصورة غير مرفقة';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', img.alt || 'الصورة غير مرفقة');
  if (img.closest('#heroMedia')) {
    img.hidden = true;
    if (!el('heroMedia').querySelector('.missing-media')) {
      const note = document.createElement('div'); note.className = 'missing-media';
      note.textContent = 'صور العروض غير مرفقة'; el('heroMedia').append(note);
    }
  } else img.replaceWith(placeholder);
}
function installMediaFallbacks() {
  const check = root => root.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('src')) return;
    img.addEventListener('error', () => showMissingImage(img), { once: true });
    if (img.complete && img.naturalWidth === 0) showMissingImage(img);
  });
  check(document);
  new MutationObserver(() => check(document)).observe(document.body, { childList: true, subtree: true });
  const video = el('filmVideo');
  if (video) video.addEventListener('error', () => {
    video.hidden = true;
    const parent = video.parentElement;
    if (!parent || parent.querySelector('.film-missing')) return;
    const state = document.createElement('div'); state.className = 'film-missing';
    state.innerHTML = '<b>AMIRA PARFUMS</b><span>ملف الفيديو غير مرفق</span>';
    parent.append(state);
    el('filmPlay').hidden = true;
    [el('filmSound'), el('filmToggle')].forEach(b => { if (b) b.disabled = true; });
  }, { once: true });
}
function paintBooking() {
  if (!el('bookingItems')) return;
  const lines = cartLines();
  el('bookingItems').innerHTML = lines.length ? lines.map(l => `<div class="line"><div class="info"><b>${escapeHTML(l.p.name)}</b><br><small>${money(l.p.price)} × ${l.n}</small></div><div class="qty"><button type="button" data-book-step="-1" data-id="${escapeHTML(l.p.id)}" aria-label="تقليل كمية ${escapeHTML(l.p.name)}">−</button><span>${l.n}</span><button type="button" data-book-step="1" data-id="${escapeHTML(l.p.id)}" aria-label="زيادة كمية ${escapeHTML(l.p.name)}">+</button></div><button class="btn" type="button" data-book-remove="${escapeHTML(l.p.id)}" aria-label="إزالة ${escapeHTML(l.p.name)}">×</button></div>`).join('') : '<p class="empty">اختر المنتج الذي ترغب في حجزه</p>';
  el('bookingTotal').textContent = money(lines.reduce((sum, l) => sum + l.n * l.p.price, 0));
  document.querySelectorAll('[data-book-step]').forEach(b => b.onclick = () => { setCart(b.dataset.id, (cart[b.dataset.id] || 0) + Number(b.dataset.bookStep)); paintBooking(); });
  document.querySelectorAll('[data-book-remove]').forEach(b => b.onclick = () => { setCart(b.dataset.bookRemove, 0); paintBooking(); });
}
function fillProductOptions() {
  ['bookingProduct', 'qrProduct'].forEach(id => {
    const select = el(id); if (!select) return;
    select.innerHTML = `<option value="">${id === 'qrProduct' ? 'كل المنتجات' : 'اختر المنتج'}</option>` + PRODUCTS.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} — ${money(p.price)}</option>`).join('');
  });
  const product = pageSearch().get('product');
  if (product && PRODUCTS.some(p => p.id === product) && el('bookingProduct')) el('bookingProduct').value = product;
  paintBooking();
}
async function submitBooking(event) {
  event.preventDefault();
  const lines = cartLines();
  const status = el('bookingStatus');
  if (!lines.length) { status.textContent = 'أضف منتجًا إلى الطلب أولاً.'; return; }
  const client_name = el('clientName').value.trim(), client_phone = el('clientPhone').value.trim();
  const client_city = el('clientCity').value.trim(), client_district = el('clientDistrict').value.trim();
  if (!client_name || !client_phone || !client_city || !client_district) { status.textContent = 'أكمل بيانات التواصل والتوصيل.'; return; }
  const client_floor_details = el('clientNotes').value.trim();
  const total_amount = lines.reduce((s, l) => s + l.n * l.p.price, 0);
  const message = `مرحباً ${SITE.name}\nأرغب بطلب:\n` + lines.map(l => `• ${l.p.name} × ${l.n} = ${l.n * l.p.price} ${SITE.currency}`).join('\n') + `\nالإجمالي: ${total_amount} ${SITE.currency}\nالاسم: ${client_name}\nالجوال: ${client_phone}\nالمدينة: ${client_city}\nالحي: ${client_district}\nملاحظات: ${client_floor_details}`;
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
  // Open during the user gesture; the visible link remains available if blocked.
  const target = window.open(href, '_blank', 'noopener');
  const link = el('bookingWhatsApp'); link.href = href; link.hidden = false;
  el('bookingSubmit').disabled = true;
  status.textContent = 'جاري حفظ الطلب…';
  try {
    const { error } = await dbClient.from('luxury_orders').insert([{ id: 'ORD-' + Date.now(), client_name, client_phone, client_city, client_district, client_floor_details, payment_method: 'تحويل / واتساب', payment_status: 'معلق', total_amount, order_items: lines }]);
    if (error) throw error;
    status.textContent = 'تم تسجيل الطلب. أرسل رسالة واتساب لتأكيد الحجز.';
  } catch {
    status.textContent = 'تعذر حفظ الطلب إلكترونيًا. يمكنك إرساله عبر رابط واتساب الظاهر، والحجز لا يتأكد إلا بتأكيد المتجر.';
  } finally { el('bookingSubmit').disabled = false; }
}
async function renderReviews() {
  const container = el('reviewsSection'); if (!container) return;
  container.innerHTML = '<div class="wrap"><div class="head"><span class="kicker">CLIENT REVIEWS</span><h1>آراء وتقييمات العملاء</h1><div class="hairline"></div></div><p class="empty">جاري تحميل التقييمات…</p></div>';
  let reviews = [], readError = false;
  try {
    const { data, error } = await dbClient.from('fragrance_reviews').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    reviews = data || [];
  } catch { readError = true; }
  const score = reviews.length ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1) : '—';
  container.innerHTML = `<div class="wrap"><div class="head"><span class="kicker">CLIENT REVIEWS</span><h1>آراء وتقييمات العملاء</h1><div class="hairline"></div></div><div class="review-summary"><b>${score}</b><span>من ٥ · ${reviews.length} تقييم</span></div>${readError ? '<p class="empty">تعذر تحميل التقييمات من الخدمة الحالية. حاول مجددًا لاحقًا.</p>' : ''}<div class="review-grid">${reviews.map(r => `<article class="review-card"><header><b>${escapeHTML(r.customer_name || r.name)}</b><span aria-label="${Number(r.rating)} من 5">${'★'.repeat(Math.max(0, Math.min(5, Number(r.rating) || 0)))}</span></header><p>${escapeHTML(r.comment)}</p><small>${escapeHTML(String(r.created_at || '').split('T')[0])}</small></article>`).join('') || (!readError ? '<p class="empty">كن أول من يشارك تجربته</p>' : '')}</div><div class="review-form-box"><h2>أضف تقييمك العطري</h2><form id="reviewForm" class="form-stack"><div class="field"><label for="revName">اسمك</label><input id="revName" required maxlength="100" autocomplete="name"></div><div class="field"><label>تقييمك</label><div class="star-input" role="group" aria-label="تقييم العطر">${[1,2,3,4,5].map(i => `<button type="button" class="selected" data-rating="${i}" aria-label="${i} من 5" aria-pressed="${i === 5}">★</button>`).join('')}</div></div><div class="field"><label for="revComment">تجربتك مع العطر</label><textarea id="revComment" rows="4" required maxlength="2000"></textarea></div><button class="btn gold" id="reviewSubmit">إرسال التقييم</button><p id="reviewStatus" role="status"></p></form></div></div>`;
  let rating = 5;
  container.querySelectorAll('[data-rating]').forEach(b => b.onclick = () => {
    rating = Number(b.dataset.rating);
    container.querySelectorAll('[data-rating]').forEach(star => { star.classList.toggle('selected', Number(star.dataset.rating) <= rating); star.setAttribute('aria-pressed', String(Number(star.dataset.rating) === rating)); });
  });
  el('reviewForm').onsubmit = async e => {
    e.preventDefault();
    const customer_name = el('revName').value.trim(), comment = el('revComment').value.trim();
    if (!customer_name || !comment) { el('reviewStatus').textContent = 'أدخل الاسم والتقييم.'; return; }
    const submit = el('reviewSubmit'); submit.disabled = true;
    el('reviewStatus').textContent = 'جاري إرسال تقييمك…';
    try {
      const { error } = await dbClient.from('fragrance_reviews').insert([{ customer_name, rating, comment }]);
      if (error) throw error;
      await renderReviews();
      el('reviewStatus').textContent = 'شكرًا لك! تم حفظ تقييمك.';
    } catch {
      el('reviewStatus').textContent = 'لم يتم حفظ التقييم. الخدمة الحالية لا تسمح بالإرسال الآن؛ حاول لاحقًا.';
      submit.disabled = false;
    }
  };
}
async function qrData(value, size = 420) {
  return window.QRCode.toDataURL(value, { width: size, margin: 2, errorCorrectionLevel: 'M' });
}
async function initQR() {
  if (el('reviewQR')) {
    const img = document.createElement('img'); img.src = await qrData(publicPage('reviews.html')); img.alt = 'رمز QR للتقييمات'; el('reviewQR').append(img);
  }
  if (!el('qrLinks')) return;
  const links = [
    { label: 'التقييمات', href: publicPage('reviews.html') },
    { label: 'حجز منتج', href: publicPage('booking.html') },
    ...(SITE.socials || []),
    { label: 'التواصل', href: publicPage('contact.html') },
  ];
  el('qrLinks').innerHTML = links.map((s, i) => `<article class="qr-link"><h2>${escapeHTML(s.label)}</h2><div class="qr-image"><img id="qrLink${i}" alt="رمز QR ${escapeHTML(s.label)}"></div><a class="btn" href="${escapeHTML(s.href)}" target="_blank" rel="noopener">فتح ${escapeHTML(s.label)} ↗</a><a class="btn" id="qrDownload${i}" download="amira-${i}.png">تحميل الرمز ↓</a></article>`).join('');
  await Promise.all(links.map(async (s, i) => { const data = await qrData(s.href); el('qrLink' + i).src = data; el('qrDownload' + i).href = data; }));
  const kind = el('kind'), value = el('value');
  const requested = pageSearch().get('kind');
  if (requested && Array.from(kind.options).some(o => o.value === requested)) kind.value = requested;
  const render = async () => {
    if (!value.value.trim()) { value.reportValidity(); return; }
    const size = Math.max(200, Math.min(900, Number(el('size').value) || 420));
    const data = await qrData(value.value, size); el('qr').src = data; el('dl').href = data; el('qrText').textContent = value.value;
  };
  const preset = () => {
    const map = { reviews: publicPage('reviews.html'), site: publicPage('index.html'), wa: 'https://wa.me/' + SITE.whatsapp, tel: 'tel:' + SITE.phone, booking: publicPage('booking.html', el('qrProduct').value ? '?product=' + encodeURIComponent(el('qrProduct').value) : ''), contact: publicPage('contact.html'), custom: '' };
    value.value = map[kind.value] || '';
    el('qrProduct').closest('.field').hidden = kind.value !== 'booking';
    if (value.value) void render();
  };
  kind.onchange = preset; el('qrProduct').onchange = preset;
  el('gen').onclick = render; el('printBtn').onclick = () => window.print();
  preset();
}
function initGallery() {
  if (!el('galleryUpload')) return;
  const images = read('amira_gallery', []);
  const paint = () => {
    el('customGallery').innerHTML = images.map((src, i) => `<button type="button" data-user-image="${i}" aria-label="تكبير الصورة ${i+1}"><img src="${src}" alt="صورة مضافة ${i+1}"></button>`).join('');
    el('customGallery').querySelectorAll('button').forEach(b => b.onclick = () => openLightbox(images.map(src => ({ src, title: 'صورك المضافة' })), Number(b.dataset.userImage)));
  };
  paint();
  el('galleryUpload').onchange = async e => {
    const files = Array.from(e.target.files || []);
    const pending = [];
    for (const file of files) {
      if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) { el('galleryStatus').textContent = 'اختر صورًا أصغر من ٢ ميجابايت لكل صورة.'; continue; }
      pending.push(await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }));
    }
    try { save('amira_gallery', [...images, ...pending]); images.push(...pending); paint(); el('galleryStatus').textContent = 'تمت إضافة الصور إلى معرض هذا الجهاز فقط. لإظهارها للجميع، أضفها لملفات المعرض على الاستضافة.'; }
    catch { el('galleryStatus').textContent = 'مساحة الجهاز غير كافية لحفظ الصور.'; }
    e.target.value = '';
  };
}
document.addEventListener('DOMContentLoaded', () => {
  // Keep actual navigation at the outer app URL when embedded in the preview.
  document.addEventListener('click', event => {
    const a = event.target.closest('a');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href') || '';
    const match = href.match(/^([a-z]+\.html)(.*)$/);
    if (match && window.parent !== window) { event.preventDefault(); window.parent.location.href = publicPage(match[1], match[2]); }
  });
  document.querySelectorAll('nav.links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === (document.body.dataset.page || '') + '.html'));
  document.querySelectorAll('.contact-address').forEach(n => n.textContent = SITE.address);
  document.querySelectorAll('.contact-hours').forEach(n => n.textContent = SITE.hours);
  if (el('contactForm')) el('contactForm').onsubmit = e => { e.preventDefault(); const msg = `مرحبًا ${SITE.name}\nالاسم: ${el('contactName').value.trim()}\n${el('contactMessage').value.trim()}`; window.open('https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); };
  if (el('bookingForm')) el('bookingForm').onsubmit = submitBooking;
  if (el('bookingAdd')) el('bookingAdd').onclick = () => {
    const id = el('bookingProduct').value, quantity = Number(el('bookingQty').value);
    if (!id) { el('bookingStatus').textContent = 'اختر منتجًا أولًا.'; return; }
    if (!Number.isInteger(quantity) || quantity < 1) { el('bookingStatus').textContent = 'أدخل كمية صحيحة لا تقل عن ١.'; return; }
    setCart(id, (cart[id] || 0) + quantity); paintBooking(); el('bookingStatus').textContent = '';
  };
  document.addEventListener('amira:products', fillProductOptions);
  fillProductOptions();
  installMediaFallbacks(); initGallery(); void initQR();
});