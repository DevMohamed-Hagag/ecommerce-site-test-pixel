// ─── DATA ────────────────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: 129.99,
    originalPrice: 179.99,
    category: "Electronics",
    description: "Premium sound with 40-hour battery & active noise cancellation.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 2,
    name: "Leather Crossbody Bag",
    price: 89.00,
    originalPrice: null,
    category: "Fashion",
    description: "Genuine leather with adjustable strap. Perfect for everyday use.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    badge: "New",
    rating: 4.6,
    reviews: 128,
  },
  {
    id: 3,
    name: "Ceramic Pour-Over Set",
    price: 44.00,
    originalPrice: 60.00,
    category: "Kitchen",
    description: "Hand-crafted ceramic dripper and server for the perfect morning brew.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    badge: "Sale",
    rating: 4.9,
    reviews: 215,
  },
  {
    id: 4,
    name: "Minimalist Watch",
    price: 199.00,
    originalPrice: null,
    category: "Accessories",
    description: "Swiss movement, sapphire crystal glass, 42mm brushed steel case.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    badge: null,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 5,
    name: "Linen Throw Pillow",
    price: 32.00,
    originalPrice: null,
    category: "Home",
    description: "100% natural linen with hidden zipper. Available in 6 colors.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
    badge: null,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: 6,
    name: "Running Sneakers",
    price: 115.00,
    originalPrice: 145.00,
    category: "Footwear",
    description: "Lightweight mesh upper with responsive foam cushioning.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    badge: "Sale",
    rating: 4.6,
    reviews: 503,
  },
];

const categories = ["All", "Electronics", "Fashion", "Kitchen", "Accessories", "Home", "Footwear"];

// ─── CART HELPERS ─────────────────────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('shopwave_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem('shopwave_cart', JSON.stringify(cart)); }
  catch {}
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    cart = cart.map(i => i.id === id ? {...i, qty: i.qty + 1} : i);
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(`"${product.name}" added to cart`);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#nav-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '½';
  while (s.replace('½','').length < 5) s += '☆';
  return `<span class="stars">${s}</span>`;
}

function productCard(p) {
  const discount = p.originalPrice
    ? `<span class="badge sale">−${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>`
    : p.badge ? `<span class="badge">${p.badge}</span>` : '';

  const originalPrice = p.originalPrice
    ? `<s class="original-price">$${p.originalPrice.toFixed(2)}</s>` : '';

  return `
    <div class="product-card">
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${discount}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-rating">${stars(p.rating)} <span class="review-count">(${p.reviews})</span></div>
        <div class="card-footer">
          <div class="price-block">
            <span class="price">$${p.price.toFixed(2)}</span>
            ${originalPrice}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
        </div>
      </div>
    </div>`;
}

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
  updateCartCount();
});
