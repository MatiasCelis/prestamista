import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginMsg = document.getElementById('msg');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

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
    if (!email || !password) return loginMsg.textContent = 'Completa email y contraseña';

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) loginMsg.textContent = '❌ ' + error.message;
    else window.location.href = 'index.html';
  });

  // --- Signup ---
  signupBtn?.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) return loginMsg.textContent = 'Completa email y contraseña';

    const { error } = await supabase.auth.signUp({ email, password });
    loginMsg.textContent = error ? '❌ ' + error.message : '✅ Revisa tu correo para confirmar.';
  });

  // --- Logout ---
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
});
