// ============================================================
// STYLESPHERE — AUTHENTICATION LOGIC
// ============================================================

let currentUser = JSON.parse(localStorage.getItem('ss_currentUser') || 'null');
let users = JSON.parse(localStorage.getItem('ss_users') || '[]');

// Setup mock demo user if none exists
if (!users.find(u => u.email === 'demo@stylesphere.com')) {
  users.push({
    firstName: 'Demo', lastName: 'User',
    email: 'demo@stylesphere.com', phone: '9876543210', password: 'demo1234',
    address: { street: '', city: '', pin: '', state: '' }
  });
  localStorage.setItem('ss_users', JSON.stringify(users));
}

function openAuth(tab = 'login') {
  document.getElementById('authModal').classList.add('active');
  switchAuthTab(tab);
}

function closeAuth() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('signupTab').classList.toggle('active', tab === 'signup');
  document.getElementById('loginForm').classList.toggle('active', tab === 'login');
  document.getElementById('signupForm').classList.toggle('active', tab === 'signup');
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value;

  if (!email || !pw) {
    showToast('Please enter both email and password', 'warning');
    return;
  }

  const user = users.find(u => u.email === email && u.password === pw);
  if (user) {
    loginUser(user);
    showToast(`Welcome back, ${user.firstName}!`, 'success');
  } else {
    showToast('Invalid email or password', 'error');
  }
}

function handleSignup() {
  const firstName = document.getElementById('signupFirst').value.trim();
  const lastName = document.getElementById('signupLast').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const pw = document.getElementById('signupPassword').value;
  const pwConf = document.getElementById('signupConfirm').value;
  const terms = document.getElementById('agreeTerms').checked;

  if (!firstName || !email || !pw) {
    showToast('Please fill all required fields', 'warning');
    return;
  }
  if (!terms) {
    showToast('Please agree to the Terms & Conditions', 'warning');
    return;
  }
  if (pw !== pwConf) {
    showToast('Passwords do not match', 'error');
    return;
  }
  if (users.find(u => u.email === email)) {
    showToast('Email is already registered', 'error');
    return;
  }

  const newUser = {
    firstName, lastName, email, phone, password: pw,
    address: { street: '', city: '', pin: '', state: '' }
  };
  users.push(newUser);
  localStorage.setItem('ss_users', JSON.stringify(users));
  
  loginUser(newUser);
  showToast('Account created successfully! 🎉', 'success');
}

function loginUser(user) {
  currentUser = user;
  localStorage.setItem('ss_currentUser', JSON.stringify(user));
  closeAuth();
  updateAuthUI();
  populateProfileForm(); // If on profile page
}

function logout() {
  currentUser = null;
  localStorage.removeItem('ss_currentUser');
  updateAuthUI();
  showToast('You have been logged out', 'info');
  if (currentPage === 'profile' || currentPage === 'orders') {
    showPage('home');
  }
}

function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  const userMenu = document.getElementById('userMenu');
  
  if (currentUser) {
    authArea.classList.add('hidden');
    userMenu.classList.remove('hidden');
    
    // Set avatars and names
    const initials = currentUser.firstName.charAt(0) + (currentUser.lastName ? currentUser.lastName.charAt(0) : '');
    document.getElementById('userAvatarDisplay').textContent = initials.toUpperCase();
    document.getElementById('userNameDisplay').textContent = `Hi, ${currentUser.firstName}`;
  } else {
    authArea.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

function toggleUserDropdown() {
  document.getElementById('userDropdown').classList.toggle('hidden');
}

function closeDropdown() {
  document.getElementById('userDropdown').classList.add('hidden');
}

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
  if (currentUser) {
    const menu = document.getElementById('userMenu');
    if (menu && !menu.contains(e.target)) {
      document.getElementById('userDropdown').classList.add('hidden');
    }
  }
});

// Run on init
document.addEventListener('DOMContentLoaded', updateAuthUI);
