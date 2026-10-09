// ============================================================
// STYLESPHERE — CORE APP LOGIC v2.0
// ============================================================

// ---- STATE ----
let cart = JSON.parse(localStorage.getItem('ss_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('ss_wishlist') || '[]');
let orders = JSON.parse(localStorage.getItem('ss_orders') || '[]');
let recentViews = JSON.parse(localStorage.getItem('ss_recent') || '[]');
let currentPage = 'home';
let previousPage = 'home';
let currentDetailId = null;
let appliedCoupon = null;
let detailQty = 1;
let detailSelectedSize = null;
let searchQuery = '';

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderHomeProducts();
  renderRecentViews();
  applyFilters();
  renderWishlist();
  updateCounts();
  loadTheme();
  setupPaymentOptions();
  startFlashSaleTimer();
});

// ===========================
// NAVIGATION
// ===========================
function showPage(page, data) {
  // Auth guards
  if ((page === 'profile' || page === 'orders') && !currentUser) {
    showToast('Please login to view this page', 'warning');
    openAuth('login');
    return;
  }

  previousPage = currentPage;
  currentPage = page;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'wishlist') renderWishlist();
  if (page === 'orders') renderOrders();
  if (page === 'profile') populateProfileForm();
  if (page === 'checkout') renderCheckout();
  if (page === 'detail' && data) renderDetail(data);

  const nav = document.getElementById('nav');
  if (nav) nav.classList.remove('open');
}

function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}

// ===========================
// UTILS
// ===========================
function loadTheme() {
  if (localStorage.getItem('ss_theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeToggle').innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('themeToggle').innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem('ss_theme', isDark ? 'dark' : 'light');
}

function showToast(msg, type = 'info') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type]} toast-icon"></i><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => {
    toast.style.transform = 'translateX(100px)'; toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===========================
// FLASH SALE TIMER
// ===========================
function startFlashSaleTimer() {
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');
  
  // Set fixed 24h reset target for demo
  const targetDate = new Date();
  targetDate.setHours(23, 59, 59, 999);

  setInterval(() => {
    const now = new Date();
    const diff = targetDate - now;
    if (diff < 0) return;
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    cdH.textContent = h.toString().padStart(2, '0');
    cdM.textContent = m.toString().padStart(2, '0');
    cdS.textContent = s.toString().padStart(2, '0');
  }, 1000);
}

// ===========================
// PRODUCT CARD RENDER
// ===========================
function onImgLoad(id) {
  const skel = document.getElementById(`skel-${id}`);
  const emoji = document.getElementById(`emoji-${id}`);
  if (skel) skel.classList.add('done');
  if (emoji) emoji.classList.add('hidden');
}
function onImgError(id) {
  const skel = document.getElementById(`skel-${id}`);
  if (skel) skel.classList.add('done');
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars += '<i class="fa-solid fa-star"></i>';
    else if (rating >= i - 0.5) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    else stars += '<i class="fa-regular fa-star"></i>';
  }
  return stars;
}

function createProductCard(product, context = 'shop') {
  const isWished = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  
  const badges = [];
  if (product.badge === 'new' || product.isNew) badges.push('<span class="badge-pill badge-new">New</span>');
  if (product.badge === 'sale') badges.push('<span class="badge-pill badge-sale">Sale</span>');
  if (product.badge === 'hot') badges.push('<span class="badge-pill badge-hot">🔥 Hot</span>');

  const imgMarkup = product.image
    ? `<span class="product-emoji" id="emoji-${context}-${product.id}">${product.emoji}</span>
       <div class="img-skeleton" id="skel-${context}-${product.id}"></div>
       <img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy"
         onload="onImgLoad('${context}-${product.id}')" onerror="onImgError('${context}-${product.id}')" />`
    : `<span class="product-emoji">${product.emoji}</span>`;

  return `
    <div class="product-card" onclick="openDetail(${product.id})">
      <div class="product-image">
        ${imgMarkup}
        <div class="product-badges">${badges.join('')}</div>
        <button class="wish-btn ${isWished ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)">
          <i class="fa-${isWished ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <button class="quick-view-trigger" onclick="event.stopPropagation(); openQuickView(${product.id})">Quick View</button>
        ${!product.inStock ? '<div class="stock-warning">OUT OF STOCK</div>' : ''}
      </div>
      <div class="product-body">
        <div>
          <p class="product-category">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-stars">${renderStars(product.rating)} <span>(${product.reviews})</span></div>
        </div>
        <div>
          <div class="product-price">
            <span class="price-current">₹${product.price.toLocaleString()}</span>
            ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice.toLocaleString()}</span>` : ''}
            ${discount ? `<span class="price-discount">${discount}% off</span>` : ''}
          </div>
          <button class="product-add-btn" onclick="event.stopPropagation(); quickAddToCart(${product.id})" ${!product.inStock ? 'disabled style="opacity:0.5"' : ''}>
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

// ===========================
// HOME LAYOUT
// ===========================
function renderHomeProducts() {
  const trending = [...PRODUCTS].filter(p => p.badge === 'hot' || p.rating >= 4.8).slice(0, 8);
  const newArr = [...PRODUCTS].filter(p => p.isNew || p.badge === 'new').slice(0, 8);
  document.getElementById('featuredGrid').innerHTML = trending.map(p => createProductCard(p, 'feat')).join('');
  document.getElementById('newArrivalsGrid').innerHTML = newArr.map(p => createProductCard(p, 'new')).join('');
}

function setSearch(term) {
  document.getElementById('searchInput').value = term;
  handleSearch();
}
function handleSearch() {
  searchQuery = document.getElementById('searchInput').value.trim();
  showPage('shop');
  applyFilters();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement === document.getElementById('searchInput')) handleSearch();
});
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if(!email || !email.includes('@')) { showToast('Please enter a valid email','warning'); return; }
  showToast('Thanks for subscribing! Check your inbox for 15% off.', 'success');
  document.getElementById('newsletterEmail').value = '';
}

// ===========================
// SHOP FILTERS & SORT
// ===========================
function applyFilters() {
  const cat = document.querySelector('input[name="category"]:checked')?.value || 'All';
  const minP = parseFloat(document.getElementById('minPrice')?.value) || 0;
  const maxP = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
  const minR = parseFloat(document.querySelector('input[name="rating"]:checked')?.value) || 0;
  const minD = parseFloat(document.querySelector('input[name="discount"]:checked')?.value) || 0;
  const stock = document.getElementById('inStock')?.checked;
  const sort = document.getElementById('sortSelect')?.value || 'default';

  let filtered = PRODUCTS.filter(p => {
    if (cat !== 'All' && p.category !== cat) return false;
    if (p.price < minP || p.price > maxP) return false;
    if (p.rating < minR) return false;
    if (stock && !p.inStock) return false;
    
    const disc = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
    if (disc < minD) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q));
    }
    return true;
  });

  switch (sort) {
    case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
    case 'rating': filtered.sort((a,b) => b.rating - a.rating); break;
    case 'name-asc': filtered.sort((a,b) => a.name.localeCompare(b.name)); break;
    case 'newest': filtered.sort((a,b) => (b.isNew?1:0) - (a.isNew?1:0)); break;
    case 'discount': filtered.sort((a,b) => {
      const da = a.originalPrice ? (a.originalPrice-a.price)/a.originalPrice : 0;
      const db = b.originalPrice ? (b.originalPrice-b.price)/b.originalPrice : 0;
      return db - da;
    }); break;
  }

  const grid = document.getElementById('shopGrid');
  const noRes = document.getElementById('noResults');
  if (filtered.length === 0) {
    grid.innerHTML = '';
    noRes.classList.remove('hidden');
    document.getElementById('resultsCount').textContent = '0 products found';
  } else {
    noRes.classList.add('hidden');
    grid.innerHTML = filtered.map(p => createProductCard(p, 'shop')).join('');
    document.getElementById('resultsCount').textContent = `${filtered.length} product(s) found`;
  }
}
function clearFilters() {
  document.querySelector('input[name="category"][value="All"]').checked = true;
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  document.querySelector('input[name="discount"][value="0"]').checked = true;
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('inStock').checked = false;
  document.getElementById('sortSelect').value = 'default';
  document.getElementById('searchInput').value = '';
  searchQuery = '';
  applyFilters();
}
function filterByCategory(cat) { showPage('shop'); document.querySelector(`input[name="category"][value="${cat}"]`).checked = true; applyFilters(); }
function toggleFilterSidebar() { document.getElementById('filterSidebar').classList.toggle('open'); }
function setView(view) {
  document.getElementById('gridViewBtn').classList.toggle('active', view==='grid');
  document.getElementById('listViewBtn').classList.toggle('active', view==='list');
  document.getElementById('shopGrid').className = view === 'list' ? 'products-grid list-view' : 'products-grid';
}

// ===========================
// PRODUCT DETAIL & REVIEWS
// ===========================
function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentDetailId = id; detailQty = 1; detailSelectedSize = null;
  addToRecent(id);
  showPage('detail', p);
}

function addToRecent(id) {
  recentViews = recentViews.filter(x => x !== id);
  recentViews.unshift(id);
  if (recentViews.length > 5) recentViews.pop();
  localStorage.setItem('ss_recent', JSON.stringify(recentViews));
}
function renderRecentViews() {
  const section = document.getElementById('recentSection');
  const grid = document.getElementById('recentGrid');
  if (recentViews.length === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  const prods = recentViews.map(id => PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  grid.innerHTML = prods.map(p => createProductCard(p, 'recent')).join('');
}
function clearRecentlyViewed() {
  recentViews = []; localStorage.removeItem('ss_recent'); renderRecentViews();
}

function renderDetail(product) {
  const isWished = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  
  document.getElementById('detailBreadcrumb').innerHTML = `
    <a href="#" onclick="showPage('home')">Home</a> <i class="fa-solid fa-chevron-right"></i>
    <a href="#" onclick="filterByCategory('${product.category}')">${product.category}</a> <i class="fa-solid fa-chevron-right"></i>
    <span>${product.name}</span>`;

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-image">
      ${product.image ? `<img class="detail-photo" src="${product.image}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="display:none;font-size:8rem;position:absolute">${product.emoji}</span>` : `<span>${product.emoji}</span>`}
      ${!product.inStock ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:800;z-index:5">OUT OF STOCK</div>' : ''}
    </div>
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-stars">${renderStars(product.rating)} <span style="color:var(--text-muted);font-size:14px">(${product.reviews} reviews)</span></div>
      <div class="detail-price-area">
        <span class="detail-price">₹${product.price.toLocaleString()}</span>
        ${product.originalPrice ? `<span class="detail-original">₹${product.originalPrice.toLocaleString()}</span>` : ''}
        ${discount ? `<span class="detail-discount">${discount}% OFF</span>` : ''}
      </div>
      <p class="detail-description">${product.description}</p>
      
      <div class="size-selector">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h4>Size <span style="color:var(--text-muted);font-weight:400;font-size:13px" id="sizeLabel"></span></h4>
          <button class="size-guide-link" onclick="openSizeGuide()">Size Guide</button>
        </div>
        <div class="size-grid" id="sizeGrid">
          ${product.sizes.map(s => `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`).join('')}
        </div>
      </div>
      
      <div class="qty-selector">
        <h4>Quantity:</h4>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-display" id="qtyDisplay">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>
      
      <div class="detail-actions">
        <button class="btn btn-primary" onclick="addDetailToCart()" ${!product.inStock ? 'disabled style="opacity:0.5"' : ''}><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>
        <button class="btn btn-outline" onclick="toggleWishlist(${product.id}, this)"><i class="fa-${isWished?'solid':'regular'} fa-heart" ${isWished?'style="color:var(--error)"':''}></i> ${isWished?'Wishlisted':'Wishlist'}</button>
      </div>
      
      <div class="detail-features">
        ${product.features.map(f => `<div class="feature-item"><i class="fa-solid fa-circle-check"></i> ${f}</div>`).join('')}
        <div class="feature-item"><i class="fa-solid fa-truck"></i> Free Delivery over ₹999</div>
        <div class="feature-item"><i class="fa-solid fa-rotate-left"></i> 30-Day Easy Returns</div>
      </div>
    </div>`;

  renderReviews(product);
}

function renderReviews(product) {
  // Generate 3 random reviews
  const names = ['Aisha K.','Rahul S.','Priya M.','Karan D.','Neha V.','Vikram B.'];
  const comments = ['Excellent quality, fits perfectly!','Looks better in real life than the pictures.','Good value for money. highly recommended.','Delivery was super fast. Very happy.','Decent product, but sizing runs a bit small.'];
  let revHtml = '';
  for(let i=0; i<3; i++) {
    const rate = Math.floor(product.rating);
    revHtml += `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-avatar">${names[i%6].charAt(0)}</div>
          <div>
            <p class="reviewer-name">${names[(product.id+i)%6]} <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span></p>
            <p class="reviewer-date">2 days ago</p>
          </div>
        </div>
        <div class="review-stars">${renderStars(rate)}</div>
        <p class="review-text">${comments[(product.id+i)%5]}</p>
      </div>`;
  }
  
  document.getElementById('reviewsSection').innerHTML = `
    <h2>Customer Reviews</h2>
    <div class="reviews-meta">
      <div class="reviews-rating-big">${product.rating}</div>
      <div>
        <div style="color:var(--warning);font-size:18px">${renderStars(product.rating)}</div>
        <div style="color:var(--text-muted);font-size:14px">Based on ${product.reviews} reviews</div>
      </div>
    </div>
    <div class="reviews-grid">${revHtml}</div>
  `;
}

function selectSize(size, el) {
  detailSelectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('sizeLabel').textContent = `— ${size} selected`;
}
function changeQty(delta) {
  detailQty = Math.max(1, Math.min(10, detailQty + delta));
  document.getElementById('qtyDisplay').textContent = detailQty;
}
function addDetailToCart() {
  const p = PRODUCTS.find(x => x.id === currentDetailId);
  if (!p || !p.inStock) return;
  if (p.sizes.length > 1 && !detailSelectedSize) { showToast('Please select a size first!', 'warning'); return; }
  addToCart(p, detailSelectedSize || p.sizes[0], detailQty);
  openCart();
}

// ===========================
// QUICK VIEW MODAL
// ===========================
function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  const isWished = wishlist.includes(id);
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  
  document.getElementById('quickViewContent').innerHTML = `
    <div class="qv-image">
      ${p.image ? `<img src="${p.image}">` : `<span style="font-size:5rem">${p.emoji}</span>`}
    </div>
    <div class="qv-info">
      <div>
        <p class="qv-category">${p.category}</p>
        <h2 class="qv-name">${p.name}</h2>
        <div class="product-stars">${renderStars(p.rating)} <span style="color:var(--text-muted);font-size:13px">(${p.reviews})</span></div>
      </div>
      <div class="qv-price">
        <span class="price-current">₹${p.price.toLocaleString()}</span>
        ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice.toLocaleString()}</span>` : ''}
        ${discount ? `<span class="price-discount">${discount}% OFF</span>` : ''}
      </div>
      <p style="font-size:14px;color:var(--text-muted);line-height:1.6">${p.description}</p>
      
      <div class="qv-actions">
        <button class="btn btn-primary full-width" onclick="quickAddToCart(${p.id});closeQuickView()" ${!p.inStock?'disabled':''}>
          <i class="fa-solid fa-bag-shopping"></i> ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <button class="btn btn-outline full-width" onclick="openDetail(${p.id});closeQuickView()">View Full Details</button>
      </div>
    </div>
  `;
  document.getElementById('quickViewModal').classList.add('active');
}
function closeQuickView() { document.getElementById('quickViewModal').classList.remove('active'); }

// ===========================
// SIZE GUIDE MODAL
// ===========================
function openSizeGuide() {
  switchSgTab('men', document.querySelector('.sg-tab.active') || document.querySelectorAll('.sg-tab')[0]);
  document.getElementById('sizeGuideModal').classList.add('active');
}
function closeSizeGuide() { document.getElementById('sizeGuideModal').classList.remove('active'); }
function switchSgTab(cat, btn) {
  document.querySelectorAll('.sg-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  let table = '';
  if(cat==='men') table = `<tr><th>Size</th><th>Chest (in)</th><th>Waist (in)</th></tr><tr><td>S</td><td>36-38</td><td>29-31</td></tr><tr><td>M</td><td>39-41</td><td>32-34</td></tr><tr><td>L</td><td>42-44</td><td>35-37</td></tr><tr><td>XL</td><td>45-47</td><td>38-40</td></tr><tr><td>XXL</td><td>48-50</td><td>41-43</td></tr>`;
  if(cat==='women') table = `<tr><th>Size</th><th>Bust (in)</th><th>Waist (in)</th><th>Hips (in)</th></tr><tr><td>XS</td><td>32</td><td>24</td><td>34</td></tr><tr><td>S</td><td>34</td><td>26</td><td>36</td></tr><tr><td>M</td><td>36</td><td>28</td><td>38</td></tr><tr><td>L</td><td>39</td><td>31</td><td>41</td></tr><tr><td>XL</td><td>42</td><td>34</td><td>44</td></tr>`;
  if(cat==='kids') table = `<tr><th>Size</th><th>Age</th><th>Height (cm)</th></tr><tr><td>2Y</td><td>1-2 yrs</td><td>86-92</td></tr><tr><td>4Y</td><td>3-4 yrs</td><td>98-104</td></tr><tr><td>6Y</td><td>5-6 yrs</td><td>110-116</td></tr><tr><td>8Y</td><td>7-8 yrs</td><td>122-128</td></tr>`;
  document.getElementById('sizeGuideContent').innerHTML = `
    <table class="size-table">${table}</table>
    <div class="sg-note"><i class="fa-solid fa-circle-info"></i> Note: Measurements are approximate and may vary slightly by style or brand.</div>
  `;
}

// ===========================
// CART
// ===========================
function addToCart(p, size, qty=1) {
  const existing = cart.find(i => i.id === p.id && i.size === size);
  if (existing) existing.qty = Math.min(10, existing.qty + qty);
  else cart.push({ id: p.id, name: p.name, price: p.price, emoji: p.emoji, img: p.image, size, qty, category: p.category });
  saveCart(); updateCounts(); renderCartItems();
  showToast(`${p.name} added to cart!`, 'success');
}
function quickAddToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if(p && p.inStock) addToCart(p, p.sizes[0], 1);
}
function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  saveCart(); updateCounts(); renderCartItems();
}
function updateCartQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) { item.qty = Math.max(1, Math.min(10, item.qty + delta)); saveCart(); updateCounts(); renderCartItems(); }
}
function saveCart() { localStorage.setItem('ss_cart', JSON.stringify(cart)); }
function openCart() { renderCartItems(); document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').classList.add('active'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').classList.remove('active'); }
function handleOverlayClick() {
  closeCart();
  closeQuickView();
  closeSizeGuide();
  closeAuth();
}

function renderCartItems() {
  const body = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (cart.length === 0) {
    body.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h3>Your cart is empty</h3><button class="btn btn-primary" onclick="closeCart();showPage('shop')" style="margin-top:16px">Shop Now</button></div>`;
    footer.innerHTML = ''; return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.img ? `<img src="${item.img}">` : `<div class="ci-emoji">${item.emoji}</div>`}</div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">Size: ${item.size} | ${item.category}</p>
        <div class="cart-item-actions">
          <div class="cart-item-controls">
            <button class="ci-btn" onclick="updateCartQty(${item.id},'${item.size}',-1)">−</button>
            <span class="ci-qty">${item.qty}</span>
            <button class="ci-btn" onclick="updateCartQty(${item.id},'${item.size}',1)">+</button>
          </div>
          <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
          <button class="remove-item" onclick="removeFromCart(${item.id},'${item.size}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    </div>`).join('');
    
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = subtotal >= 999 ? 0 : 99;
  
  footer.innerHTML = `
    <div class="cart-totals">
      <div class="total-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div class="total-row"><span>Shipping</span><span>${shipping===0?'<span style="color:var(--success)">FREE (over ₹999)</span>':'₹'+shipping}</span></div>
      <div class="total-row grand"><span>Total</span><span>₹${(subtotal+shipping).toLocaleString()}</span></div>
    </div>
    <button class="btn btn-primary full-width" onclick="closeCart(); showPage('checkout')">Proceed to Checkout</button>
  `;
}

// ===========================
// WISHLIST & ORDERS
// ===========================
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) { wishlist = wishlist.filter(w => w !== id); showToast('Removed from wishlist', 'info'); }
  else { wishlist.push(id); showToast('Added to wishlist ❤️', 'success'); }
  localStorage.setItem('ss_wishlist', JSON.stringify(wishlist));
  updateCounts();
  if (btn) {
    const isW = wishlist.includes(id);
    btn.classList.toggle('active', isW);
    btn.innerHTML = `<i class="fa-${isW?'solid':'regular'} fa-heart"></i> ${btn.textContent.includes('Wishlist') ? (isW?'Wishlisted':'Wishlist') : ''}`;
  }
  if (currentPage === 'wishlist') renderWishlist();
}
function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('emptyWishlist');
  const w = PRODUCTS.filter(p => wishlist.includes(p.id));
  if (w.length === 0) { grid.innerHTML = ''; empty.classList.remove('hidden'); }
  else { empty.classList.add('hidden'); grid.innerHTML = w.map(p => createProductCard(p, 'wishlist')).join(''); }
}
function renderOrders() {
  const list = document.getElementById('ordersList');
  const empty = document.getElementById('emptyOrders');
  // Filter orders by user email if logged in
  const userOrders = currentUser ? orders.filter(o => o.userEmail === currentUser.email) : orders;

  if (userOrders.length === 0) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  
  const sorted = [...userOrders].reverse();
  list.innerHTML = sorted.map(o => `
    <div class="order-card">
      <div class="order-header">
        <div><p class="order-id"># ${o.id}</p><p class="order-date">${o.date}</p></div>
        <span class="order-status status-${o.status.toLowerCase()}">${o.status}</span>
      </div>
      <div class="order-body">
        <div class="order-items-preview">
          ${o.items.map(i => `<div class="order-item-chip"><span>${i.emoji}</span><span>${i.name}</span><span style="color:var(--text-muted)">×${i.qty}</span></div>`).join('')}
        </div>
      </div>
      <div class="order-footer">
        <div>
          <p style="font-size:13px;color:var(--text-muted)">Payment: ${o.payment}</p>
          <p style="font-size:13px;color:var(--text-muted)">Deliver to: ${o.address.city}</p>
        </div>
        <div class="order-total">₹${o.total.toLocaleString()}</div>
      </div>
    </div>`).join('');
}

function updateCounts() {
  const c = cart.reduce((s,i)=>s+i.qty,0);
  const wc = document.getElementById('wishlistCount');
  const cc = document.getElementById('cartCount');
  cc.textContent = c; cc.classList.toggle('hidden', c===0);
  wc.textContent = wishlist.length; wc.classList.toggle('hidden', wishlist.length===0);
}

// ===========================
// PROFILE PAGE
// ===========================
function populateProfileForm() {
  if (!currentUser) return;
  
  // Sidebar
  const initials = currentUser.firstName.charAt(0) + (currentUser.lastName ? currentUser.lastName.charAt(0) : '');
  document.getElementById('profileAvatarLarge').textContent = initials.toUpperCase();
  document.getElementById('profileNameLarge').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById('profileEmailLarge').textContent = currentUser.email;
  
  // Stats
  const userOrders = orders.filter(o => o.userEmail === currentUser.email).length;
  document.getElementById('pStatOrders').textContent = userOrders;
  document.getElementById('pStatWish').textContent = wishlist.length;
  
  // Form fields
  document.getElementById('pf-first').value = currentUser.firstName || '';
  document.getElementById('pf-last').value = currentUser.lastName || '';
  document.getElementById('pf-email').value = currentUser.email || '';
  document.getElementById('pf-phone').value = currentUser.phone || '';
  
  if (currentUser.address) {
    document.getElementById('pf-address').value = currentUser.address.street || '';
    document.getElementById('pf-city').value = currentUser.address.city || '';
    document.getElementById('pf-pin').value = currentUser.address.pin || '';
    document.getElementById('pf-state').value = currentUser.address.state || '';
  }
}

function saveProfile() {
  const f = document.getElementById('pf-first').value.trim();
  const l = document.getElementById('pf-last').value.trim();
  const p = document.getElementById('pf-phone').value.trim();
  if(!f) { showToast('First name is required','error'); return; }
  
  currentUser.firstName = f;
  currentUser.lastName = l;
  currentUser.phone = p;
  
  // update users array
  const uidx = users.findIndex(u => u.email === currentUser.email);
  if(uidx > -1) users[uidx] = currentUser;
  
  localStorage.setItem('ss_currentUser', JSON.stringify(currentUser));
  localStorage.setItem('ss_users', JSON.stringify(users));
  updateAuthUI();
  populateProfileForm();
  showToast('Profile updated!','success');
}

function saveAddress() {
  const st = document.getElementById('pf-address').value.trim();
  const ci = document.getElementById('pf-city').value.trim();
  const pi = document.getElementById('pf-pin').value.trim();
  const sa = document.getElementById('pf-state').value.trim();
  
  if(!currentUser.address) currentUser.address = {};
  currentUser.address.street = st;
  currentUser.address.city = ci;
  currentUser.address.pin = pi;
  currentUser.address.state = sa;
  
  const uidx = users.findIndex(u => u.email === currentUser.email);
  if(uidx > -1) users[uidx] = currentUser;
  
  localStorage.setItem('ss_currentUser', JSON.stringify(currentUser));
  localStorage.setItem('ss_users', JSON.stringify(users));
  showToast('Address saved successfully!','success');
}


// ===========================
// CHECKOUT
// ===========================
function setupPaymentOptions() {
  document.querySelectorAll('.payment-opt').forEach(o => {
    o.addEventListener('click', () => { document.querySelectorAll('.payment-opt').forEach(x => x.classList.remove('selected')); o.classList.add('selected'); });
  });
}
function autofillCoupon(code) { document.getElementById('couponInput').value = code; applyCoupon(); }
function applyCoupon() {
  const c = document.getElementById('couponInput').value.trim().toUpperCase();
  const m = document.getElementById('couponMsg');
  if(!c) { m.textContent = 'Enter a code.'; m.className = 'coupon-msg error'; return; }
  if(COUPONS[c]) {
    appliedCoupon = { code: c, ...COUPONS[c] };
    m.textContent = `🎉 Coupon applied: ${appliedCoupon.label}`; m.className = 'coupon-msg success';
    updatePriceSummary(); showToast(`Applied ${c}`, 'success');
  } else {
    appliedCoupon = null; m.textContent = '❌ Invalid code.'; m.className = 'coupon-msg error'; updatePriceSummary();
  }
}
function updatePriceSummary() {
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  let ship = sub >= 999 ? 0 : 99;
  let disc = 0; let freeShip = false;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') disc = Math.round(sub * appliedCoupon.discount / 100);
    else if (appliedCoupon.type === 'flat') disc = Math.min(appliedCoupon.discount, sub);
    else if (appliedCoupon.type === 'shipping') freeShip = true;
  }
  const finalShip = freeShip ? 0 : ship;
  const total = sub - disc + finalShip;
  document.getElementById('priceSummary').innerHTML = `
    <div class="p-row"><span>Subtotal</span><span>₹${sub.toLocaleString()}</span></div>
    <div class="p-row"><span>Shipping</span><span>${finalShip===0?'<span style="color:var(--success)">FREE</span>':'₹'+finalShip}</span></div>
    ${disc ? `<div class="p-row discount"><span>Discount (${appliedCoupon.code})</span><span>−₹${disc.toLocaleString()}</span></div>` : ''}
    <div class="p-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>`;
}

function renderCheckout() {
  appliedCoupon = null; document.getElementById('couponInput').value = ''; document.getElementById('couponMsg').textContent = '';
  const items = document.getElementById('checkoutItems');
  if (cart.length === 0) items.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Cart is empty.</p>';
  else items.innerHTML = cart.map(i => `
    <div class="checkout-item">
      <div class="checkout-item-img">${i.img?`<img src="${i.img}">`:`<div class="ci-emoji">${i.emoji}</div>`}</div>
      <div style="flex:1;min-width:0">
        <p class="checkout-item-name">${i.name}</p>
        <p class="checkout-item-meta">Size: ${i.size} | Qty: ${i.qty}</p>
        <p class="checkout-item-price">₹${(i.price*i.qty).toLocaleString()}</p>
      </div>
    </div>`).join('');
  
  // Pre-fill fields if logged in
  if (currentUser) {
    document.getElementById('co-name').value = `${currentUser.firstName} ${currentUser.lastName}`.trim();
    document.getElementById('co-email').value = currentUser.email || '';
    document.getElementById('co-phone').value = currentUser.phone || '';
    if (currentUser.address) {
      document.getElementById('co-address').value = currentUser.address.street || '';
      document.getElementById('co-city').value = currentUser.address.city || '';
      document.getElementById('co-pin').value = currentUser.address.pin || '';
      document.getElementById('co-state').value = currentUser.address.state || '';
    }
  } else {
    // Clear fields
    ['co-name','co-email','co-phone','co-address','co-city','co-pin','co-state'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }
  
  updatePriceSummary();
}

function placeOrder() {
  if (cart.length === 0) { showToast('Cart is empty!','error'); return; }
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const city = document.getElementById('co-city').value.trim();
  const pin = document.getElementById('co-pin').value.trim();
  const state = document.getElementById('co-state').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'UPI';

  if(!name||!phone||!email||!address||!city||!pin||!state) { showToast('Fill all details!','warning'); return; }
  
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship = sub >= 999 ? 0 : 99;
  let disc = 0; let freeShip = false;
  if (appliedCoupon) {
    if(appliedCoupon.type==='percent') disc = Math.round(sub*appliedCoupon.discount/100);
    else if(appliedCoupon.type==='flat') disc = Math.min(appliedCoupon.discount,sub);
    else if(appliedCoupon.type==='shipping') freeShip = true;
  }
  const total = sub - disc + (freeShip ? 0 : ship);
  const id = 'SS' + Date.now().toString().slice(-8);

  orders.push({
    id, date: new Date().toLocaleDateString('en-IN', {year:'numeric',month:'long',day:'numeric'}),
    items: [...cart], total, payment: payment.toUpperCase(), status: 'Processing',
    address: { name, phone, email, address, city, pin, state }, coupon: appliedCoupon?.code||null,
    userEmail: currentUser ? currentUser.email : 'guest'
  });
  localStorage.setItem('ss_orders', JSON.stringify(orders));

  cart = []; saveCart(); updateCounts(); appliedCoupon = null;
  document.getElementById('successOrderId').textContent = `Order ID: ${id}`;
  document.getElementById('successModal').classList.add('active');
}
function closeSuccessModal() { document.getElementById('successModal').classList.remove('active'); showPage('shop'); }
function viewOrders() { document.getElementById('successModal').classList.remove('active'); showPage('orders'); }
