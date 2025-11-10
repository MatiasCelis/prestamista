// auth.js
import { supabase } from "./config.js";

// ======== LOGIN ========
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Error al iniciar sesión: " + error.message);
  } else {
    window.location.href = "index.html";
  }
}

// ======== LOGOUT ========
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// Eventos
document.getElementById("btnLogin")?.addEventListener("click", login);
document.getElementById("btnLogout")?.addEventListener("click", logout);

// Si el usuario no está logueado, redirigir
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  }
}
checkSession();
