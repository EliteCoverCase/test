let cart = [];
let currentUser = localStorage.getItem('loggedUser') || null;

window.onload = function() {
    if (currentUser) updateHeader(currentUser);
    updateCartUI();
};

function showView(viewId) {
    document.querySelectorAll('.view, .form-box').forEach(el => el.style.display = 'none');
    const target = document.getElementById(viewId);
    if (target) target.style.display = (viewId.includes('form')) ? 'block' : 'block';
    
    // Ειδική ρύθμιση για views vs forms
    if(viewId.endsWith('-view')) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }
}

function showForm(type) {
    showView(type + '-form');
}

// DROPDOWN FIX
function toggleDropdown() {
    const dd = document.getElementById('phone-dropdown');
    dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
}

function selectBrand(brand) {
    document.getElementById('selected-phone-btn').innerText = brand;
    toggleDropdown();
}

// CART LOGIC WITH LOGIN CHECK
function addToCart() {
    if (!currentUser) {
        alert("Πρέπει να συνδεθείς για να προσθέσεις στο καλάθι!");
        showForm('login');
        return;
    }

    const brand = document.getElementById('selected-phone-btn').innerText;
    if (brand === "select phone") {
        alert("Επίλεξε πρώτα κινητό!");
        return;
    }

    cart.push({ name: "Tung Tung Case", brand: brand, price: 10 });
    alert("Προστέθηκε στο καλάθι!");
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const list = document.getElementById('cart-items-list');
    if (cart.length === 0) {
        list.innerHTML = "<p>Το καλάθι είναι άδειο.</p>";
    } else {
        list.innerHTML = cart.map((item, index) => 
            `<p>✅ ${item.name} (${item.brand}) - ${item.price}€</p>`
        ).join('');
    }
}

// LOGIN & REGISTER FIX
function register() {
    const user = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!user || !email || !pass) return alert("Συμπλήρωσε τα πάντα!");
    localStorage.setItem(email, JSON.stringify({ user, pass }));
    alert("Εγγραφή επιτυχής!");
    showForm('login');
}

function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const data = localStorage.getItem(email);

    if (data) {
        const obj = JSON.parse(data);
        if (obj.pass === pass) {
            currentUser = obj.user;
            localStorage.setItem('loggedUser', currentUser);
            updateHeader(currentUser);
            showView('home-view');
        } else { alert("Λάθος κωδικός!"); }
    } else { alert("Ο χρήστης δεν βρέθηκε!"); }
}

function updateHeader(name) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-display').style.display = 'flex';
    document.getElementById('welcome-name').innerText = "Hello, " + name;
}

function logout() {
    localStorage.removeItem('loggedUser');
    location.reload();
}