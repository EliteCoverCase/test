// ==========================================
// 1. ΡΥΘΜΙΣΕΙΣ EMAILJS
// ==========================================
const EMAILJS_PUBLIC_KEY = "7cDMjJn9hC9K7ULgA"; 
const EMAILJS_SERVICE_ID = "service_xj8pfgk"; 
const EMAILJS_TEMPLATE_ID = "template_ugdqs69"; 

emailjs.init(EMAILJS_PUBLIC_KEY);

let isLoggedIn = false;
let cart = [];
let isLogin = true;

// ==========================================
// 2. Η ΛΙΣΤΑ ΜΕ ΤΑ CUSTOM ΟΝΟΜΑΤΑ ΣΟΥ
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
    { id: 10, name: "Out Of Stock", price: 10, img: "images/case10.png" },
    { id: 11, name: "Out Of Stock", price: 10, img: "images/case11.png" },
    { id: 12, name: "Out Of Stock", price: 10, img: "images/case12.png" },
    { id: 13, name: "Out Of Stock", price: 10, img: "images/case13.png" },
    { id: 14, name: "Out Of Stock", price: 10, img: "images/case14.png" },
    { id: 15, name: "Out Of Stock", price: 10, img: "images/case15.png" },
    { id: 16, name: "Out Of Stock", price: 10, img: "images/case16.png" },
    { id: 17, name: "Out Of Stock", price: 10, img: "images/case17.png" },
    { id: 18, name: "Out Of Stock", price: 10, img: "images/case18.png" },
    { id: 19, name: "Out Of Stock", price: 10, img: "images/case19.png" },
    { id: 20, name: "Out Of Stock", price: 10, img: "images/case20.png" }
];

// Εμφάνιση προϊόντων
const productList = document.getElementById('product-list');
if (productList) {
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
// 3. ΔΙΑΧΕΙΡΙΣΗ ΚΑΛΑΘΙΟΥ & REMOVE
// ==========================================
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    if(!document.getElementById('cart-drawer').classList.contains('active')) toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
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
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    if(cart.length > 0) {
        if(isLoggedIn) {
            renderPayPal(total);
        } else {
            paypalContainer.innerHTML = `<button class="add-btn" onclick="openAuth()">LOGIN ΓΙΑ ΑΓΟΡΑ</button>`;
        }
    }
}

// ==========================================
// 4. PAYPAL & EMAIL (ΜΕ PHONE MODEL)
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
        phone_model: model, // Μην ξεχάσεις το {{phone_model}} στο EmailJS!
        order_items: items,
        total_price: total + "€"
    });
}

// ==========================================
// 5. LOGIN, MODALS & UTILS
// ==========================================
function toggleAuthType() {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerText = isLogin ? "Σύνδεση" : "Εγγραφή";
    document.querySelector('.main-btn-auth').innerText = isLogin ? "Είσοδος" : "Δημιουργία Λογαριασμού";
    document.getElementById('auth-switch').innerText = isLogin ? "Δεν έχεις λογαριασμό; Εγγραφή" : "Έχεις ήδη λογαριασμό; Σύνδεση";
}

document.querySelector('.main-btn-auth').onclick = function() {
    const email = document.querySelector('#auth-modal input[type="email"]').value;
    const pass = document.querySelector('#auth-modal input[type="password"]').value;
    if (!email || !pass) { alert("Συμπλήρωσε τα πεδία!"); return; }
    
    if (!isLogin) { 
        localStorage.setItem(email, pass);
        alert("Η εγγραφή πέτυχε! Τώρα κάντε Σύνδεση.");
        toggleAuthType();
    } else { 
        if (localStorage.getItem(email) === pass) {
            isLoggedIn = true;
            alert("Καλώς ήρθες!");
            document.querySelector('.auth-btn').innerText = "Account: " + email.split('@')[0];
            closeAuth();
            updateCartUI();
        } else { alert("Λάθος στοιχεία!"); }
    }
};

function openAuth() { document.getElementById('auth-modal').style.display = 'block'; }
function closeAuth() { document.getElementById('auth-modal').style.display = 'none'; }
function toggleCart() { document.getElementById('cart-drawer').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }
function closeAll() { closeAuth(); if(document.getElementById('cart-drawer').classList.contains('active')) toggleCart(); }