/* ============================================================
   KAAFALL ADMIN PANEL — script.js
   ============================================================ */

/* ── CREDENTIALS ──────────────────────────────────────────── */
const ADMIN_CREDENTIALS = {
  id:       'admin@kaafall',
  password: 'Kaafall@2025'
};

const SESSION_KEY = 'kaafall_admin_auth';


/* ── AUTH HELPERS ─────────────────────────────────────────── */

/**
 * Save session (supports "remember me" via localStorage,
 * otherwise sessionStorage so it clears on tab close).
 */
function saveSession(remember) {
  const payload = JSON.stringify({ loggedIn: true, ts: Date.now() });
  if (remember) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
  }
}

/** Return true if a valid session exists. */
function isLoggedIn() {
  const data =
    localStorage.getItem(SESSION_KEY) ||
    sessionStorage.getItem(SESSION_KEY);
  if (!data) return false;
  try {
    return JSON.parse(data).loggedIn === true;
  } catch (_) {
    return false;
  }
}

/** Clear session from both storages. */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}


/* ── LOGIN PAGE LOGIC ─────────────────────────────────────── */

/** Called when the Sign In button is clicked. */
function handleLogin() {
  const idInput   = document.getElementById('adminId');
  const passInput = document.getElementById('adminPass');
  const errorBox  = document.getElementById('loginError');
  const btnText   = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const loginBtn  = document.getElementById('loginBtn');
  const remember  = document.getElementById('rememberMe').checked;

  const enteredId   = idInput.value.trim();
  const enteredPass = passInput.value;

  // Clear previous error state
  errorBox.classList.remove('show');
  idInput.classList.remove('error');
  passInput.classList.remove('error');

  // Basic empty-field check
  if (!enteredId || !enteredPass) {
    showError('Please enter both Admin ID and Password.');
    if (!enteredId) idInput.classList.add('error');
    if (!enteredPass) passInput.classList.add('error');
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  btnText.style.display   = 'none';
  btnLoader.style.display = 'inline';

  // Simulate a short network delay for realism
  setTimeout(() => {
    if (
      enteredId   === ADMIN_CREDENTIALS.id &&
      enteredPass === ADMIN_CREDENTIALS.password
    ) {
      saveSession(remember);
      // Redirect to the dashboard
      window.location.href = 'index.html';
    } else {
      loginBtn.disabled = false;
      btnText.style.display   = 'inline';
      btnLoader.style.display = 'none';
      idInput.classList.add('error');
      passInput.classList.add('error');
      showError('Invalid ID or password. Please try again.');
      passInput.value = '';   // clear password on failure
      passInput.focus();
    }
  }, 900);
}

/** Show the error banner with a message. */
function showError(msg) {
  const errorBox = document.getElementById('loginError');
  if (!errorBox) return;
  errorBox.textContent = '⚠️ ' + msg;
  errorBox.classList.add('show');
  // Force re-trigger the shake animation
  errorBox.style.animation = 'none';
  void errorBox.offsetHeight;
  errorBox.style.animation = '';
}

/** Toggle password visibility. */
function togglePassword() {
  const passInput  = document.getElementById('adminPass');
  const toggleBtn  = document.getElementById('togglePass');
  if (!passInput) return;
  if (passInput.type === 'password') {
    passInput.type   = 'text';
    toggleBtn.textContent = '🙈';
  } else {
    passInput.type   = 'password';
    toggleBtn.textContent = '👁';
  }
}

/** Placeholder forgot-password action. */
function showForgot() {
  alert('Please contact your system administrator to reset your password.');
}

/** Allow Enter key to submit the login form. */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    // Only trigger on login page
    if (document.getElementById('loginBtn')) {
      handleLogin();
    }
  }
});

/** Click on a credential code chip to auto-fill. */
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'CODE') {
    const text = e.target.textContent.trim();
    const idInput   = document.getElementById('adminId');
    const passInput = document.getElementById('adminPass');
    if (!idInput || !passInput) return;
    if (text === ADMIN_CREDENTIALS.id) {
      idInput.value = text;
    } else if (text === ADMIN_CREDENTIALS.password) {
      passInput.value = text;
    }
  }
});


/* ── DASHBOARD / INDEX PAGE LOGIC ────────────────────────── */

/**
 * Guard: if this page requires login and user is not authenticated,
 * redirect to login page. Call this at the top of index.html via
 * a script tag, or it runs automatically when loaded on the dashboard.
 */
function guardPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

/** Logout — clear session and redirect to login. */
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

/** Toggle the sidebar open/closed (mobile). */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

/** Close the sidebar and hide overlay. */
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/**
 * Switch active nav page.
 * @param {string} name - Display name of the page
 */
function setPage(name) {
  document.getElementById('topbar-title').textContent = name;
  document.getElementById('crumb').textContent = name;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if (window.innerWidth < 900) closeSidebar();
}


/* ── AUTO-GUARD ON DASHBOARD ─────────────────────────────── */
(function () {
  // If we are NOT on login.html, enforce authentication
  if (!window.location.pathname.includes('login.html')) {
    guardPage();
  }
})();
