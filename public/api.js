/* ============================================================
   GENTX — API Client  (api.js)
   Talks to the real Express/SQLite backend
   ============================================================ */

const GentXDB = (() => {

  // ── CONFIG ──────────────────────────────────────────────
  // Change this to your server URL when deployed
  const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : window.location.origin + '/api';

  // ── TOKEN HELPERS ────────────────────────────────────────
  function getAdminToken()  { return sessionStorage.getItem('gentx_admin_token'); }
  function getUserToken()   { return localStorage.getItem('gentx_user_token'); }
  function setUserToken(t)  { localStorage.setItem('gentx_user_token', t); }
  function clearUserToken() { localStorage.removeItem('gentx_user_token'); localStorage.removeItem('gentx_session'); }

  // ── HTTP HELPERS ─────────────────────────────────────────
  async function api(method, path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
      const res = await fetch(BASE_URL + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      throw err;
    }
  }

  const get  = (path, token)       => api('GET',    path, null, token);
  const post = (path, body, token) => api('POST',   path, body, token);
  const put  = (path, body, token) => api('PUT',    path, body, token);
  const del  = (path, token)       => api('DELETE', path, null, token);

  // ── CART (stays in localStorage — cart is per-device) ───
  function getCart()    { return JSON.parse(localStorage.getItem('gentx_cart') || '[]'); }
  function saveCart(a)  { localStorage.setItem('gentx_cart', JSON.stringify(a)); }

  // ── PUBLIC API ───────────────────────────────────────────
  return {

    // ── Settings ──────────────────────────────────────────
    async getSettings() {
      try { const d = await get('/settings'); return d.settings || {}; } catch(e) { return {}; }
    },

    // ── Categories ────────────────────────────────────────
    async getCategories() {
      try { const d = await get('/categories'); return d.categories || []; } catch(e) { return []; }
    },
    async getCategoriesAdmin() {
      try { const d = await get('/categories/all', getAdminToken()); return d.categories || []; } catch(e) { return []; }
    },
    async addCategory(data) {
      return post('/categories', data, getAdminToken());
    },
    async updateCategory(id, data) {
      return put('/categories/' + id, data, getAdminToken());
    },
    async deleteCategory(id) {
      return del('/categories/' + id, getAdminToken());
    },

    // ── Products ──────────────────────────────────────────
    async getProducts(params = {}) {
      const q = new URLSearchParams(params).toString();
      try { const d = await get('/products' + (q ? '?' + q : '')); return d.products || []; } catch(e) { return []; }
    },
    async getAllProductsAdmin(params = {}) {
      const q = new URLSearchParams(params).toString();
      try { const d = await get('/products/all' + (q ? '?' + q : ''), getAdminToken()); return d.products || []; } catch(e) { return []; }
    },
    async getProduct(id) {
      try { const d = await get('/products/' + id); return d.product || null; } catch(e) { return null; }
    },
    async getFeatured() {
      return this.getProducts({ featured: 'true' });
    },
    async getByCategory(slug) {
      return this.getProducts({ category: slug });
    },
    async addProduct(data) {
      return post('/products', data, getAdminToken());
    },
    async updateProduct(id, data) {
      return put('/products/' + id, data, getAdminToken());
    },
    async deleteProduct(id) {
      return del('/products/' + id, getAdminToken());
    },

    // ── Cart (localStorage — no server needed) ────────────
    getCart,
    saveCart,
    addToCart(id, size, color, name, price, emoji) {
      const cart = getCart();
      const key  = id + '-' + size + '-' + color;
      const ex   = cart.find(c => c.key === key);
      if (ex) ex.qty++;
      else cart.push({ key, id, name, price, emoji, size, color, qty: 1 });
      saveCart(cart);
      return name;
    },
    removeFromCart(key) {
      saveCart(getCart().filter(c => c.key !== key));
    },
    updateCartQty(key, qty) {
      const cart = getCart();
      const i = cart.findIndex(c => c.key === key);
      if (i > -1) { if (qty <= 0) cart.splice(i, 1); else cart[i].qty = qty; saveCart(cart); }
    },
    getCartTotal() { return getCart().reduce((s, c) => s + c.price * c.qty, 0); },
    getCartCount() { return getCart().reduce((s, c) => s + c.qty, 0); },

    // ── Orders ────────────────────────────────────────────
    async placeOrder(orderData) {
      const d = await post('/orders', orderData, getUserToken() || undefined);
      saveCart([]); // Clear cart after order
      return d.orderId;
    },
    async getOrders(params = {}) {
      const q = new URLSearchParams(params).toString();
      try { const d = await get('/orders' + (q ? '?' + q : ''), getAdminToken()); return d; } catch(e) { return { orders: [], stats: {} }; }
    },
    async getMyOrders() {
      try { const d = await get('/orders/my', getUserToken()); return d.orders || []; } catch(e) { return []; }
    },
    async updateOrderStatus(id, status) {
      return put('/orders/' + id + '/status', { status }, getAdminToken());
    },
    async deleteOrder(id) {
      return del('/orders/' + id, getAdminToken());
    },

    // ── Users (admin) ─────────────────────────────────────
    async getUsers() {
      try { const d = await get('/users', getAdminToken()); return d.users || []; } catch(e) { return []; }
    },
    async deleteUser(id) {
      return del('/users/' + id, getAdminToken());
    },

    // ── Dashboard stats ───────────────────────────────────
    async getDashboard() {
      try { return await get('/settings/dashboard', getAdminToken()); } catch(e) { return {}; }
    },

    // ── Admin Auth ────────────────────────────────────────
    async adminLogin(username, password) {
      try {
        const d = await post('/auth/admin/login', { username, password });
        if (d.token) {
          sessionStorage.setItem('gentx_admin_token', d.token);
          sessionStorage.setItem('gentx_admin', '1');
          return true;
        }
        return false;
      } catch(e) { return false; }
    },
    isAdmin() { return sessionStorage.getItem('gentx_admin') === '1'; },
    adminLogout() {
      sessionStorage.removeItem('gentx_admin_token');
      sessionStorage.removeItem('gentx_admin');
    },
    async saveAdminSettings(data) {
      return post('/auth/admin/change-password', data, getAdminToken());
    },
    async saveStoreSettings(data) {
      return put('/settings', data, getAdminToken());
    },

    // ── User Auth ─────────────────────────────────────────
    async registerUser(name, email, password) {
      try {
        const d = await post('/auth/register', { name, email, password });
        if (d.token) {
          setUserToken(d.token);
          localStorage.setItem('gentx_session', JSON.stringify(d.user));
        }
        return { ok: true, user: d.user };
      } catch(e) { return { ok: false, err: e.message }; }
    },
    async loginUser(email, password) {
      try {
        const d = await post('/auth/login', { email, password });
        if (d.token) {
          setUserToken(d.token);
          localStorage.setItem('gentx_session', JSON.stringify(d.user));
        }
        return { ok: true, user: d.user };
      } catch(e) { return { ok: false, err: e.message }; }
    },
    getLoggedInUser() {
      try { return JSON.parse(localStorage.getItem('gentx_session')); } catch(e) { return null; }
    },
    logoutUser() { clearUserToken(); },
    async updateUserProfile(name, password) {
      try {
        const d = await put('/auth/profile', { name, password }, getUserToken());
        if (d.token) {
          setUserToken(d.token);
          localStorage.setItem('gentx_session', JSON.stringify(d.user));
        }
        return { ok: true };
      } catch(e) { return { ok: false, err: e.message }; }
    },

    // ── Misc ──────────────────────────────────────────────
    init() {}, // No-op — server handles initialization
  };
})();
