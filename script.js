// ==========================================
// 1. ΡΥΘΜΙΣΕΙΣ EMAILJS & ΑΡΧΙΚΟΠΟΙΗΣΗ
// ==========================================
const EMAILJS_PUBLIC_KEY = "7cDMjJn9hC9K7ULgA"; 
const EMAILJS_SERVICE_ID = "service_xj8pfgk"; 
const EMAILJS_TEMPLATE_ID = "template_ugdqs69"; 

emailjs.init(EMAILJS_PUBLIC_KEY);

let isLoggedIn = false;
let cart = [];
let isLogin = true;

// Περιμένουμε να φορτώσει το HTML
document.addEventListener('DOMContentLoaded', () => {
    createStars(); // Δημιουργία αστεριών στο φόντο
    renderProducts(); // Εμφάνιση προϊόντων
    updateCartUI();
});

// ==========================================
// 2. ΔΗΜΙΟΥΡΓΙΑ BACKGROUND (STARS)
// ==========================================
function createStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(star);
    }
}

// ==========================================
// 3. ΛΙΣΤΑ ΠΡΟΪΟΝΤΩΝ & ΕΜΦΑΝΙΣΗ
// ==========================================
const customProducts = [
    { id: 1, name: "Tung Tung Tung Sahur Case", price: 10, img: "images/case1.png" },
    { id: 2, name: "Bombardilo Crocodilo Case", price: 10, img: "images/case2.png" },
    { id: 3, name: "Tralalelo Tralala Case", price: 10, img: "images/case3.png" },
    { id: 4, name: "Odin Din Din Dun Case", price: 10, img: "images/case4.png" },
    { id: 5, name: "Boneca Ambalabu Case", price: 10, img: "images/case5.png" },
    { id: 6, name: "Space Case", price: 10, img: "images/case6.png" },
    { id: 7, name: "Olympiakos Case", price: 10, img: "images/case7.png" },
    { id: 8, name: "Panauenaikos Case", price: 10, img: "images/case8.png" },
    { id: 9, name: "Aek Case", price: 10, img: "images/case9.png" },
    { id: 10, name: "Out Of Stock", price: 10, img: "images/case10.png" }
];

function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = ""; 
    customProducts.forEach(product => {
        const isOutOfStock = product.name === "Out Of Stock";
        productList.innerHTML += `
            <div class="product-card" style="${isOutOfStock ? 'opacity: 0.6;' : ''}">
                <div class="img-container">
                    <img src="${product.img}" onerror="this.src='https://via.placeholder.com/200x250?text=Elite+Cover';">
                </div>
                <h3>${product.name}</h3>
                <p style="color:#e0aaff; margin: 10px 0; font-weight:bold;">${isOutOfStock ? '---' : product.price.toFixed(2) + '€'}</p>
                <button class="add-btn" 
                        onclick="${isOutOfStock ? '' : `addToCart('${product.name}', ${product.price})`}" 
                        style="${isOutOfStock ? 'background: #555; cursor: not-allowed;' : ''}">
                    ${isOutOfStock ? 'ΕΞΑΝΤΛΗΘΗΚΕ' : 'ΣΤΟ ΚΑΛΑΘΙ'}
                </button>
            </div>
        `;
    });
}

// ==========================================
// 4. ΔΙΑΧΕΙΡΙΣΗ ΚΑΛΑΘΙΟΥ
// ==========================================
window.addToCart = function(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    if(!document.getElementById('cart-drawer').classList.contains('active')) toggleCart();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!countEl || !cartItems || !totalEl) return;

    countEl.innerText = cart.length;
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #3c096c; padding-bottom:5px;">
                <div style="font-size:13px; color: #fff;">${item.name} <br><b>${item.price}€</b></div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:20px; font-weight:bold;">&times;</button>
            </div>`;
    });
    
    totalEl.innerText = total.toFixed(2);
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    if(cart.length > 0) {
        if(isLoggedIn) {
            renderPayPal(total);
        } else {
            paypalContainer.innerHTML = `<button class="main-btn-auth" onclick="openAuth()">LOGIN ΓΙΑ ΑΓΟΡΑ</button>`;
        }
    }
}

// ==========================================
// 5. PAYPAL & EMAIL
// ==========================================
function renderPayPal(totalAmount) {
    paypal.Buttons({
        onClick: function(data, actions) {
            const phone = document.getElementById('customer-phone').value;
            const model = document.getElementById('phone-model').value;
            let valid = true;

            if (phone.length < 10) { document.getElementById('phone-error').style.display = 'block'; valid = false; } 
            else { document.getElementById('phone-error').style.display = 'none'; }

            if (model.trim().length < 2) { document.getElementById('model-error').style.display = 'block'; valid = false; }
            else { document.getElementById('model-error').style.display = 'none'; }

            return valid ? actions.resolve() : actions.reject();
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "EliteCoverCase Order",
                    amount: { value: totalAmount.toString() }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                const phone = document.getElementById('customer-phone').value;
                const model = document.getElementById('phone-model').value;
                const itemsStr = cart.map(i => i.name).join(", ");
                sendOrderEmail(details.payer.name.given_name, phone, model, itemsStr, totalAmount);
                alert('Η παραγγελία πέτυχε! Θα λάβετε SMS στο ' + phone);
                cart = []; updateCartUI(); toggleCart();
            });
        }
    }).render('#paypal-button-container');
}

function sendOrderEmail(name, phone, model, items, total) {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        customer_phone: phone,
        phone_model: model,
        order_items: items,
        total_price: total + "€"
    });
}

// ==========================================
// 6. LOGIN & MODALS
// ==========================================
window.toggleAuthType = function() {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerText = isLogin ? "Σύνδεση" : "Εγγραφή";
    document.querySelector('.main-btn-auth').innerText = isLogin ? "Είσοδος" : "Δημιουργία Λογαριασμού";
    document.getElementById('auth-switch').innerText = isLogin ? "Δεν έχεις λογαριασμό; Εγγραφή" : "Έχεις ήδη λογαριασμό; Σύνδεση";
};

window.handleAuth = function() {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('pass-input').value;
    if (!email || !pass) { alert("Συμπλήρωσε τα πεδία!"); return; }
    
    if (!isLogin) { 
        localStorage.setItem(email, pass);
        alert("Η εγγραφή πέτυχε! Τώρα κάντε Σύνδεση.");
        toggleAuthType();
    } else { 
        if (localStorage.getItem(email) === pass) {
            isLoggedIn = true;
            alert("Καλώς ήρθες!");
            document.querySelector('.auth-btn').innerText = "User: " + email.split('@')[0];
            closeAuth();
            updateCartUI();
        } else { alert("Λάθος στοιχεία!"); }
    }
};

window.openAuth = function() { document.getElementById('auth-modal').style.display = 'block'; document.getElementById('overlay').classList.add('active'); };
window.closeAuth = function() { document.getElementById('auth-modal').style.display = 'none'; if(!document.getElementById('cart-drawer').classList.contains('active')) document.getElementById('overlay').classList.remove('active'); };
window.toggleCart = function() { document.getElementById('cart-drawer').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); };
window.closeAll = function() { closeAuth(); if(document.getElementById('cart-drawer').classList.contains('active')) toggleCart(); };
