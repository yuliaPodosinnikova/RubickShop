// === БАЗА ТОВАРОВ (ваши данные, но с функцией очистки URL) ===
const rawProducts = [
    {id:1,name:'Samsung S25 Ultra',oldPrice:139990,price:129890,brand:'Samsung',category:'smartphones',img:'https://avatars.mds.yandex.net/get-mpic/12485547/2a00000194d5603313026fc0b885b5ad9e78/optimize  ',cashback:649,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','6.9"'],['Камера','200MP']]},
    {id:2,name:'Samsung S26 Ultra ',oldPrice:149990,price:139990,brand:'Samsung',category:'smartphones',img:'https://img.mvideo.ru/Big/30093353bb.jpg  ',cashback:699,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','7"'],['Камера','220MP']]},
    {id:3,name:'Huawei MateBook X 2025',oldPrice:159990,price:149990,brand:'Huawei',category:'laptops',img:'https://img.mvideo.ru/Big/30072066bb.jpg  ',cashback:799,specs:[['Тип','Ноутбук'],['CPU','i7'],['RAM','16GB'],['SSD','512GB']]},
    {id:4,name:'Sony WH-1000XM5 2025',oldPrice:24990,price:19990,brand:'Sony',category:'headphones',img:'https://impult.ru/preview/r/-x-/upload/iblock/905/hn3m2sztpow84et9zguwd5egjvbztamc.jpg  ',cashback:99,specs:[['Тип','Наушники'],['ANC','Да'],['Bluetooth','5.2']]},
    {id:5,name:'Apple iPad Air 2025',oldPrice:59990,price:54990,brand:'Apple',category:'tablets',img:'https://cdn.mtscdn.ru/upload/iblock/b59/ipad_air_finish_select_gallery_202405_11inch_starlight_wificell.png  ',cashback:199,specs:[['Тип','Планшет'],['Экран','10.9"'],['OS','iPadOS']]},
    {id:6,name:'Samsung Galaxy Tab S8 2026',oldPrice:69990,price:64990,brand:'Samsung',category:'tablets',img:'https://avatars.mds.yandex.net/get-mpic/4399094/2a00000191bd597076b316d508bc23a8d6fd/optimize  ',cashback:299,specs:[['Тип','Планшет'],['Экран','11"'],['OS','Android']]},
    {id:7,name:'Samsung S24 Uttra',oldPrice:79900,price:76990,brand:'Samsung',category:'smartphones',img:'https://avatars.mds.yandex.net/get-goods_pic/15070395/hatf0fc9d52eee22be96b1352b418dc2f71/orig  ',cashback:149,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','6.67"'],['Камера','108MP']]},
    {id:8,name:'Samsung Galaxy Z Fold7',oldPrice:133990,price:129990,brand:'Samsung',category:'smartphones',img:'https://ir.ozone.ru/s3/multimedia-1-k/7743508328.jpg  ',cashback:149,specs:[['Тип','Смартфон'],['OS','Android'],['Экран','308"'],['Камера','108MP']]}
];
// Очищаем URL и исправляем опечатки
const products = rawProducts.map(p => ({
    ...p,
    name: p.name.trim(),
    img: p.img.trim(),
    specs: p.specs.map(s => [s[0].trim(), String(s[1]).trim()])
}));

// === РАБОТА С КОРЗИНОЙ ===
const CART_KEY = 'rubickCart';

function formatPrice(p) { 
    return (p || 0).toLocaleString('ru-RU'); 
}

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

// === SVG-ПЛЕЙСХОЛДЕР ===
function getPlaceholderSVG(name, brand) {
    const initials = (brand || name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const bg = '22c55e';
    const text = encodeURIComponent(initials);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${bg}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' font-weight='bold' fill='white'%3E${text}%3C/text%3E%3C/svg%3E`;
}

// === ЗАКРЫТИЕ БАННЕРА ===
function closePromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('promoBannerClosed', 'true');
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем баннер при загрузке
    if (localStorage.getItem('promoBannerClosed') === 'true') {
        const banner = document.getElementById('promoBanner');
        if (banner) banner.style.display = 'none';
    }
    
    updateCartDisplay();
    updateCartCounter();
});

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        counter.textContent = getCartTotalItems();
        counter.style.display = getCartTotalItems() > 0 ? 'block' : 'none';
    }
}

// === ОТРИСОВКА КОРЗИНЫ ===
function updateCartDisplay() {
    const cart = getCart();
    const container = document.getElementById('cartItemsList');
    const orderDetails = document.getElementById('orderDetails');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Корзина пуста. <a href="index.html">Перейти к каталогу</a></p>';
        if (orderDetails) orderDetails.style.display = 'none';
        return;
    }
    
    if (orderDetails) orderDetails.style.display = 'block';
    
    container.innerHTML = cart.map((cartItem, index) => {
        const product = products.find(p => p.id === cartItem.id);
        if (!product) return '';
        
        const placeholder = getPlaceholderSVG(product.name, product.brand);
        
        return `
            <div class="cart-item">
                <img src="${product.img}" 
                     alt="${product.name}" 
                     onerror="this.onerror=null; this.src='${placeholder}'; this.style.objectFit='contain';">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <div class="price-row">
                        <span class="price-main">${formatPrice(product.price)} ₽</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)} ₽</span>` : ''}
                    </div>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">−</button>
                        <span>${cartItem.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Удалить</button>
            </div>
        `;
    }).join('');
    
    updateOrderDetails();
}

// === ИЗМЕНЕНИЕ КОЛИЧЕСТВА ===
function changeQuantity(index, delta) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + delta);
        saveCart(cart);
        updateCartDisplay();
        updateCartCounter();
    }
}

// === УДАЛЕНИЕ ИЗ КОРЗИНЫ ===
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartDisplay();
    updateCartCounter();
}

// === РАСЧЁТ ИТОГОВ ===
function updateOrderDetails() {
    const cart = getCart();
    
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const totalSum = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const totalOldSum = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product?.oldPrice ? product.oldPrice * item.quantity : 0);
    }, 0);
    
    const totalDiscount = totalOldSum - totalSum;
    const promoDiscount = Math.round(totalSum * 0.17);
    const finalTotal = Math.max(0, totalSum - promoDiscount);
    
    const el = (id) => document.getElementById(id);
    
    if (el('itemsCount')) {
        el('itemsCount').textContent = `${itemsCount} товар${itemsCount === 1 ? '' : (itemsCount < 5 ? 'а' : 'ов')}`;
    }
    if (el('totalSum')) {
        el('totalSum').textContent = formatPrice(totalSum) + ' ₽';
    }
    if (el('totalDiscount')) {
        el('totalDiscount').textContent = '−' + formatPrice(totalDiscount) + ' ₽';
    }
    if (el('promoDiscount')) {
        el('promoDiscount').textContent = '−' + formatPrice(promoDiscount) + ' ₽';
    }
    if (el('finalTotal')) {
        el('finalTotal').textContent = formatPrice(finalTotal) + ' ₽';
    }
}