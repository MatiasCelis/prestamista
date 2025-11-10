import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (ids) => {
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

  if (window.location.pathname.endsWith('login.html')) {
    loginBtn?.addEventListener('click', async () => {
      const email = emailInput?.value?.trim();
      const password = passwordInput?.value?.trim();
      if (!email || !password) {
        (loginMsg || console).textContent = 'Completa email y contraseña';
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        (loginMsg || console).textContent = '❌ ' + error.message;
      } else {
        window.location.href = 'index.html';
      }
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
  }
});
