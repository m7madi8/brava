// Brava.ps – Single Page App (frontend only)
// Mock data, client-side routing, cart/wishlist, reviews, recommendations, theme, GDPR

(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Storage helpers
  const storage = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  // Mock Products
  const PRODUCTS = [
    { id: 'airpods-1', name: 'AirPods Pro 2', price: 899, category: 'AirPods', color: 'white', rating: 4.8, reviews: [], images: [''], description: 'إلغاء ضوضاء نشط ووضع الشفافية.' },
    { id: 'watch-1', name: 'Apple Watch Series 9', price: 1499, category: 'Apple Watch', color: 'black', rating: 4.7, reviews: [], images: [''], description: 'مزايا صحية ولياقة قوية.' },
    { id: 'access-1', name: 'MagSafe Charger', price: 149, category: 'Accessories', color: 'gray', rating: 4.6, reviews: [], images: [''], description: 'شحن لاسلكي سريع للآيفون.' },
    { id: 'watch-2', name: 'Apple Watch SE', price: 1099, category: 'Apple Watch', color: 'silver', rating: 4.4, reviews: [], images: [''], description: 'مزايا أساسية تبقيك على اتصال.' },
    { id: 'airpods-2', name: 'AirPods 3', price: 649, category: 'AirPods', color: 'white', rating: 4.3, reviews: [], images: [''], description: 'صوت محيطي مع تتبع ديناميكي للرأس.' },
    { id: 'access-2', name: 'Apple Watch Band – Orange', price: 129, category: 'Accessories', color: 'orange', rating: 4.1, reviews: [], images: [''], description: 'سوار مريح وأنيق.' },
    { id: 'airpods-max', name: 'AirPods Max', price: 1999, category: 'AirPods', color: 'silver', rating: 4.9, reviews: [], images: ['AirPods_Max_2024.webp'], description: 'صوت احترافي مع إلغاء ضوضاء نشط وتجربة فاخرة.' }
  ];

  // Blog posts data (Arabic content)
  const BLOG_POSTS = [
    {
      id: 'airpods-guide',
      title: 'AirPods: كيف تختار الموديل المناسب لك؟',
      tag: 'دليل سريع',
      image: 'AirPods_Max_2024.webp',
      minutes: '3-4 دقائق',
      body: [
        'ابدأ من أسلوب استخدامك: مكالمات يومية، تمارين، أو استماع مركز؟',
        'للعزل القوي للضوضاء اختر الموديلات ذات ANC، وللاستماع الطبيعي استخدم وضع الشفافية.',
        'المقاس والراحة مهمان للاستخدام الطويل؛ جرّب وسادات مختلفة للوصول للثبات والراحة.',
        'احسب عمر البطارية الحقيقي على يومك، لا على الورق؛ الشحن السريع قد يكون فارقًا.'
      ]
    },
    {
      id: 'watch-fitness',
      title: 'Apple Watch: أهم 5 ميزات للياقة',
      tag: 'نصائح',
      image: 'apple-watch-series-9.jpg',
      minutes: '2-3 دقائق',
      body: [
        'حلقات النشاط: هدف بسيط لتحريكك يوميًا.',
        'تتبّع النوم: فهم عاداتك ينعكس على مزاجك وأدائك.',
        'التمارين: خطط مخصّصة وتتبّع دقيق للحركة ونبض القلب.',
        'الإنذارات الصحية: إشعارات نبض غير اعتيادي قد تنبهك مبكرًا.',
        'التركيز: تحكّم بالإشعارات لتحافظ على روتينك.'
      ]
    },
    {
      id: 'style-colors',
      title: 'تنسيق الإكسسوارات بالألوان',
      tag: 'ستايل',
      image: 'apple-watch-band-orange.webp',
      minutes: '2 دقائق',
      body: [
        'ابدأ بلون أساس محايد: أسود، أبيض، أو رمادي.',
        'أضف لونًا مميّزًا واحدًا (Accent) — كالبرتقالي لإطلالة جريئة.',
        'حافظ على توازن اللمعان: قطعة واحدة لامعة تكفي للمظهر اليومي.'
      ]
    }
  ];

  // Images: map available files to products by naming
  const AVAILABLE_IMAGES = [
    'airpods-pro-2.png',
    'AirPods-3.webp',
    'apple-watch-series-9.jpg',
    'apple-watch-se.png',
    'apple-watch-band-orange.webp',
    'magsafe-charger.png',
    'AirPods_Max_2024.webp',
    'AirPods_Max_2024.png',
    'AirPods_Max_2024.webp'
  ];
  const IMAGE_MAP = {
    'airpods-pro-2': 'airpods-pro-2.png',
    'airpods-3': 'AirPods-3.webp',
    'apple-watch-series-9': 'apple-watch-series-9.jpg',
    'apple-watch-se': 'apple-watch-se.png',
    'apple-watch-band-orange': 'apple-watch-band-orange.webp',
    'magsafe-charger': 'magsafe-charger.png',
    'airpods-max': 'AirPods_Max_2024.webp'
  };
  const slugify = (s) => String(s)
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  function resolveImageForProduct(p) {
    const byId = slugify(p.id || '');
    const byName = slugify(p.name || '');
    if (IMAGE_MAP[byId]) return IMAGE_MAP[byId];
    if (IMAGE_MAP[byName]) return IMAGE_MAP[byName];
    const filesL = AVAILABLE_IMAGES.map(f => f.toLowerCase());
    const found = filesL.find(f => f.includes(byId)) || filesL.find(f => f.includes(byName));
    return found ? AVAILABLE_IMAGES[filesL.indexOf(found)] : '';
  }
  function attachImages() {
    PRODUCTS.forEach(p => {
      const has = Array.isArray(p.images) && p.images[0] && String(p.images[0]).trim() !== '';
      if (!has) {
        const src = resolveImageForProduct(p);
        p.images = src ? [src] : [];
      }
    });
  }

  // App State
  const state = {
    cart: storage.get('brava_cart', []), // {id, qty}
    wishlist: storage.get('brava_wishlist', []), // product ids
    theme: storage.get('brava_theme', 'dark'),
    consent: storage.get('brava_gdpr', null),
    views: storage.get('brava_views', {}), // {productId: count}
    reviews: storage.get('brava_reviews', {}), // {productId: Review[]}
    loyalty: storage.get('brava_loyalty', 0)
  };

  // Derived helpers
  const findProduct = (id) => PRODUCTS.find(p => p.id === id);
  const cartCount = () => state.cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = () => state.cart.reduce((a, i) => a + i.qty * (findProduct(i.id)?.price || 0), 0);
  const isWished = (id) => state.wishlist.includes(id);
  const priceFmt = new Intl.NumberFormat('ar-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
  const formatPrice = (amount) => priceFmt.format(amount);

  // UI: Toasts
  function toast(message) {
    const container = $('#toastContainer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => { el.remove(); }, 3200);
  }

  // Cart operations
  function addToCart(id, qty = 1) {
    const item = state.cart.find(i => i.id === id);
    if (item) item.qty += qty; else state.cart.push({ id, qty });
    storage.set('brava_cart', state.cart);
    updateCartUI();
    toast('تمت الإضافة إلى السلة');
  }
  function removeFromCart(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    storage.set('brava_cart', state.cart);
    updateCartUI();
  }
  function changeQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(id);
    storage.set('brava_cart', state.cart);
    updateCartUI();
  }

  // Wishlist
  function toggleWish(id) {
    if (isWished(id)) state.wishlist = state.wishlist.filter(x => x !== id); else state.wishlist.push(id);
    storage.set('brava_wishlist', state.wishlist);
    updateHeaderCounts();
    toast(isWished(id) ? 'تمت الإضافة إلى المفضلة' : 'تمت الإزالة من المفضلة');
  }

  // Loyalty
  function accrueLoyalty(amount) {
    const points = Math.floor(amount * 0.05); // 5% back
    state.loyalty += points;
    storage.set('brava_loyalty', state.loyalty);
    $('#loyaltyInfo').textContent = `ستكسب ${points} نقطة على هذا الطلب. الإجمالي: ${state.loyalty}`;
  }

  // Recommendations
  function recommend() {
    const seen = Object.entries(state.views)
      .sort((a,b) => b[1]-a[1])
      .map(([id]) => id);
    const pool = PRODUCTS.filter(p => !seen.includes(p.id));
    return [...seen.map(findProduct).filter(Boolean), ...pool].slice(0, 4);
  }

  // Router
  const routes = {
    '/': renderHome,
    '/products': renderProducts,
    '/about': renderAbout,
    '/blog': renderBlog,
    '/privacy': renderPrivacy,
    '/wishlist': renderWishlist
  };

  function router() {
    const hash = location.hash.replace('#', '') || '/';
    const view = $('#view');
    // Blog details route: #/blog/<id>
    if (hash.startsWith('/blog/')) {
      const id = hash.split('/')[2];
      view.innerHTML = '';
      renderBlogPost(view, id);
      view.focus();
      updateHeaderCounts();
      return;
    }
    const render = routes[hash] || routes['/'];
    view.innerHTML = '';
    render(view);
    view.focus();
    updateHeaderCounts();
  }

  const arabicCategory = (c) => ({ 'AirPods':'سماعات', 'Apple Watch':'ساعات', 'Accessories':'اكسسوارات', 'Sneakers':'أحذية' })[c] || c;
  const arabicColor = (c) => ({ 'white':'أبيض', 'black':'أسود', 'orange':'برتقالي', 'gray':'رمادي', 'silver':'فضي' })[c] || c;

  // Common UI helpers
  function productCard(p) {
    const wished = isWished(p.id);
    return `
      <div class="card product-card">
        <div class="product-media ${p.images && p.images[0] ? '' : 'placeholder'}" aria-label="${p.name}">
          ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('placeholder');">` : ''}
        </div>
        <div class="card-body product-info">
          <strong>${p.name}</strong>
          <div class="rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))} <span class="muted">(${p.rating.toFixed(1)})</span></div>
          <div class="price">${formatPrice(p.price)}</div>
          <div class="muted">${arabicCategory(p.category)} · ${arabicColor(p.color)}</div>
          <div class="product-actions">
            <button class="btn btn-primary" data-add="${p.id}">أضف للسلة</button>
            <button class="btn btn-ghost" data-qv="${p.id}">نظرة سريعة</button>
            <button class="icon-btn" data-wish="${p.id}" aria-label="المفضلة">${wished ? '❤' : '🤍'}</button>
          </div>
        </div>
      </div>`;
  }

  function quickViewMarkup(p) {
    return `
      <div class="grid grid-2">
        <div>
          ${p.images && p.images[0]
            ? `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;border-radius:12px;" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling?.classList.add('placeholder');">`
            : ''}
          <div class="placeholder" style="border-radius:12px; width:100%; ${p.images && p.images[0] ? 'display:none;' : ''} min-height:280px;"></div>
        </div>
        <div>
          <h3 style="margin-top:0;">${p.name}</h3>
          <div class="rating" style="margin-bottom:6px;">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))} <span class="muted">(${p.rating.toFixed(1)})</span></div>
          <div class="price" style="margin-bottom:10px;">${formatPrice(p.price)}</div>
          <p class="muted">${p.description}</p>
          <div style="display:flex; gap:8px; margin-top:12px;">
            <button class="btn btn-primary" data-add="${p.id}">أضف للسلة</button>
            <button class="btn btn-ghost" data-wish="${p.id}">${isWished(p.id) ? 'إزالة من المفضلة' : 'أضف للمفضلة'}</button>
          </div>
          <hr style="margin:16px 0; border:0; border-top:1px solid rgba(0,0,0,0.08)">
          <h4 style="margin:8px 0;">التقييمات</h4>
          <div id="rev-${p.id}" class="grid" style="gap:8px;">
            ${(state.reviews[p.id]||[]).slice(-3).map(r => `<div class="card" style="padding:10px;">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)} – ${r.text}</div>`).join('') || '<span class="muted">لا توجد تقييمات بعد.</span>'}
          </div>
          <div style="margin-top:10px; display:flex; gap:6px;">
            <select id="stars-${p.id}">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
            <input id="text-${p.id}" placeholder="اكتب تقييمك" style="flex:1">
            <button class="btn btn-primary" data-review="${p.id}">نشر</button>
          </div>
        </div>
      </div>`;
  }

  // Pages
  function renderHome(view) {
    // Hero
    const hero = `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <h1>AirPods Max — صوت احترافي بتصميم فاخر</h1>
            <p>إلغاء الضوضاء النشط، صوت محيطي مع تتبّع الرأس، وراحة طوال اليوم.</p>
            <div style="display:flex; gap:10px;">
              <a href="#/products" class="btn btn-primary">تسوق AirPods Max</a>
              <a href="#/about" class="btn btn-ghost">من نحن</a>
            </div>
          </div>
          <div class="hero-media">
            <img src="airpods-orange.webp" alt="AirPods Max" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="placeholder" style="width:100%;height:100%;display:none;"></div>
          </div>
        </div>
      </section>`;

    // Featured
    const featured = PRODUCTS.slice(0, 4);
    const featuredSection = `
      <section class="section">
        <div class="section-header">
          <h2>مختارات</h2>
          <a href="#/products" class="muted">عرض الكل</a>
        </div>
        <div class="grid grid-4">${featured.map(productCard).join('')}</div>
      </section>`;

    // Testimonials
    const testimonials = `
      <section class="section">
        <div class="section-header">
          <h2>ماذا يقول عملاؤنا <span aria-hidden>✨</span></h2>
          <div class="muted" style="display:flex;align-items:center;gap:8px;">
            <span class="rating">★★★★★</span>
            <span>4.8/5 من 250+ تقييم</span>
          </div>
        </div>
        <div class="grid grid-3">
          <article class="card" style="padding:14px; display:grid; gap:8px;">
            <div class="rating">★★★★★</div>
            <p class="muted" style="margin:0;">وصلت الطلبية خلال يومين والتغليف ممتاز. السماعات أصلية وصوتها واضح.</p>
            <div class="muted" style="font-size:12px;">سارة • عميلة موثّقة • قبل أسبوع</div>
          </article>
          <article class="card" style="padding:14px; display:grid; gap:8px;">
            <div class="rating">★★★★☆</div>
            <p class="muted" style="margin:0;">سوار الساعة لونه مطابق للصور ومريح في الاستخدام اليومي. أنصح به.</p>
            <div class="muted" style="font-size:12px;">علي • عميل موثّق • قبل 3 أيام</div>
          </article>
          <article class="card" style="padding:14px; display:grid; gap:8px;">
            <div class="rating">★★★★★</div>
            <p class="muted" style="margin:0;">خدمة عملاء سريعة عبر واتساب وحلّوا استفساري فورًا. تجربة ممتازة.</p>
            <div class="muted" style="font-size:12px;">لينا • عميلة موثّقة • أمس</div>
          </article>
        </div>
        <div style="margin-top:12px;">
          <a href="#/products" class="btn btn-ghost btn-sm">شاهد المزيد من التقييمات</a>
        </div>
      </section>`;

    // Recommendations
    const recos = recommend();
    const recoSection = `
      <section class="section">
        <div class="section-header">
          <h2>مقترح لك</h2>
        </div>
        <div class="grid grid-4">${recos.map(productCard).join('')}</div>
      </section>`;

    view.innerHTML = `${hero}${featuredSection}${recoSection}`;
    bindProductCardEvents(view);
  }

  function renderProducts(view) {
    const categories = ['AirPods','Apple Watch','Accessories'];
    const filters = `
      <div class="filters">
        ${categories.map(c => `<button class="chip" data-cat="${c}">${({
          'AirPods':'سماعات', 'Apple Watch':'ساعات', 'Accessories':'اكسسوارات'
        })[c]}</button>`).join('')}
        <select id="sort">
          <option value="pop">الأكثر شعبية</option>
          <option value="new">الأحدث</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
        </select>
        <select id="color">
          <option value="">اللون</option>
          ${['white','black','orange','gray','silver'].map(c => `<option value="${c}">${arabicColor(c)}</option>`).join('')}
        </select>
        <select id="type">
          <option value="">النوع</option>
          ${categories.map(c => `<option value="${c}">${({
            'AirPods':'سماعات', 'Apple Watch':'ساعات', 'Accessories':'اكسسوارات'
          })[c]}</option>`).join('')}
        </select>
      </div>`;

    const list = document.createElement('div');
    list.className = 'grid grid-4';

    function renderList() {
      const color = $('#color').value;
      const type = $('#type').value;
      let items = PRODUCTS.slice();
      if (color) items = items.filter(p => p.color === color);
      if (type) items = items.filter(p => p.category === type);
      const sort = $('#sort').value;
      if (sort === 'price-asc') items.sort((a,b) => a.price - b.price);
      if (sort === 'price-desc') items.sort((a,b) => b.price - a.price);
      if (sort === 'new') items = items.reverse();
      // popularity: default order based on rating
      list.innerHTML = items.map(productCard).join('');
      bindProductCardEvents(list);
    }

    view.innerHTML = `<div class="section-header"><h2>المنتجات</h2></div>${filters}`;
    view.appendChild(list);
    renderList();

    // filter chips
    $$('.chip', view).forEach(chip => {
      chip.addEventListener('click', () => {
        $('#type').value = chip.getAttribute('data-cat');
        $$('.chip', view).forEach(c => c.classList.toggle('active', c===chip));
        renderList();
      });
    });
    $('#sort').addEventListener('change', renderList);
    $('#color').addEventListener('change', renderList);
    $('#type').addEventListener('change', renderList);
  }

  function renderAbout(view) {
    view.innerHTML = `
      <section class="section">
        <div class="about-header"><h2><span class="brand-mark">BRAVA</span><span class="brand-dot">.PA</span></h2><p class="muted">هوّيـة فاخرة وتجربة تسوّق مُتقنة</p></div>
        <div class="card aboutX">
          <div class="aboutX-grid">
            <div class="aboutX-copy">
              <h3>لماذا برافا؟</h3>
              <p class="muted">نختار المنتجات بعناية، نُقدّم تغليفًا فاخرًا، وندعمك بخدمة سريعة وواضحة. هدفنا أن تكون تجربتك سهلة وممتعة من أول نقرة حتى وصول طلبك.</p>
              <div class="aboutX-features">
                <div class="aboutX-feature"><span class="fx">✓</span><div><strong>أصلي 100%</strong><small class="muted">منتجات موثوقة مضمونة المصدر  </small></div></div>
                <div class="aboutX-feature"><span class="fx">✓</span><div><strong>تغليف فاخر</strong><small class="muted">تفاصيل أنيقة من لحظة الفتح</small></div></div>
                <div class="aboutX-feature"><span class="fx">✓</span><div><strong>شحن سريع</strong><small class="muted">تسليم خلال وقت قياسي محليًّا</small></div></div>
              </div>
              <div class="aboutX-cta">
                <a href="#/products" class="btn btn-primary">ابدأ التسوّق</a>
                <a href="https://instagram.com" target="_blank" rel="noopener" class="btn btn-ghost">تابعنا</a>
              </div>
              <div class="aboutX-stats">
                <div><strong>2500+</strong><small class="muted">عميل سعيد</small></div>
                <div><strong>4.8/5</strong><small class="muted">متوسط التقييم</small></div>
                <div><strong>24-48h</strong><small class="muted">وقت الشحن</small></div>
              </div>
            </div>
            <div class="aboutX-media">
              <img src="brava_.png" alt="BRAVA.PA" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div class="placeholder" style="display:none;"></div>
            </div>
          </div>
        </div>
      </section>`;
  }

  

  function renderBlog(view) {
    view.innerHTML = `
      <section class="section">
        <div class="section-header"><h2>المدونة</h2><a class="muted" href="#/">العودة</a></div>
        <div class="blog-grid">${BLOG_POSTS.map(p => `
          <article class="card blog-card">
            <div class="blog-media ${p.image ? '' : 'placeholder'}">
              ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('placeholder');">` : ''}
              <span class="blog-tag">${p.tag}</span>
            </div>
            <div class="blog-body">
              <h3 class="blog-title">${p.title}</h3>
              <p class="muted blog-excerpt">${(p.body && p.body[0]) || ''}</p>
              <div class="blog-meta muted">قراءة ${p.minutes || ''}</div>
              <a class="btn btn-ghost" href="#/blog/${p.id}">اقرأ المزيد</a>
            </div>
          </article>`).join('')}
        </div>
      </section>`;
  }

  function renderBlogPost(view, id) {
    const post = BLOG_POSTS.find(x => x.id === id);
    if (!post) {
      view.innerHTML = `<section class="section"><div class="card" style="padding:16px;">لم يتم العثور على المقال.</div></section>`;
      return;
    }
    view.innerHTML = `
      <section class="section">
        <div class="post">
          <header class="post-header">
            <a class="btn btn-ghost btn-sm" href="#/blog">← الرجوع للمدونة</a>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta muted"><span class="post-tag">${post.tag}</span> · ${post.minutes}</div>
          </header>
          <div class="post-hero ${post.image ? '' : 'placeholder'}">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('placeholder');">` : ''}
          </div>
          <article class="post-body">
            ${post.body.map(p => `<p>${p}</p>`).join('')}
          </article>
        </div>
      </section>`;
  }

  function renderPrivacy(view) {
    view.innerHTML = `
      <section class="section">
        <h2>سياسة الخصوصية</h2>
        <p class="muted">نحترم خصوصيتك. نستخدم ملفات تعريف الارتباط لتخصيص المحتوى وتحليل الزيارات.</p>
      </section>`;
  }

  function renderWishlist(view) {
    const items = state.wishlist.map(findProduct).filter(Boolean);
    view.innerHTML = `
      <section class="section">
        <div class="section-header"><h2>المفضلة</h2></div>
        <div class="grid grid-4">${items.map(productCard).join('') || '<div class="muted">لا توجد عناصر بعد.</div>'}</div>
      </section>`;
    bindProductCardEvents(view);
  }

  // Bind actions for product cards and quick view
  function bindProductCardEvents(ctx=document) {
    $$('[data-add]', ctx).forEach(btn => btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add'))));
    $$('[data-qv]', ctx).forEach(btn => btn.addEventListener('click', () => openQuickView(btn.getAttribute('data-qv'))));
    $$('[data-wish]', ctx).forEach(btn => btn.addEventListener('click', () => { toggleWish(btn.getAttribute('data-wish')); router(); }));
  }

  // Quick View Modal
  function openQuickView(id) {
    const p = findProduct(id);
    if (!p) return;
    // track view
    state.views[id] = (state.views[id] || 0) + 1;
    storage.set('brava_views', state.views);

    $('#quickViewBody').innerHTML = quickViewMarkup(p);
    const modal = $('#quickView');
    modal.setAttribute('aria-hidden', 'false');
    // Bind inside modal
    bindProductCardEvents($('#quickViewBody'));
    $('[data-review]', modal).addEventListener('click', () => {
      const pid = id;
      const stars = parseInt($(`#stars-${pid}`).value, 10);
      const text = $(`#text-${pid}`).value.trim();
      if (!text) return toast('من فضلك اكتب تقييمًا');
      state.reviews[pid] = state.reviews[pid] || [];
      state.reviews[pid].push({ stars, text, ts: Date.now() });
      storage.set('brava_reviews', state.reviews);
      toast('تم نشر التقييم');
      openQuickView(pid); // re-render
    });
  }
  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => $('#quickView').setAttribute('aria-hidden', 'true')));

  // Drawer (Cart)
  $('#cartButton').addEventListener('click', () => openCart());
  $$('[data-close-drawer]').forEach(btn => btn.addEventListener('click', closeCart));
  function openCart() { $('#cartDrawer').setAttribute('aria-hidden', 'false'); updateCartUI(); }
  function closeCart() { $('#cartDrawer').setAttribute('aria-hidden', 'true'); }

  // Mobile menu
  const mobileNav = $('#mobileNav');
  const mobileBtn = $('#mobileMenuBtn');
  function openMobileNav() {
    mobileNav.setAttribute('aria-hidden', 'false');
    const icon = $('#mobileMenuBtn .icon');
    if (icon) icon.textContent = '✕';
  }
  function closeMobileNav() {
    mobileNav.setAttribute('aria-hidden', 'true');
    const icon = $('#mobileMenuBtn .icon');
    if (icon) icon.textContent = '≡';
  }
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileNav.getAttribute('aria-hidden') !== 'false';
      if (isHidden) openMobileNav(); else closeMobileNav();
    });
  }
  // close when navigating via mobile links or tel links
  $$('#mobileNav [data-route], #mobileNav a[href^="tel:"]').forEach(a => a.addEventListener('click', closeMobileNav));
  // close when pressing ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
  function updateCartUI() {
    $('#cartCount').textContent = String(cartCount());
    $('#cartItems').innerHTML = state.cart.map(i => {
      const p = findProduct(i.id);
      return `<div class="drawer-item">
        ${p?.images && p.images[0]
          ? `<img src="${p.images[0]}" alt="${p?.name || ''}" style="width:64px;height:64px;border-radius:10px;object-fit:cover;" loading="lazy" onerror="this.remove();">`
          : `<div class="placeholder" style="width:64px;height:64px;border-radius:10px;"></div>`}
        <div>
          <div><strong>${p.name}</strong></div>
          <div class="muted">${formatPrice(p.price)} · ${arabicColor(p.color)}</div>
          <div class="qty">
            <button data-dec="${p.id}">-</button>
            <span>${i.qty}</span>
            <button data-inc="${p.id}">+</button>
          </div>
        </div>
        <button class="btn btn-ghost" data-rem="${p.id}">إزالة</button>
      </div>`;
    }).join('') || '<div class="muted">سلتك فارغة.</div>';
    $('#cartTotal').textContent = `${formatPrice(cartTotal())}`;
    $('#loyaltyInfo').textContent = `اكسب 5% نقاط. الحالي: ${state.loyalty}`;
    $$('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.getAttribute('data-inc'), 1)));
    $$('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.getAttribute('data-dec'), -1)));
    $$('[data-rem]').forEach(b => b.addEventListener('click', () => removeFromCart(b.getAttribute('data-rem'))));
  }
  $('#checkoutBtn').addEventListener('click', () => {
    if (!state.cart.length) return toast('السلة فارغة');
    const total = cartTotal();
    accrueLoyalty(total);
    // Mock: Payment methods UI would go here; for now send WhatsApp confirmation
    const summary = state.cart.map(i => `${findProduct(i.id).name} ×${i.qty}`).join(', ');
    const link = `https://wa.me/972000000000?text=${encodeURIComponent(`طلب من BRAVA.PA: ${summary}. الإجمالي ${formatPrice(total)}`)}`;
    window.open(link, '_blank');
    state.cart = [];
    storage.set('brava_cart', state.cart);
    updateCartUI();
    toast('تم إرسال الطلب عبر واتساب');
    closeCart();
  });

  function updateHeaderCounts() {
    $('#cartCount').textContent = String(cartCount());
    $('#wishCount').textContent = String(state.wishlist.length);
  }

  // Countdown for promo
  function startCountdown(hours = 12) {
    const el = $('#promoCountdown');
    if (!el) return; // no promo element present
    const end = Date.now() + hours * 3600 * 1000;
    function tick() {
      const left = Math.max(0, end - Date.now());
      const h = Math.floor(left/3600000); const m = Math.floor((left%3600000)/60000); const s = Math.floor((left%60000)/1000);
      el.textContent = `ينتهي خلال ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (left <= 0) el.textContent = 'انتهى العرض';
    }
    tick();
    setInterval(tick, 1000);
  }

  // Theme toggle
  function applyTheme() { document.documentElement.setAttribute('data-theme', state.theme); $('#themeToggle .icon').textContent = state.theme === 'light' ? '🌙' : '☀️'; }
  $('#themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    storage.set('brava_theme', state.theme);
    applyTheme();
  });

  // GDPR banner
  function initGDPR() {
    const banner = $('#gdprBanner');
    if (state.consent) return; // already accepted
    banner.hidden = false;
    $('#gdprAccept').addEventListener('click', () => {
      state.consent = true;
      storage.set('brava_gdpr', true);
      banner.hidden = true;
    });
  }

  // Accessibility and minor inits
  function initHeaderYear() { $('#year').textContent = String(new Date().getFullYear()); }
  function initNav() { $$('[data-route]').forEach(a => a.addEventListener('click', () => setTimeout(router))); }

  // Lazy loading is native via loading=lazy; smooth scrolling via CSS

  // Boot
  window.addEventListener('hashchange', router);
  document.addEventListener('DOMContentLoaded', () => {
    attachImages();
    applyTheme();
    initGDPR();
    initHeaderYear();
    initNav();
    startCountdown(12);
    router();
  });
})();


