import { supabase } from './config.js';

// --- LOGIN ---
document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) return alert('Por favor, completa ambos campos.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert('❌ ' + error.message);
  } else {
    alert('✅ Sesión iniciada');
    window.location.href = 'index.html';
  }
});

// --- LOGOUT ---
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  alert('👋 Sesión cerrada');
  window.location.href = 'login.html';
});

// --- CHECK SESSION ---
export async function verificarSesion() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
  }
}
