// js/clientes.js
import { supabase } from './config.js';

const nombre = document.getElementById('nombre');
const telefono = document.getElementById('telefono');
const notas = document.getElementById('notas');
const msg = document.getElementById('msg');
const guardarBtn = document.getElementById('guardar');
const logoutBtn = document.getElementById('logout');

// Crear cliente
guardarBtn.addEventListener('click', async () => {
  const nombreVal = nombre.value.trim();
  const telefonoVal = telefono.value.trim();
  const notasVal = notas.value.trim();

  if (!nombreVal) {
    msg.textContent = '⚠️ Debes ingresar el nombre del cliente.';
    msg.style.color = 'red';
    return;
  }

  const { error } = await supabase
    .from('clientes')
    .insert([{ nombre: nombreVal, telefono: telefonoVal, notas: notasVal }]);

  if (error) {
    msg.textContent = '❌ ' + error.message;
    msg.style.color = 'red';
  } else {
    msg.textContent = '✅ Cliente creado correctamente.';
    msg.style.color = 'green';
    nombre.value = '';
    telefono.value = '';
    notas.value = '';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
});
