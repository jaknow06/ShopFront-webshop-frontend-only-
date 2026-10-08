const products = [
    { id: 1, name: 'T-shirt', price: 199, category: 'klader', image: 'images/t-shirt.jpg', alt: 'Vit t-shirt' },
    { id: 2, name: 'Mugg', price: 99, category: 'hem', image: 'images/mugg.jpg', alt: 'Vit keramikmugg' },
    { id: 3, name: 'Nyckelring', price: 50, category: 'accessoarer', image: 'images/nyckelring.jpg', alt: 'Knippa med metallnycklar' },
    { id: 4, name: 'Hoodie', price: 399, category: 'klader', image: 'images/hoodie.jpg', alt: 'vit huvtröja' },
    { id: 5, name: 'Keps', price: 149, category: 'klader', image: 'images/keps.jpg', alt: 'Svart keps' },
    { id: 6, name: 'Tygkasse', price: 79, category: 'accessoarer', image: 'images/tygkasse.jpg', alt: 'Naturvit tygkasse' },
    { id: 7, name: 'Mobilskal', price: 129, category: 'accessoarer', image: 'images/mobilskal.jpg', alt: 'Svart mobilskal' },
    { id: 8, name: 'Kudde', price: 249, category: 'hem', image: 'images/kudde.jpg', alt: 'Grön kudde' },
    { id: 9, name: 'Vattenflaska', price: 89, category: 'hem', image: 'images/vattenflaska.jpg', alt: 'Minimalistisk blå genomskinlig vattenflaska' },
    { id: 10, name: 'Termosmugg', price: 179, category: 'hem', image: 'images/termosmugg.jpg', alt: 'Silver termosmugg i rostfritt stål' }
];

const productList = document.querySelector('#product-list');
const categoryFilter = document.querySelector('#category-filter');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const clearBtn = document.querySelector('#clear-btn');

const CART_KEY = 'shopfront-cart';
const getProduct = id => products.find(p => p.id === id);

function showProducts(list) {
    if (list.length === 0) {
        productList.innerHTML = '<p class="empty-message">Inga produkter i den här kategorin.</p>';
        return;
    }

    productList.innerHTML = list.map(product => `
        <article class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.alt}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} kr</p>
            <button type="button" class="add-btn">Lägg i korgen</button>
        </article>
    `).join('');
}

function filterProducts() {
    const category = categoryFilter.value;
    showProducts(category === 'alla' ? products : products.filter(p => p.category === category));
}

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)).filter(item =>
            getProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0
        );
    } catch {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
}

let cart = loadCart();

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
    } else if (delta > 0) {
        cart.push({ id, quantity: delta });
    }
    cart = cart.filter(i => i.quantity > 0);
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {
    saveCart();
    clearBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-message">Korgen är tom</p>';
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = getProduct(item.id);
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-row" data-id="${item.id}">
                <span>${product.name} × ${item.quantity}</span>
                <span>${subtotal} kr</span>
                <div class="cart-buttons">
                    <button type="button" class="decrease-btn" aria-label="Minska antal ${product.name}">−</button>
                    <button type="button" class="increase-btn" aria-label="Öka antal ${product.name}">+</button>
                    <button type="button" class="remove-btn" aria-label="Ta bort ${product.name}">Ta bort</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total;
}

categoryFilter.addEventListener('change', filterProducts);

productList.addEventListener('click', event => {
    const button = event.target.closest('.add-btn');
    if (button) changeQuantity(Number(button.closest('.product-card').dataset.id), 1);
});

cartItems.addEventListener('click', event => {
    const row = event.target.closest('.cart-row');
    if (!row) return;
    const id = Number(row.dataset.id);

    if (event.target.closest('.increase-btn')) changeQuantity(id, 1);
    else if (event.target.closest('.decrease-btn')) changeQuantity(id, -1);
    else if (event.target.closest('.remove-btn')) removeItem(id);
});

clearBtn.addEventListener('click', clearCart);

showProducts(products);
renderCart();