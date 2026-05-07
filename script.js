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
// 2. Η ΛΙΣΤΑ ΜΕ ΤΙΣ ΘΗΚΕΣ ΣΟΥ (CUSTOM ΟΝΟΜΑΤΑ)
// ==========================================
const customProducts = [
    { id: 1, name: "Tung Tung Tung Sahur Case", price: 10, img: "images/case1.png" },
    { id: 2, name: "Bombardilo Crocodilo Case", price: 10, img: "images/case2.png" },
    { id: 3, name: "Dark Nebula Case", price: 10, img: "images/case3.png" },
    { id: 4, name: "Solar Flare Cover", price: 10, img: "images/case4.png" },
    { id: 5, name: "Deep Space Case", price: 10, img: "images/case5.png" },
    { id: 6, name: "Cosmic Star", price: 10, img: "images/case6.png" },
    { id: 7, name: "Orion Nebula", price: 10, img: "images/case7.png" },
    { id: 8, name: "Supernova Red", price: 10, img: "images/case8.png" },
    { id: 9, name: "Milky Way Blue", price: 10, img: "images/case9.png" },
    { id: 10, name: "Asteroid Grey", price: 10, img: "images/case10.png" },
    { id: 11, name: "Lunar Eclipse", price: 10, img: "images/case11.png" },
    { id: 12, name: "Star Dust Special", price: 10, img: "images/case12.png" },
    { id: 13, name: "Black Hole Matte", price: 10, img: "images/case13.png" },
    { id: 14, name: "Comet Tail", price: 10, img: "images/case14.png" },
    { id: 15, name: "Alien Tech Case", price: 10, img: "images/case15.png" },
    { id: 16, name: "Gravity Zero", price: 10, img: "images/case16.png" },
    { id: 17, name: "Infinity Case", price: 10, img: "images/case17.png" },
    { id: 18, name: "Mars Explorer", price: 10, img: "images/case18.png" },
    { id: 19, name: "Jupiter Storm", price: 10, img: "images/case19.png" },
    { id: 20, name: "Zenith Case", price: 10, img: "images/case20.png" }
];

// Εμφάνιση προϊόντων στο Grid
const productList = document.getElementById('product-list');
if (productList) {
    productList.innerHTML = ""; 
    customProducts.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <div class="img-container">
                    <img src="${product.img}" alt="${product.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/200x250?text=Missing+PNG';">
                </div>
                <h3>${product.name}</h3>
                <p style="color:#e0aaff; margin: 10px 0; font-weight:bold;">${product.price.toFixed(2)}€</p>
                <button class="add-btn" onclick="addToCart('${product.name}', ${product.price})">ΣΤΟ ΚΑΛΑΘΙ</button>
            </div>
        `;
    });
}

// ==========================================
// 3. ΣΥΣΤΗΜΑ LOGIN / REGISTER
// ==========================================
const authBtnAction = document.querySelector('.main-btn-auth');
if (authBtnAction) {
    authBtnAction.onclick = function() {
        const email = document.querySelector('#auth-modal input[type="email"]').value;
        const pass = document.querySelector('#auth-modal input[type="password"]').value;

        if (!email || !pass) {
            alert("Συμπλήρωσε όλα τα πεδία!");
            return;
        }

        if (!isLogin) { 
            localStorage.setItem(email, pass);
            alert("Εγγραφή επιτυχής! Τώρα κάνε Σύνδεση.");
            toggleAuthType();
        } else { 
            const storedPass = localStorage.getItem(email);
            if (storedPass && storedPass === pass) {
                isLoggedIn = true;
                alert("Καλώς ήρθες στο EliteCoverCase!");
                document.querySelector('.auth-btn').innerText = "Account: " + email.split('@')[0];
                document.querySelector('.auth-btn').style.borderColor = "#28a745";
                closeAuth();
                updateCartUI();
            } else {
                alert("Λάθος email ή κωδικός!");
            }
        }
    };
}

function toggleAuthType() {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerText = isLogin ? "Σύνδεση" : "Εγγραφή";
    document.querySelector('.main-btn-auth').innerText = isLogin ? "Είσοδος" : "Δημιουργία Λογαριασμού";
    document.getElementById('auth-switch').innerText = isLogin ? "Δεν έχεις λογαριασμό; Εγγραφή" : "Έχεις ήδη λογαριασμό; Σύνδεση";
}

// ==========================================
// 4. ΚΑΛΑΘΙ & PAYPAL
// ==========================================
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    if(!document.getElementById('cart-drawer').classList.contains('active')) toggleCart();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach((item) => {
        total += item.price;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #3c096c; padding-bottom:5px;">
                <span>${item.name}</span>
                <span><b>${item.price}€</b></span>
            </div>
        `;
    });
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    if(cart.length > 0) {
        if(isLoggedIn) {
            renderPayPal(total);
        } else {
            paypalContainer.innerHTML = `
                <div style="text-align:center; padding:10px; background:rgba(255,255,255,0.05); border-radius:10px;">
                    <p style="color:#e0aaff; font-size:12px; margin-bottom:10px;">Login για να ξεκλειδώσει το PayPal</p>
                    <button class="add-btn" onclick="openAuth()">ΣΥΝΔΕΣΗ</button>
                </div>`;
        }
    }
}

function renderPayPal(totalAmount) {
    paypal.Buttons({
        onClick: function(data, actions) {
            const phone = document.getElementById('customer-phone').value;
            if (phone.length < 10) {
                document.getElementById('phone-error').style.display = 'block';
                return actions.reject();
            }
            return actions.resolve();
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
                const itemsStr = cart.map(i => i.name).join(", ");
                
                // Αποστολή Email
                sendOrderEmail(details.payer.name.given_name, phone, itemsStr, totalAmount);
                
                alert('Η παραγγελία πέτυχε! Σας στείλαμε email στο ' + details.payer.email_address);
                cart = [];
                updateCartUI();
                toggleCart();
            });
        }
    }).render('#paypal-button-container');
}

function sendOrderEmail(name, phone, items, total) {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        customer_phone: phone,
        order_items: items,
        total_price: total + "€"
    });
}

// Modals
function openAuth() { document.getElementById('auth-modal').style.display = 'block'; }
function closeAuth() { document.getElementById('auth-modal').style.display = 'none'; }
function closeAll() { closeAuth(); if(document.getElementById('cart-drawer').classList.contains('active')) toggleCart(); }