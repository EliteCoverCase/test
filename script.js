// Έλεγχος αν ο χρήστης είναι ήδη συνδεδεμένος
window.onload = function() {
    const user = localStorage.getItem('loggedUser');
    if (user) {
        updateHeader(user);
    }
};

function showForm(type) {
    // Κρύψε την αρχική και τις φόρμες
    document.getElementById('home-view').classList.remove('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');

    // Δείξε τη σωστή φόρμα
    document.getElementById(type + '-form').classList.add('active');
}

function register() {
    const username = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!username || !email || !pass) return alert("Συμπλήρωσε όλα τα πεδία!");

    localStorage.setItem(email, JSON.stringify({ username, pass }));
    alert("Εγγραφή επιτυχής! Κάνε login.");
    showForm('login');
}

function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const stored = localStorage.getItem(email);

    if (stored) {
        const userObj = JSON.parse(stored);
        if (userObj.pass === pass) {
            localStorage.setItem('loggedUser', userObj.username);
            updateHeader(userObj.username);
            // Επιστροφή στην αρχική
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('home-view').classList.add('active');
        } else {
            alert("Λάθος κωδικός!");
        }
    } else {
        alert("Ο χρήστης δεν υπάρχει.");
    }
}

function updateHeader(name) {
    document.getElementById('auth-section').style.display = 'none';
    const display = document.getElementById('user-display');
    display.style.display = 'flex';
    document.getElementById('welcome-name').innerText = name;
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.reload();
}