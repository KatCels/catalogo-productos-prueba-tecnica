console.log('Catálogo cargado');
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Renderiza productos
function renderCatalog(productList) {
  const catalog = document.getElementById("product-catalog");
  catalog.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Categoría: ${product.category}</p>
      <p>Precio: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar al carrito</button>
    `;
    catalog.appendChild(card);
  });
}

// Renderiza categorías únicas en select
function populateFilters() {
  const categoryFilter = document.getElementById("filter-category");
  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const priceMax = Math.max(...products.map(p => p.price));
  const priceInput = document.getElementById("filter-price");
  priceInput.max = priceMax;
  priceInput.value = priceMax;
  document.getElementById("price-value").textContent = `$${priceMax}`;
}

// Aplica filtros
function applyFilters() {
  const selectedCategory = document.getElementById("filter-category").value;
  const selectedPrice = parseInt(document.getElementById("filter-price").value);

  let filtered = products.filter(p => p.price <= selectedPrice);
  if (selectedCategory !== "all") {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  renderCatalog(filtered);
}

// Agrega al carrito
function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

// Elimina del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

// Renderiza el carrito
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const cartCounter = document.getElementById("cart-counter");

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - $${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})">Eliminar</button>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total}`;
  cartCounter.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Guarda en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Modo oscuro
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Eventos de filtros
document.getElementById("filter-category").addEventListener("change", applyFilters);
document.getElementById("filter-price").addEventListener("input", () => {
  document.getElementById("price-value").textContent = `$${document.getElementById("filter-price").value}`;
  applyFilters();
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(products);
  populateFilters();
  renderCart();
});
