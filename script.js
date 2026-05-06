window.onload = function() {
    const user = localStorage.getItem('loggedUser');
    if (user) updateHeader(user);
};

function showForm(type) {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById(type + '-form').classList.add('active');
}

function register() {
    const username = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!username || !email || !pass) return alert("Συμπλήρωσε τα πεδία!");

    localStorage.setItem(email, JSON.stringify({ username, pass }));
    alert("Register επιτυχές! Κάνε login.");
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
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('home-view').style.display = 'block';
        } else { alert("Λάθος κωδικός!"); }
    } else { alert("Δεν υπάρχει λογαριασμός."); }
}

function updateHeader(name) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-display').style.display = 'flex';
    document.getElementById('welcome-name').innerText = "Hello, " + name;
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.reload();
}