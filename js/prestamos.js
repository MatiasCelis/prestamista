// js/prestamos.js
import { supabase } from './config.js';

// =====================
// SELECTORES
// =====================
const tabla = document.getElementById('tabla');
const filtroSelect = document.getElementById('filtro');
const msgEl = document.getElementById('msg');
const modal = document.getElementById('modalConfirmacion');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnCancelar = document.getElementById('btnCancelar');

let prestamoSeleccionado = null; // guardará el préstamo a cambiar

// =====================
// FUNCIONES
// =====================
async function obtenerPrestamos(filtro = 'pendiente') {
  let query = supabase
    .from('prestamos')
    .select('id, cliente_id, monto, estado') // 👈 SIN el join
    .order('id', { ascending: false });

  if (filtro !== 'todos') query = query.eq('estado', filtro);

  const { data, error } = await query;
  if (error) {
    console.error('❌ Error al obtener préstamos:', error);
    throw error;
  }
  console.log('✅ Prestamos obtenidos:', data);
  return data || [];
}


async function actualizarEstadoPrestamo(id, nuevoEstado) {
  const { error } = await supabase
    .from('prestamos')
    .update({ estado: nuevoEstado })
    .eq('id', id);

  if (error) throw error;
  return true;
}

// =====================
// RENDER TABLA
// =====================
async function renderPrestamos() {
  try {
    const filtro = filtroSelect?.value || 'pendiente';
    const prestamos = await obtenerPrestamos(filtro);

    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    if (!prestamos.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay préstamos ${filtro}</td></tr>`;
      return;
    }

    prestamos.forEach((p) => {
      const tr = document.createElement('tr');

      const estadoBtn = document.createElement('button');
      estadoBtn.textContent = p.estado === 'listo' ? '✅ Listo' : '⏳ Pendiente';
      estadoBtn.className = p.estado === 'listo' ? 'btn-listo' : 'btn-pendiente';

      estadoBtn.addEventListener('click', () => {
        prestamoSeleccionado = p;
        abrirModal(`¿Actualizar estado del préstamo de ${p.clientes?.nombre || 'cliente'}?`);
      });

      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.clientes?.nombre || '—'}</td>
        <td>$${p.monto?.toLocaleString()}</td>
        <td>${p.estado}</td>
      `;

      const tdAccion = document.createElement('td');
      tdAccion.appendChild(estadoBtn);
      tr.appendChild(tdAccion);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    msgEl.textContent = '❌ Error al cargar préstamos';
  }
}

// =====================
// MODAL
// =====================
function abrirModal(mensaje) {
  document.getElementById('modalMensaje').textContent = mensaje;
  modal.style.display = 'flex';
}

function cerrarModal() {
  modal.style.display = 'none';
  prestamoSeleccionado = null;
}

// =====================
// EVENTOS
// =====================
filtroSelect?.addEventListener('change', renderPrestamos);

btnConfirmar?.addEventListener('click', async () => {
  if (!prestamoSeleccionado) return;
  try {
    const nuevoEstado = prestamoSeleccionado.estado === 'listo' ? 'pendiente' : 'listo';
    await actualizarEstadoPrestamo(prestamoSeleccionado.id, nuevoEstado);
    msgEl.textContent = `✅ Estado actualizado a ${nuevoEstado}`;
    cerrarModal();
    renderPrestamos();
  } catch (err) {
    console.error(err);
    msgEl.textContent = '❌ Error al actualizar estado';
  }
});

btnCancelar?.addEventListener('click', cerrarModal);

// =====================
// INICIO
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderPrestamos(); // por defecto "pendientes"
});
