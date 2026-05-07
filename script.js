let cart = [];

function showView(viewId) {
    // Κρύβει όλα τα views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.form-box').forEach(f => f.classList.remove('active'));
    
    // Δείχνει το σωστό
    document.getElementById(viewId).classList.add('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('phone-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectBrand(brand) {
    alert("Επιλέξατε: " + brand);
    document.querySelector('.select-btn').innerText = brand;
    toggleDropdown();
}

function addToCart() {
    const brand = document.querySelector('.select-btn').innerText;
    if(brand === "Select Phone") return alert("Παρακαλώ επιλέξτε κινητό!");
    
    cart.push("Tung Tung Case for " + brand);
    alert("Προστέθηκε στο καλάθι!");
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    if(cart.length === 0) {
        container.innerHTML = "<p>Το καλάθι είναι άδειο.</p>";
    } else {
        container.innerHTML = cart.map(item => `<p>✅ ${item} - 10€</p>`).join('');
    }
}

// Οι συναρτήσεις login/register παραμένουν ίδιες με πριν