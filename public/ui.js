/* ============================================================
   GENTX — Shared UI (ui.js)
   Injects header, cart drawer, toast into every page
   ============================================================ */

const GentXUI = (() => {

  // ── Shared CSS injected once ─────────────────────────────
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
    :root{--red:#e00000;--red-dark:#b80000;--black:#111;--white:#fff;--gray:#f5f5f5;--gray-mid:#e8e8e8;--text-muted:#666;--radius:2px;--transition:0.3s cubic-bezier(.4,0,.2,1);--shadow:0 12px 40px rgba(0,0,0,.12);}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{font-family:'Barlow',sans-serif;background:#fff;color:#111;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    a{text-decoration:none;color:inherit;}img{display:block;width:100%;}button{cursor:pointer;font-family:inherit;border:none;}
    input,select,textarea{font-family:inherit;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#f0f0f0;}::-webkit-scrollbar-thumb{background:var(--red);border-radius:3px;}
    /* ANNOUNCE */
    .gx-announce{background:var(--red);color:#fff;text-align:center;padding:10px 20px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;position:relative;overflow:hidden;}
    .gx-announce::before{content:'';position:absolute;top:0;left:-100%;width:60px;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);animation:gx-shimmer 3s infinite;}
    @keyframes gx-shimmer{to{left:200%;}}
    /* HEADER */
    .gx-header{position:sticky;top:0;z-index:900;background:#fff;border-bottom:2px solid #111;box-shadow:0 2px 20px rgba(0,0,0,.08);}
    .gx-header-top{max-width:1400px;margin:0 auto;padding:0 32px;height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
    .gx-logo{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;letter-spacing:.05em;color:var(--black);line-height:1;flex-shrink:0;}
    .gx-logo span{color:var(--red);}
    .gx-search{display:flex;align-items:center;border:2px solid var(--black);border-radius:40px;overflow:hidden;flex:1;max-width:320px;transition:border-color var(--transition);}
    .gx-search:focus-within{border-color:var(--red);}
    .gx-search input{flex:1;border:none;outline:none;padding:8px 16px;font-size:13px;background:transparent;min-width:0;}
    .gx-search button{background:var(--black);color:#fff;padding:8px 16px;font-size:13px;font-weight:600;white-space:nowrap;transition:background var(--transition);}
    .gx-search button:hover{background:var(--red);}
    .gx-header-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
    .gx-cart-btn{background:var(--red);color:#fff;padding:10px 22px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border-radius:40px;transition:all var(--transition);display:flex;align-items:center;gap:8px;}
    .gx-cart-btn:hover{background:var(--red-dark);box-shadow:0 0 20px rgba(220,0,0,.4);transform:scale(1.04);}
    .gx-cart-badge{background:#fff;color:var(--red);width:20px;height:20px;border-radius:50%;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all .2s;}
    .gx-cart-badge.show{opacity:1;transform:scale(1);}
    /* NAV */
    .gx-nav{background:#f4f4f4;border-top:1px solid var(--gray-mid);}
    .gx-nav-inner{max-width:1400px;margin:0 auto;padding:0 32px;height:50px;display:flex;align-items:center;justify-content:space-between;}
    .gx-nav ul{list-style:none;display:flex;gap:2px;}
    .gx-nav ul li a{display:block;padding:6px 13px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#333;border-radius:2px;transition:color var(--transition);position:relative;}
    .gx-nav ul li a::after{content:'';position:absolute;bottom:2px;left:13px;right:13px;height:2px;background:var(--red);transform:scaleX(0);transition:transform var(--transition);}
    .gx-nav ul li a:hover,.gx-nav ul li a.active{color:var(--red);}
    .gx-nav ul li a:hover::after,.gx-nav ul li a.active::after{transform:scaleX(1);}
    .gx-hamburger{display:none;font-size:26px;background:none;color:var(--black);padding:4px 8px;border-radius:2px;}
    /* Mobile nav */
    .gx-mobile-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);opacity:0;visibility:hidden;transition:.3s;z-index:998;}
    .gx-mobile-overlay.active{opacity:1;visibility:visible;}
    @media(max-width:900px){
      .gx-search{display:none;}
      .gx-hamburger{display:flex;align-items:center;justify-content:center;}
      .gx-nav ul{position:fixed;top:0;left:-290px;width:270px;height:100vh;background:#fff;flex-direction:column;padding:80px 25px 40px;gap:2px;transition:left .4s ease;z-index:999;box-shadow:5px 0 30px rgba(0,0,0,.15);border-right:3px solid var(--red);}
      .gx-nav ul.open{left:0;}
      .gx-nav ul li a{font-size:17px;padding:11px 4px;}
    }
    @media(max-width:600px){
      .gx-header-top{padding:0 12px;}
      .gx-logo{font-size:26px;}
      .gx-cart-btn{padding:8px 14px;font-size:12px;}
      .gx-cart-btn span{display:none;}
      .gx-user-btn-wrap{display:none;}
      .gx-admin-btn{display:none;}
    }
    /* PAGE HEADER */
    .gx-page-header{background:var(--black);padding:44px 32px;text-align:center;}
    .gx-page-header h1{font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#fff;line-height:1;}
    .gx-page-header h1 span{color:var(--red);}
    .gx-breadcrumb{margin-top:10px;font-size:13px;color:#888;}
    .gx-breadcrumb a{color:#aaa;transition:color var(--transition);}
    .gx-breadcrumb a:hover{color:var(--red);}
    /* SECTION */
    .gx-sec{padding:72px 32px;}
    .gx-sec.bg-gray{background:var(--gray);}
    .gx-inner{max-width:1400px;margin:0 auto;}
    .gx-sec-hd{text-align:center;margin-bottom:48px;}
    .gx-eyebrow{display:inline-block;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--red);background:rgba(220,0,0,.07);padding:4px 14px;border-radius:2px;margin-bottom:8px;}
    .gx-sec-hd h2{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;line-height:1;}
    .gx-divider{width:48px;height:4px;background:var(--red);margin:12px auto 0;}
    /* PRODUCT GRID */
    .gx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;}
    .gx-grid.cols-3{grid-template-columns:repeat(3,1fr);}
    .gx-grid.cols-4{grid-template-columns:repeat(4,1fr);}
    /* PRODUCT CARD */
    .gx-card{background:#fff;border:1px solid transparent;border-radius:2px;overflow:hidden;cursor:pointer;transition:all var(--transition);}
    .gx-card:hover{transform:translateY(-6px);box-shadow:var(--shadow);border-color:var(--red);}
    .gx-card-img{position:relative;overflow:hidden;aspect-ratio:3/4;background:var(--gray);display:flex;align-items:center;justify-content:center;font-size:80px;}
    .gx-card-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s ease;}
    .gx-card:hover .gx-card-img img{transform:scale(1.07);}
    .gx-card:hover .gx-card-real-img{transform:scale(1.07);}
    .gx-card-emoji{font-size:80px;transition:transform .55s ease;}
    .gx-card:hover .gx-card-emoji{transform:scale(1.06);}
    .gx-quick{position:absolute;bottom:-50px;left:0;right:0;background:var(--red);color:#fff;text-align:center;padding:13px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:bottom var(--transition);}
    .gx-card:hover .gx-quick{bottom:0;}
    .gx-badge{position:absolute;top:10px;left:10px;background:var(--red);color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:800;letter-spacing:.1em;padding:3px 8px;text-transform:uppercase;}
    .gx-badge.b-new{background:#111;}
    .gx-badge.b-hot{background:#e05500;}
    .gx-card-info{padding:14px 16px 18px;}
    .gx-card-brand{font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#bbb;margin-bottom:2px;}
    .gx-card-name{font-size:14px;font-weight:600;color:var(--black);margin-bottom:6px;line-height:1.3;}
    .gx-card-price{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:var(--red);}
    .gx-card-old{font-size:12px;color:#bbb;text-decoration:line-through;margin-left:6px;}
    /* CART DRAWER */
    .gx-cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2000;opacity:0;pointer-events:none;transition:opacity var(--transition);}
    .gx-cart-backdrop.open{opacity:1;pointer-events:all;}
    .gx-cart-drawer{position:fixed;top:0;right:0;width:400px;max-width:95vw;height:100vh;background:#fff;z-index:2001;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);box-shadow:-10px 0 50px rgba(0,0,0,.2);}
    .gx-cart-drawer.open{transform:translateX(0);}
    .gx-cd-head{padding:20px 24px;border-bottom:2px solid #111;display:flex;align-items:center;justify-content:space-between;}
    .gx-cd-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;}
    .gx-cd-close{width:36px;height:36px;background:var(--gray);border:1px solid var(--gray-mid);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#666;transition:all var(--transition);}
    .gx-cd-close:hover{background:var(--red);color:#fff;border-color:var(--red);}
    .gx-cd-items{flex:1;overflow-y:auto;padding:14px 24px;}
    .gx-cd-empty{text-align:center;padding:60px 20px;color:#ccc;}
    .gx-cd-empty-icon{font-size:52px;margin-bottom:14px;}
    .gx-cd-empty p{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}
    .gx-cd-item{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #f0f0f0;animation:gx-up .3s ease;}
    .gx-cd-thumb{width:68px;height:85px;background:var(--gray);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;overflow:hidden;}
    .gx-cd-thumb img{width:100%;height:100%;object-fit:cover;}
    .gx-cd-info{flex:1;min-width:0;}
    .gx-cd-name{font-size:13px;font-weight:600;margin-bottom:2px;line-height:1.3;}
    .gx-cd-meta{font-size:11px;color:#aaa;margin-bottom:6px;}
    .gx-cd-price{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:var(--red);margin-bottom:8px;}
    .gx-qty{display:flex;align-items:center;border:1px solid var(--gray-mid);border-radius:2px;width:fit-content;overflow:hidden;}
    .gx-qty-btn{width:28px;height:28px;background:var(--gray);font-size:15px;display:flex;align-items:center;justify-content:center;transition:all var(--transition);}
    .gx-qty-btn:hover{background:var(--red);color:#fff;}
    .gx-qty-val{width:32px;text-align:center;font-size:13px;font-weight:600;border-left:1px solid var(--gray-mid);border-right:1px solid var(--gray-mid);padding:4px 0;}
    .gx-cd-rem{color:#ccc;font-size:16px;background:none;padding:4px;align-self:flex-start;transition:color var(--transition);}
    .gx-cd-rem:hover{color:var(--red);}
    .gx-cd-foot{padding:16px 24px 24px;border-top:2px solid #111;display:none;}
    .gx-cd-sub{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
    .gx-cd-sub span:first-child{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;}
    .gx-cd-sub span:last-child{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:var(--red);}
    .gx-cd-note{font-size:11px;color:#aaa;margin-bottom:14px;}
    .gx-cd-checkout{display:block;width:100%;background:var(--red);color:#fff;padding:14px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;text-align:center;border-radius:2px;transition:all var(--transition);margin-bottom:10px;}
    .gx-cd-checkout:hover{background:var(--red-dark);transform:translateY(-1px);}
    .gx-cd-cont{display:block;text-align:center;font-size:13px;color:#aaa;transition:color var(--transition);}
    .gx-cd-cont:hover{color:var(--red);}
    /* TOAST */
    .gx-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:var(--black);color:#fff;padding:12px 24px;border-radius:2px;border-left:4px solid var(--red);font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;z-index:3000;opacity:0;pointer-events:none;transition:all .3s;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,.4);}
    .gx-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
    /* BTN */
    .gx-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all var(--transition);cursor:pointer;border:none;}
    .gx-btn.primary{background:var(--red);color:#fff;}
    .gx-btn.primary:hover{background:var(--red-dark);transform:translateY(-2px);box-shadow:0 6px 20px rgba(220,0,0,.3);}
    .gx-btn.dark{background:var(--black);color:#fff;}
    .gx-btn.dark:hover{background:#333;transform:translateY(-2px);}
    .gx-btn.outline{background:none;color:var(--black);border:2px solid var(--black);}
    .gx-btn.outline:hover{border-color:var(--red);color:var(--red);}
    /* FOOTER */
    .gx-footer{background:#111;color:#fff;padding-top:64px;}
    .gx-footer-grid{max-width:1400px;margin:0 auto;padding:0 32px 56px;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:56px;}
    .gx-flogo{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:900;margin-bottom:12px;line-height:1;}
    .gx-flogo span{color:var(--red);}
    .gx-ftxt{font-size:13px;color:#aaa;line-height:1.7;max-width:260px;}
    .gx-fsocials{display:flex;gap:8px;margin-top:20px;}
    .gx-fsoc{width:36px;height:36px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#aaa;transition:all var(--transition);}
    .gx-fsoc:hover{background:var(--red);border-color:var(--red);color:#fff;}
    .gx-fcol-t{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#fff;margin-bottom:18px;padding-bottom:8px;border-bottom:2px solid var(--red);display:inline-block;}
    .gx-flinks{list-style:none;}
    .gx-flinks li{margin-bottom:9px;}
    .gx-flinks a{font-size:13px;color:#aaa;transition:all var(--transition);}
    .gx-flinks a:hover{color:#fff;padding-left:4px;}
    .gx-fnews{display:flex;margin-top:12px;border:1px solid rgba(255,255,255,.15);border-radius:2px;overflow:hidden;}
    .gx-fnews input{flex:1;background:rgba(255,255,255,.05);border:none;outline:none;padding:10px 12px;font-size:13px;color:#fff;}
    .gx-fnews input::placeholder{color:#555;}
    .gx-fnews button{background:var(--red);color:#fff;padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:background var(--transition);}
    .gx-fnews button:hover{background:var(--red-dark);}
    .gx-fbot{border-top:1px solid #222;padding:16px 32px;max-width:none;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#666;}
    .gx-fleg{display:flex;gap:20px;}
    .gx-fleg a{color:#666;transition:color var(--transition);}
    .gx-fleg a:hover{color:var(--red);}
    @keyframes gx-up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    @media(max-width:1000px){.gx-footer-grid{grid-template-columns:1fr 1fr;gap:40px;}}
    @media(max-width:600px){
      .gx-footer-grid{padding:0 16px 40px;grid-template-columns:1fr 1fr;}
      .gx-fbot{padding:14px 16px;flex-direction:column;gap:8px;text-align:center;}
      .gx-sec{padding:40px 16px;}
      .gx-page-header{padding:28px 16px;}
      .gx-page-header h1{font-size:32px;}
      .gx-sec-hd h2{font-size:30px;}
    }
    @media(max-width:400px){
      .gx-footer-grid{grid-template-columns:1fr;}
      .gx-grid{grid-template-columns:1fr 1fr;gap:10px;}
    }
    @media(max-width:768px){.gx-grid.cols-3,.gx-grid.cols-4{grid-template-columns:1fr 1fr;}}
    @media(max-width:480px){
      .gx-grid{grid-template-columns:1fr 1fr;gap:10px;}
      .gx-card-name{font-size:13px;}
      .gx-card-price{font-size:16px;}
      .gx-card-info{padding:10px;}
    }
  `;

  function injectCSS() {
    if (document.getElementById('gx-shared-css')) return;
    const s = document.createElement('style');
    s.id = 'gx-shared-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  async function renderAnnounce() {
    const s = await GentXDB.getSettings();
    return `<div class="gx-announce">${s.announcement || s.announcementText || '🔥 FLASH SALE — 50% OFF SITEWIDE'}</div>`;
  }

  async function renderHeader(activePage) {
    const cats = (await GentXDB.getCategories()).filter(c => c.active);
    const catLinks = cats.map(c =>
      `<li><a href="${c.slug}.html" class="${activePage===c.slug?'active':''}">${c.name}</a></li>`
    ).join('');
    return `
      <header class="gx-header">
        <div class="gx-header-top">
          <a href="index.html" class="gx-logo">GENT<span>X</span></a>
          <div class="gx-search">
            <input type="text" id="gx-search-input" placeholder="Search products...">
            <button onclick="GentXUI.handleSearch()">🔍</button>
          </div>
          <div class="gx-header-actions">
            <a href="admin.html" style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;color:#888;text-transform:uppercase;padding:6px 10px;border:1px solid #ddd;border-radius:2px;transition:all .2s;" 
               onmouseover="this.style.borderColor='#e00';this.style.color='#e00'" onmouseout="this.style.borderColor='#ddd';this.style.color='#888'">Admin</a>
            <div id="gx-user-btn-wrap"></div>
            <button class="gx-cart-btn" onclick="GentXUI.toggleCart()">
              🛒 CART <span class="gx-cart-badge" id="gx-cart-badge">0</span>
            </button>
          </div>
        </div>
        <nav class="gx-nav">
          <div class="gx-nav-inner">
            <button class="gx-hamburger" onclick="GentXUI.toggleMobileNav()">☰</button>
            <div class="gx-mobile-overlay" id="gx-mob-overlay" onclick="GentXUI.closeMobileNav()"></div>
            <ul id="gx-nav-links">
              <li><a href="index.html" class="${activePage==='home'?'active':''}">Home</a></li>
              <li><a href="shop.html" class="${activePage==='shop'?'active':''}">All Products</a></li>
              ${catLinks}
              <li><a href="contact.html" class="${activePage==='contact'?'active':''}">Contact</a></li>
              <li><a href="cart.html" class="${activePage==='cart'?'active':''}">Cart 🛒</a></li>
            </ul>
          </div>
        </nav>
      </header>
    `;
  }

  function renderCartDrawer() {
    return `
      <div class="gx-cart-backdrop" id="gx-cart-backdrop" onclick="GentXUI.toggleCart()"></div>
      <div class="gx-cart-drawer" id="gx-cart-drawer">
        <div class="gx-cd-head">
          <div class="gx-cd-title">🛒 Your Cart</div>
          <button class="gx-cd-close" onclick="GentXUI.toggleCart()">✕</button>
        </div>
        <div class="gx-cd-items" id="gx-cd-items">
          <div class="gx-cd-empty"><div class="gx-cd-empty-icon">🛍️</div><p>Cart is empty</p></div>
        </div>
        <div class="gx-cd-foot" id="gx-cd-foot">
          <div class="gx-cd-sub"><span>Subtotal</span><span id="gx-cd-total">PKR 0</span></div>
          <p class="gx-cd-note">✓ Free shipping included</p>
          <a href="cart.html" class="gx-cd-checkout">Proceed to Checkout →</a>
          <a href="#" class="gx-cd-cont" onclick="GentXUI.toggleCart();return false;">← Continue Shopping</a>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <footer class="gx-footer">
        <div class="gx-footer-grid">
          <div>
            <div class="gx-flogo">GENT<span>X</span></div>
            <p class="gx-ftxt">Modern fashion for confident men. GENTX blends minimal aesthetics with premium quality to create timeless everyday wear.</p>
            <div class="gx-fsocials">
              <a class="gx-fsoc" href="#">FB</a>
              <a class="gx-fsoc" href="#">IG</a>
              <a class="gx-fsoc" href="#">TW</a>
              <a class="gx-fsoc" href="#">TK</a>
            </div>
          </div>
          <div>
            <div class="gx-fcol-t">Quick Links</div>
            <ul class="gx-flinks">
              <li><a href="index.html">Home</a></li>
              <li><a href="shop.html">Shop</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="cart.html">Cart</a></li>
            </ul>
          </div>
          <div>
            <div class="gx-fcol-t">Categories</div>
            <ul class="gx-flinks" id="gx-footer-cats"></ul>
          </div>
          <div>
            <div class="gx-fcol-t">Subscribe</div>
            <p class="gx-ftxt">Get updates about new arrivals & exclusive offers.</p>
            <div class="gx-fnews">
              <input type="email" id="gx-news-email" placeholder="Your email">
              <button onclick="GentXUI.subscribe()">JOIN</button>
            </div>
          </div>
        </div>
        <div class="gx-fbot">
          <p>© 2026 GENTX. All Rights Reserved.</p>
          <div class="gx-fleg">
            <a href="privacy.html">Privacy Policy</a>
            <a href="terms.html">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    `;
  }

  function renderToast() {
    return `<div class="gx-toast" id="gx-toast"></div>`;
  }

  // ── Cart UI ──────────────────────────────────────────────
  function updateCartUI() {
    const count = GentXDB.getCartCount();
    const badge = document.getElementById('gx-cart-badge');
    if (badge) { badge.textContent = count; badge.classList.toggle('show', count > 0); }

    const items = document.getElementById('gx-cd-items');
    const foot  = document.getElementById('gx-cd-foot');
    if (!items) return;

    const cart = GentXDB.getCart();
    if (!cart.length) {
      items.innerHTML = `<div class="gx-cd-empty"><div class="gx-cd-empty-icon">🛍️</div><p>Cart is empty</p></div>`;
      if (foot) foot.style.display = 'none';
      return;
    }
    items.innerHTML = cart.map(c => `
      <div class="gx-cd-item">
        <div class="gx-cd-thumb">${c.emoji || '👕'}</div>
        <div class="gx-cd-info">
          <div class="gx-cd-name">${c.name}</div>
          <div class="gx-cd-meta">${c.size} · ${c.color}</div>
          <div class="gx-cd-price">PKR ${(c.price * c.qty).toLocaleString()}</div>
          <div class="gx-qty">
            <button class="gx-qty-btn" onclick="GentXUI.cdQty('${c.key}',-1)">−</button>
            <div class="gx-qty-val">${c.qty}</div>
            <button class="gx-qty-btn" onclick="GentXUI.cdQty('${c.key}',1)">+</button>
          </div>
        </div>
        <button class="gx-cd-rem" onclick="GentXUI.cdRemove('${c.key}')">✕</button>
      </div>
    `).join('');
    if (foot) {
      foot.style.display = 'block';
      document.getElementById('gx-cd-total').textContent = 'PKR ' + GentXDB.getCartTotal().toLocaleString();
    }
  }

  // ── Public methods ───────────────────────────────────────
  let toastTimer;

  return {
    async init(activePage) {
      injectCSS();
      const s = GentXDB.getSettings();

      // Announce
      document.getElementById('gx-announce')?.remove();
      const ann = document.createElement('div');
      ann.id = 'gx-announce';
      ann.innerHTML = await renderAnnounce();
      document.body.insertAdjacentElement('afterbegin', ann);

      // Header
      document.getElementById('gx-header-wrap')?.remove();
      const hw = document.createElement('div');
      hw.id = 'gx-header-wrap';
      hw.innerHTML = await renderHeader(activePage);
      ann.insertAdjacentElement('afterend', hw);

      // Cart drawer
      if (!document.getElementById('gx-cart-backdrop')) {
        document.body.insertAdjacentHTML('beforeend', renderCartDrawer());
      }
      // Toast
      if (!document.getElementById('gx-toast')) {
        document.body.insertAdjacentHTML('beforeend', renderToast());
      }
      // Footer categories
      setTimeout(() => {
        const fc = document.getElementById('gx-footer-cats');
        if (fc) {
          GentXDB.getCategories().then(cats => { fc.innerHTML = cats.filter(c=>c.active).map(c => `<li><a href="${c.slug}.html">${c.name}</a></li>`).join(''); });
        }
        // Update title
        document.title = (document.title.includes('GENTX') ? '' : 'GENTX — ') + document.title;
      }, 100);

      updateCartUI();
      this._bindSearch();
      this._renderUserBtn();
    },

    toast(msg) {
      const t = document.getElementById('gx-toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
    },

    toggleCart() {
      document.getElementById('gx-cart-backdrop')?.classList.toggle('open');
      document.getElementById('gx-cart-drawer')?.classList.toggle('open');
      const open = document.getElementById('gx-cart-drawer')?.classList.contains('open');
      document.body.style.overflow = open ? 'hidden' : '';
    },

    toggleMobileNav() {
      document.getElementById('gx-nav-links')?.classList.toggle('open');
      document.getElementById('gx-mob-overlay')?.classList.toggle('active');
    },

    closeMobileNav() {
      document.getElementById('gx-nav-links')?.classList.remove('open');
      document.getElementById('gx-mob-overlay')?.classList.remove('active');
    },

    async addToCart(id, size, color, name, price, emoji) {
      // If name/price not passed, fetch the product first
      if (!name || !price) {
        const p = await GentXDB.getProduct(id);
        if (!p) { this.toast('⚠ Product not found'); return; }
        name  = p.name;
        price = p.price;
        emoji = p.emoji || '👕';
        if (!size)  size  = p.sizes?.[0]  || 'M';
        if (!color) color = p.colors?.[0] || 'Black';
      }
      const addedName = GentXDB.addToCart(id, size, color, name, price, emoji);
      if (addedName) {
        updateCartUI();
        this.toast('✓ ' + addedName + ' added to cart!');
      }
    },

    cdQty(key, delta) {
      const cart = GentXDB.getCart();
      const item = cart.find(c => c.key === key);
      if (item) GentXDB.updateCartQty(key, item.qty + delta);
      updateCartUI();
    },

    cdRemove(key) {
      GentXDB.removeFromCart(key);
      updateCartUI();
    },

    refreshCart() { updateCartUI(); },

    _renderUserBtn() {
      const wrap = document.getElementById('gx-user-btn-wrap');
      if (!wrap) return;
      const user = GentXDB.getLoggedInUser();
      if (!user) {
        wrap.innerHTML = '<a href="login.html" style="font-family:\'Barlow Condensed\',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;color:#888;text-transform:uppercase;padding:6px 10px;border:1px solid #ddd;border-radius:2px;transition:all .2s;white-space:nowrap;" onmouseover="this.style.borderColor=\'#e00\';this.style.color=\'#e00\'" onmouseout="this.style.borderColor=\'#ddd\';this.style.color=\'#888\'">👤 Login</a>';
      } else {
        wrap.innerHTML = '<div style="position:relative;display:inline-block;">' +
          '<button onclick="document.getElementById(\'gx-user-dd\').classList.toggle(\'open\')" style="font-family:\'Barlow Condensed\',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;color:#e00;text-transform:uppercase;padding:6px 10px;border:1px solid #e00;border-radius:2px;background:none;cursor:pointer;">👤 ' + user.name.split(' ')[0] + ' ▾</button>' +
          '<div id="gx-user-dd" style="display:none;position:absolute;right:0;top:110%;background:#fff;border:1px solid #e0e0e0;border-radius:2px;min-width:140px;box-shadow:0 4px 16px rgba(0,0,0,.1);z-index:999;">' +
          '<a href="account.html" style="display:block;padding:10px 16px;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;">My Orders</a>' +
          '<a href="account.html" style="display:block;padding:10px 16px;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;">My Profile</a>' +
          '<a href="#" onclick="GentXUI.userLogout();return false;" style="display:block;padding:10px 16px;font-size:13px;color:#e00;">Logout</a>' +
          '</div></div>';
        // Add style for open state
        const style = document.createElement('style');
        style.textContent = '#gx-user-dd.open{display:block!important;}';
        document.head.appendChild(style);
      }
    },

    userLogout() {
      GentXDB.logoutUser();
      this._renderUserBtn();
      this.toast('👋 Logged out successfully');
      setTimeout(() => window.location.href = 'index.html', 800);
    },

    subscribe() {
      const v = document.getElementById('gx-news-email')?.value.trim();
      if (!v || !v.includes('@')) { this.toast('⚠ Enter a valid email'); return; }
      this.toast('✓ Subscribed! Welcome to GENTX');
      document.getElementById('gx-news-email').value = '';
    },

    _bindSearch() {
      const inp = document.getElementById('gx-search-input');
      if (inp) {
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') this.handleSearch(); });
      }
    },

    handleSearch() {
      const q = document.getElementById('gx-search-input')?.value.trim();
      if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
    },

    // Render a product card (used by all product-grid pages)
    renderCard(p) {
      const badgeClass = p.badge === 'NEW' ? 'b-new' : p.badge === 'HOT' ? 'b-hot' : '';
      const hasImage = p.image && p.image.length > 10;
      const imgContent = hasImage
        ? `<img src="${p.image}" alt="${p.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s ease;" class="gx-card-real-img" onerror="this.style.display='none'">`
        : `<div class="gx-card-emoji">${p.emoji || '👕'}</div>`;
      return `
        <div class="gx-card" onclick="window.location='product.html?id=${p.id}'">
          <div class="gx-card-img">
            ${imgContent}
            ${p.badge ? `<span class="gx-badge ${badgeClass}">${p.badge}</span>` : ''}
            <div class="gx-quick" onclick="event.stopPropagation();GentXUI.quickAdd('${p.id}')">+ QUICK ADD</div>
          </div>
          <div class="gx-card-info">
            <div class="gx-card-brand">GENTX</div>
            <div class="gx-card-name">${p.name}</div>
            <div>
              <span class="gx-card-price">PKR ${p.price.toLocaleString()}</span>
              ${p.oldPrice ? `<span class="gx-card-old">PKR ${p.oldPrice.toLocaleString()}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    async quickAdd(id) {
      const p = await GentXDB.getProduct(id);
      if (!p) { this.toast('⚠ Product not found'); return; }
      const size  = p.sizes?.[0]  || 'M';
      const color = p.colors?.[0] || 'Black';
      await this.addToCart(id, size, color, p.name, p.price, p.emoji || '👕');
    },

    renderProductGrid(products, container) {
      const el = typeof container === 'string' ? document.getElementById(container) : container;
      if (!el) return;
      if (!products.length) {
        el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#ccc;"><div style="font-size:52px;margin-bottom:14px">🔍</div><div style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;letter-spacing:.1em;text-transform:uppercase">No products found</div></div>`;
        return;
      }
      el.innerHTML = products.map(p => this.renderCard(p)).join('');
    },
  };
})();
