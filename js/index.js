// js/index.js
import { supabase } from './config.js';

const tbody = document.querySelector('#tabla tbody');
const filtro = document.getElementById('filtro');
const logoutBtn = document.getElementById('logout');

// Cargar préstamos con filtro
async function cargarPrestamos() {
  let query = supabase
    .from('prestamos')
    .select('*')
    .order('fecha_prestamo', { ascending: false });

  if (filtro.value !== 'todos') {
    query = query.eq('estado', filtro.value);
  }

  const { data, error } = await query;
  if (error) return alert(error.message);

  tbody.innerHTML = '';
  data.forEach(p => {
    const row = `
      <tr>
        <td>${p.monto.toLocaleString()}</td>
        <td>${p.interes_porcentaje}%</td>
        <td>${p.interes_monto?.toLocaleString() ?? '-'}</td>
        <td>${p.total?.toLocaleString() ?? '-'}</td>
        <td>${p.fecha_prestamo ?? '-'}</td>
        <td>${p.fecha_vencimiento ?? '-'}</td>
        <td>${p.estado ?? 'pendiente'}</td>
      </tr>`;
    tbody.innerHTML += row;
  });
}

filtro.addEventListener('change', cargarPrestamos);
cargarPrestamos();

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
});
