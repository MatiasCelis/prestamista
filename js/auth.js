// js/auth.js
import { supabase } from './config.js';

// UTIL: obtener elemento por varios ids posibles
const $ = (ids) => {
  if (!ids) return null;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
};

// IDs comunes en tus HTML
const loginBtn = $('login-btn','btnLogin');
const signupBtn = $('signup-btn');
const loginMsg = $('msg','login-msg');
const emailInput = $('email');
const passwordInput = $('password');
const logoutBtn = $('logout-btn','btnLogout');

// --- Función: verificar sesión ---
export async function verificarSesion() {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
      // Si no hay sesión y no estamos en login.html, redirigir.
      if (!window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
      }
    } else {
      // Si estamos en login y ya hay sesión -> ir a index
      if (window.location.pathname.endsWith('login.html')) {
        window.location.href = 'index.html';
      }
    }
  } catch (err) {
    console.error('Error verificando sesión', err);
  }
}

// --- Login / Signup (solo en login.html) ---
if (window.location.pathname.endsWith('login.html')) {
  // Conectar eventos si existen
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
} else {
  // En páginas privadas: comprobar sesión al cargar
  verificarSesion();

  // Conectar botón logout si existe
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
}
