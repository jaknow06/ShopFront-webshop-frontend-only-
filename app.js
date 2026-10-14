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
    productList.innerHTML = list.length
        ? list.map(p => `
            <article class="product-card" data-id="${p.id}">
                <img src="${p.image}" alt="${p.alt}">
                <h3>${p.name}</h3>
                <p class="price">${p.price} kr</p>
                <button type="button" class="add-btn">Lägg i korgen</button>
            </article>`).join('')
        : '<p class="empty-message">Inga produkter i den här kategorin.</p>';
}

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(saved)
            ? saved.filter(i => i && getProduct(i.id) && Number.isInteger(i.quantity) && i.quantity > 0)
            : [];
    } catch {
        return [];
    }
}

let cart = loadCart();

function setCart(newCart) {
    cart = newCart.filter(i => i.quantity > 0);
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
    renderCart();
}

function changeQuantity(id, delta) {
    const exists = cart.some(i => i.id === id);
    setCart(exists
        ? cart.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        : [...cart, { id, quantity: delta }]);
}

function renderCart() {
    clearBtn.disabled = !cart.length;

    cartItems.innerHTML = cart.length
        ? cart.map(({ id, quantity }) => {
            const { name, price } = getProduct(id);
            return `
                <div class="cart-row" data-id="${id}">
                    <span>${name} x ${quantity}</span>
                    <span>${price * quantity} kr</span>
                    <div class="cart-buttons">
                        <button type="button" class="decrease-btn" aria-label="Minska antal ${name}">−</button>
                        <button type="button" class="increase-btn" aria-label="Öka antal ${name}">+</button>
                        <button type="button" class="remove-btn" aria-label="Ta bort ${name}">Ta bort</button>
                    </div>
                </div>`;
        }).join('')
        : '<p class="empty-message">Korgen är tom</p>';

    cartTotal.textContent = cart.reduce((sum, i) => sum + getProduct(i.id).price * i.quantity, 0);
}

categoryFilter.addEventListener('change', () => {
    const cat = categoryFilter.value;
    showProducts(cat === 'alla' ? products : products.filter(p => p.category === cat));
});

productList.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (btn) changeQuantity(Number(btn.closest('.product-card').dataset.id), 1);
});

cartItems.addEventListener('click', e => {
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const id = Number(row.dataset.id);

    if (e.target.closest('.increase-btn')) changeQuantity(id, 1);
    else if (e.target.closest('.decrease-btn')) changeQuantity(id, -1);
    else if (e.target.closest('.remove-btn')) setCart(cart.filter(i => i.id !== id));
});

clearBtn.addEventListener('click', () => setCart([]));

showProducts(products);
renderCart();