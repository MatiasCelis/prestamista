import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn'); // opcional: ocultar
  const logoutBtn = document.getElementById('logout-btn');
  const loginMsg = document.getElementById('msg');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // ✅ Ocultar botón de signup
  if (signupBtn) signupBtn.style.display = 'none';

  // --- Verificar sesión ---
  async function verificarSesion() {
    const { data } = await supabase.auth.getSession();
    if (!data?.session && !window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    } else if (data?.session && window.location.pathname.endsWith('login.html')) {
      window.location.href = 'index.html';
    }
  }

  verificarSesion();

  // --- Login ---
  loginBtn?.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      loginMsg.textContent = 'Completa email y contraseña';
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) loginMsg.textContent = '❌ ' + error.message;
    else window.location.href = 'index.html';
  });

  // --- Logout ---
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
});
