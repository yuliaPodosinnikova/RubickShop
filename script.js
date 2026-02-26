// === БАЗА ТОВАРОВ ===
let products = [
    {id:1,name:'Samsung S25 Ultra',oldPrice:139990,price:129890,brand:'Samsung',category:'smartphones',img:'https://avatars.mds.yandex.net/get-mpic/12485547/2a00000194d5603313026fc0b885b5ad9e78/optimize',cashback:649,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','6.9"'],['Камера','200MP']]},
    {id:2,name:'Samsung S26 Ultra ',oldPrice:149990,price:139990,brand:'Samsung',category:'smartphones',img:'https://img.mvideo.ru/Big/30093353bb.jpg',cashback:699,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','7"'],['Камера','220MP']]},
    {id:3,name:'Huawei MateBook X 2025',oldPrice:159990,price:149990,brand:'Huawei',category:'laptops',img:'https://img.mvideo.ru/Big/30072066bb.jpg',cashback:799,specs:[['Тип','Ноутбук'],['CPU','i7'],['RAM','16GB'],['SSD','512GB']]},
    {id:4,name:'Sony WH-1000XM5 2025',oldPrice:24990,price:19990,brand:'Sony',category:'headphones',img:'https://impult.ru/preview/r/-x-/upload/iblock/905/hn3m2sztpow84et9zguwd5egjvbztamc.jpg',cashback:99,specs:[['Тип','Наушники'],['ANC','Да'],['Bluetooth','5.2']]},
    {id:5,name:'Apple iPad Air 2025',oldPrice:59990,price:54990,brand:'Apple',category:'tablets',img:'https://cdn.mtscdn.ru/upload/iblock/b59/ipad_air_finish_select_gallery_202405_11inch_starlight_wificell.png',cashback:199,specs:[['Тип','Планшет'],['Экран','10.9"'],['OS','iPadOS']]},
    {id:6,name:'Samsung Galaxy Tab S8 2026',oldPrice:69990,price:64990,brand:'Samsung',category:'tablets',img:'https://avatars.mds.yandex.net/get-mpic/4399094/2a00000191bd597076b316d508bc23a8d6fd/optimize',cashback:299,specs:[['Тип','Планшет'],['Экран','11"'],['OS','Android']]},
    {id:7,name:'Samsung S24 Uttra',oldPrice:79900,price:76990,brand:'Samsung',category:'smartphones',img:'https://avatars.mds.yandex.net/get-goods_pic/15070395/hatf0fc9d52eee22be96b1352b418dc2f71/orig',cashback:149,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','6.67"'],['Камера','108MP']]},
    {id:8,name:'Samsung Galaxy Z Fold7',oldPrice:133990,price:129990,brand:'Samsung',category:'smartphones',img:'https://ir.ozone.ru/s3/multimedia-1-k/7743508328.jpg',cashback:149,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','308"'],['Камера','108MP']]}
];

// === РАБОТА С КОРЗИНОЙ ===
const CART_KEY = 'rubickCart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartTotalItems() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCounter();
    updatePriceSlider();
    initPromoBanner();
});

// === БАННЕР ===
function initPromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;
    banner.classList.remove('hidden');
    banner.style.opacity = '1';
    banner.style.transform = 'translateY(0)';
    banner.style.transition = 'none';
}

function closePromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner) {
        banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            banner.classList.add('hidden');
        }, 300);
    }
}

// === ОТРИСОВКА ТОВАРОВ ===
function renderProducts(filteredProducts = products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = filteredProducts.map(product => {
        const discount = product.oldPrice 
            ? Math.round((product.oldPrice - product.price) / product.oldPrice * 100) 
            : null;
        
        return `
        <div class="product-card" onclick="openModal(${product.id})">
            ${discount ? `<span class="discount-badge">-${discount}%</span>` : ''}
            <div class="product-image">
                <img src="${product.img.trim()}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400?text=Нет+фото'">
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-prices">
                    <span class="price-main">${product.price.toLocaleString('ru-RU')} ₽</span>
                    ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toLocaleString('ru-RU')} ₽</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id}, this)">В корзину</button>
            </div>
        </div>
        `;
    }).join('');
}

// === ДОБАВЛЕНИЕ В КОРЗИНУ ===
function addToCart(productId, btnElement = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartCounter();
    
    // Визуальный отклик кнопки
    if (btnElement) {
        const originalText = btnElement.textContent;
        const originalBg = btnElement.style.background;
        btnElement.textContent = '✓ Добавлено!';
        btnElement.style.background = '#16a34a';
        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.background = originalBg;
        }, 1500);
    }
}

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        const totalItems = getCartTotalItems();
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// === МОДАЛЬНОЕ ОКНО ===
let currentModalProductId = null;

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentModalProductId = productId;
    
    document.getElementById('modalImg').src = product.img.trim();
    document.getElementById('modalImg').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    
    const oldPriceEl = document.getElementById('modalOldPrice');
    if (product.oldPrice) {
        oldPriceEl.textContent = `${product.oldPrice.toLocaleString('ru-RU')} ₽`;
        oldPriceEl.style.display = 'block';
    } else {
        oldPriceEl.style.display = 'none';
    }
    
    document.getElementById('modalCashback').textContent = `Кэшбэк: ${product.cashback.toLocaleString('ru-RU')} ₽`;
    
    const specsTable = document.getElementById('modalSpecs');
    specsTable.innerHTML = product.specs.map(([key, value]) => 
        `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`
    ).join('');
    
    document.getElementById('productModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');
    document.body.style.overflow = '';
    currentModalProductId = null;
}

function addToCartFromModal() {
    if (currentModalProductId) {
        addToCart(currentModalProductId);
        closeModal();
    }
}

// === ФИЛЬТРЫ ===
function filterProducts() {
    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]:checked');
    
    const selectedBrands = Array.from(checkboxes)
        .filter(cb => cb.closest('.filter-group').querySelector('h4')?.textContent.includes('Бренд'))
        .map(cb => cb.value);
    
    const selectedCategories = Array.from(checkboxes)
        .filter(cb => cb.closest('.filter-group').querySelector('h4')?.textContent.includes('Категория'))
        .map(cb => cb.value);
    
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    const filtered = products.filter(product => {
        const priceMatch = product.price <= maxPrice;
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return priceMatch && brandMatch && categoryMatch;
    });
    
    renderProducts(filtered);
}

function updatePriceSlider() {
    const slider = document.getElementById('priceRange');
    const valueSpan = document.getElementById('priceValue');
    if (!slider || !valueSpan) return;
    
    const price = parseInt(slider.value);
    valueSpan.textContent = `${price.toLocaleString('ru-RU')} ₽`;
    filterProducts();
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    const slider = document.getElementById('priceRange');
    if (slider) slider.value = 200000;
    updatePriceSlider();
    renderProducts();
}

// === ЗАКРЫТИЕ МОДАЛКИ ===
document.addEventListener('click', function(e) {
    const modal = document.getElementById('productModal');
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});