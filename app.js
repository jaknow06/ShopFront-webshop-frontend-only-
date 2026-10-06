const categoryFilter = document.querySelector('#category-filter');

function filterProducts() {
    const category = categoryFilter.value;

    console.log(category);
}

categoryFilter.addEventListener('change', filterProducts);

