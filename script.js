window.onload = function() {
    const user = localStorage.getItem('loggedUser');
    if (user) updateHeader(user);
};

function showForm(type) {
    // Κρύβουμε τα πάντα πρώτα
    document.getElementById('home-view').classList.remove('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');

    // Εμφανίζουμε αυτό που θέλουμε
    if (type === 'login') {
        document.getElementById('login-form').classList.add('active');
    } else if (type === 'signup') {
        document.getElementById('signup-form').classList.add('active');
    }
}

function register() {
    const username = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!username || !email || !pass) return alert("Συμπλήρωσε τα πεδία!");

    localStorage.setItem(email, JSON.stringify({ username, pass }));
    alert("Register επιτυχές! Κάνε τώρα Login.");
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
            // Επιστροφή στην αρχική εικόνα
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('home-view').classList.add('active');
        } else {
            alert("Λάθος κωδικός!");
        }
    } else {
        alert("Ο λογαριασμός δεν υπάρχει!");
    }
}

function updateHeader(name) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-display').style.display = 'flex';
    document.getElementById('welcome-name').innerText = "Γεια σου, " + name;
    document.getElementById('welcome-name').style.color = "#FFCC00";
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.reload();
}