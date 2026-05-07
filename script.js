// ==========================================
// 1. ΡΥΘΜΙΣΕΙΣ (Βάλε τα δικά σου κλειδιά εδώ)
// ==========================================
const EMAILJS_PUBLIC_KEY = "7cDMjJn9hC9K7ULgA"; // Από το Account -> API Keys
const EMAILJS_SERVICE_ID = "service_xj8pfgk"; // Αυτό που είδα στην εικόνα σου
const EMAILJS_TEMPLATE_ID = "template_ugdqs69"; // Από το Email Templates

emailjs.init(EMAILJS_PUBLIC_KEY);

let isLoggedIn = false;
let cart = [];

// ==========================================
// 2. ΔΗΜΙΟΥΡΓΙΑ 20 ΠΡΟΪΟΝΤΩΝ
// ==========================================
const products = [];
for (let i = 1; i <= 20; i++) {
    products.push({
        id: i,
        name: `Elite Space Case #${i}`,
        price: 10,
        img: `https://picsum.photos/400/500?random=${i}`
    });
}

// Εμφάνιση στο Site
const productList = document.getElementById('product-list');
products.forEach(product => {
    productList.innerHTML += `
        <div class="product-card">
            <img src="${product.img}">
            <h3>${product.name}</h3>
            <p style="color:#e0aaff; margin: 10px 0; font-weight:bold;">10.00€</p>
            <button class="add-btn" onclick="addToCart(${product.id})">ΣΤΟ ΚΑΛΑΘΙ</button>
        </div>
    `;
});

// ==========================================
// 3. ΔΙΑΧΕΙΡΙΣΗ LOGIN / REGISTER
// ==========================================
function handleLogin() {
    // Απλή προσομοίωση login
    isLoggedIn = true;
    alert("Επιτυχής σύνδεση στο EliteCoverCase!");
    document.querySelector('.auth-btn').innerText = "Account: Active";
    document.querySelector('.auth-btn').style.borderColor = "#28a745";
    closeAuth();
    updateCartUI(); // Ενημέρωση για να εμφανιστεί το PayPal
}

// Σύνδεση του κουμπιού του Modal με τη λειτουργία
document.querySelector('.main-btn-auth').addEventListener('click', handleLogin);

function openAuth() { document.getElementById('auth-modal').style.display = 'block'; }
function closeAuth() { document.getElementById('auth-modal').style.display = 'none'; }
function closeAll() { 
    closeAuth(); 
    if(document.getElementById('cart-drawer').classList.contains('active')) toggleCart(); 
}

// ==========================================
// 4. ΛΕΙΤΟΥΡΓΙΕΣ ΚΑΛΑΘΙΟΥ
// ==========================================
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartUI();
    if(!document.getElementById('cart-drawer').classList.contains('active')) toggleCart();
}

function updateCartUI() {
    // Ενημέρωση αριθμού στο εικονίδιο
    document.getElementById('cart-count').innerText = cart.length;
    
    // Ενημέρωση λίστας προϊόντων
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = "";
    let total = cart.length * 10;
    
    cart.forEach((item) => {
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #3c096c; padding-bottom:5px; font-size:14px;">
                <span>${item.name}</span>
                <span><b>10€</b></span>
            </div>
        `;
    });
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
    
    // Έλεγχος αν θα δείξουμε το PayPal ή το μήνυμα για Login
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    if(cart.length > 0) {
        if(isLoggedIn) {
            renderPayPal(); // Δείξε το κουμπί πληρωμής
        } else {
            paypalContainer.innerHTML = `
                <div style="background: rgba(157,78,221,0.1); padding: 15px; border-radius: 10px; text-align: center; border: 1px dashed var(--primary);">
                    <p style="color:#e0aaff; font-size: 14px; margin-bottom: 10px;">Πρέπει να είστε συνδεδεμένος για να προχωρήσετε.</p>
                    <button class="add-btn" onclick="openAuth()">LOGIN ΤΩΡΑ</button>
                </div>`;
        }
    }
}

// ==========================================
// 5. PAYPAL INTEGRATION & EMAIL SENDING
// ==========================================
function renderPayPal() {
    paypal.Buttons({
        // Έλεγχος εγκυρότητας κινητού πριν την πληρωμή
        onClick: function(data, actions) {
            const phone = document.getElementById('customer-phone').value;
            if (phone.length < 10) {
                document.getElementById('phone-error').style.display = 'block';
                return actions.reject();
            } else {
                document.getElementById('phone-error').style.display = 'none';
                return actions.resolve();
            }
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "EliteCoverCase Order",
                    amount: { value: (cart.length * 10).toString() }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                const phone = document.getElementById('customer-phone').value;
                const itemsStr = cart.map(i => i.name).join(", ");
                
                // Αποστολή Email στον Σπύρο
                sendOrderEmail(details.payer.name.given_name, phone, itemsStr, cart.length * 10);
                
                alert('Ευχαριστούμε ' + details.payer.name.given_name + '! Η παραγγελία καταχωρήθηκε. Θα λάβετε SMS στο ' + phone);

                // Καθαρισμός καλαθιού
                cart = [];
                updateCartUI();
                toggleCart();
            });
        }
    }).render('#paypal-button-container');
}

// Λειτουργία αποστολής Email μέσω EmailJS
function sendOrderEmail(customerName, phone, items, total) {
    const templateParams = {
        from_name: customerName,
        customer_phone: phone,
        order_items: items,
        total_price: total + "€"
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function(response) {
       console.log('Email Sent Successfully!', response.status, response.text);
    }, function(error) {
       console.log('Failed to send email...', error);
    });
}