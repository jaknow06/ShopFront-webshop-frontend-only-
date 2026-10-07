const products = [
    { id: 1, name: 'T-shirt', price: 199, category: 'klader', image: 'images/t-shirt.jpg', alt: 'vit t-shirt med ShopFront-logga på bröstet' },
    { id: 2, name: 'Mugg', price: 99, category: 'hem', image: 'images/mugg.jpg', alt: 'Vit keramikmugg med ShopFront-logga' },
    { id: 3, name: 'Nyckelring', price: 50, category: 'accessoarer', image: 'images/nyckelring.jpg', alt: 'knipa med metalnycklar på ring  med ShopFront-logga' }

];

const productList = document.querySelector('#product-list');
const categoryFilter = document.querySelector('#category-filter');

function showProducts(list) {
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

    if (category === 'alla') {
        showProducts(products);
    } else {
        showProducts(products.filter(p => p.category === category));
    }
}

categoryFilter.addEventListener('change', filterProducts);
showProducts(products);   