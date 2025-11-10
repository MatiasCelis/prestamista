import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (ids) => {
    if (!ids) return null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  };

  const loginBtn = $('login-btn','btnLogin');
  const signupBtn = $('signup-btn');
  const loginMsg = $('msg','login-msg');
  const emailInput = $('email');
  const passwordInput = $('password');
  const logoutBtn = $('logout-btn','btnLogout');

  async function verificarSesion() {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        if (!window.location.pathname.endsWith('login.html')) {
          window.location.href = 'login.html';
        }
      } else {
        if (window.location.pathname.endsWith('login.html')) {
          window.location.href = 'index.html';
        }
      }
    } catch (err) {
      console.error('Error verificando sesión', err);
    }
  }

  // --- Login / Signup ---
  if (window.location.pathname.endsWith('login.html')) {
    loginBtn?.addEventListener('click', async () => {
      const email = emailInput?.value?.trim();
      const password = passwordInput?.value?.trim();
      if (!email || !password) {
        (loginMsg || console).textContent = 'Completa email y contraseña';
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      (loginMsg || console).textContent = error ? '❌ ' + error.message : '';
      if (!error) window.location.href = 'index.html';
    });

    signupBtn?.addEventListener('click', async () => {
      const email = emailInput?.value?.trim();
      const password = passwordInput?.value?.trim();
      if (!email || !password) {
        (loginMsg || console).textContent = 'Completa email y contraseña';
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      (loginMsg || console).textContent = error ? '❌ ' + error.message : '✅ Revisa tu correo para confirmar.';
    });
  } else {
    verificarSesion();
    logoutBtn?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});
