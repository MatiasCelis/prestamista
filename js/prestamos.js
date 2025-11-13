// js/prestamos.js
import { supabase } from './config.js';
import { buscarClientes } from './clientes.js';

// =====================
// SELECTORES GENERALES
// =====================
const tabla = document.getElementById('tablaPrestamos');
const msgEl = document.getElementById('msg');

// =====================
// FUNCIONES PRINCIPALES
// =====================
async function obtenerPrestamos() {
  const { data, error } = await supabase
    .from('prestamos')
    .select(`
      id,
      cliente_id,
      monto,
      estado,
      clientes ( nombre )
    `)
    .order('id', { ascending: false });

  if (error) throw error;
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
// RENDER DE TABLA (INDEX)
// =====================
async function renderPrestamos() {
  try {
    const prestamos = await obtenerPrestamos();
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    prestamos.forEach((p) => {
      const tr = document.createElement('tr');

      const estadoBtn = document.createElement('button');
      estadoBtn.textContent = p.estado === 'listo' ? '✅ Listo' : '⏳ Pendiente';
      estadoBtn.className = p.estado === 'listo' ? 'btn-listo' : 'btn-pendiente';
      estadoBtn.addEventListener('click', async () => {
        estadoBtn.disabled = true;
        const nuevoEstado = p.estado === 'listo' ? 'pendiente' : 'listo';
        try {
          await actualizarEstadoPrestamo(p.id, nuevoEstado);
          msgEl.textContent = `✅ Estado actualizado a ${nuevoEstado}`;
          await renderPrestamos();
        } catch (err) {
          console.error(err);
          msgEl.textContent = '❌ Error al actualizar estado';
        } finally {
          estadoBtn.disabled = false;
        }
      });

      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.clientes?.nombre || '—'}</td>
        <td>$${p.monto?.toLocaleString()}</td>
        <td>${p.estado || 'pendiente'}</td>
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
// NUEVO PRÉSTAMO (AGREGAR.HTML)
// =====================
const selectCliente = document.getElementById('selectCliente');
const montoInput = document.getElementById('monto');
const interesInput = document.getElementById('interes');
const btnAgregar = document.getElementById('btnAgregarPrestamo');
const btnIrClientes = document.getElementById('btnIrClientes');
const btnVolverAlInicio = document.getElementById('btnVolverAlInicio');

async function cargarClientes() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre')
      .order('nombre', { ascending: true });

    if (error) throw error;

    if (selectCliente) {
      selectCliente.innerHTML = '<option value="">Selecciona un cliente</option>';
      data.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.nombre;
        selectCliente.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Error cargando clientes:', err);
    if (selectCliente) {
      selectCliente.innerHTML = '<option value="">❌ Error al cargar clientes</option>';
    }
  }
}

async function agregarPrestamo() {
  try {
    const clienteId = parseInt(selectCliente?.value || 0);
    const monto = parseFloat(montoInput?.value || 0);
    const interes = parseFloat(interesInput?.value || 20);

    if (!clienteId) {
      msgEl.textContent = '⚠️ Selecciona un cliente válido';
      return;
    }
    if (!monto || monto <= 0) {
      msgEl.textContent = '⚠️ Ingresa un monto válido';
      return;
    }

    const { error } = await supabase.from('prestamos').insert([
      {
        cliente_id: clienteId,
        monto,
        interes_porcentaje: interes
      }
    ]);
    if (error) throw error;

    msgEl.textContent = '✅ Préstamo guardado correctamente';
    montoInput.value = '';
    interesInput.value = '20';
    selectCliente.value = '';
  } catch (err) {
    console.error('Error agregando préstamo', err);
    msgEl.textContent = '❌ ' + (err.message || err);
  }
}

// =====================
// INICIALIZACIÓN AUTOMÁTICA
// =====================
document.addEventListener('DOMContentLoaded', () => {
  if (tabla) renderPrestamos(); // solo en index.html
  if (selectCliente) cargarClientes(); // solo en agregar.html

  btnAgregar?.addEventListener('click', (e) => {
    e.preventDefault();
    agregarPrestamo();
  });

  btnIrClientes?.addEventListener('click', () => {
    window.location.href = 'cliente.html';
  });

  btnVolverAlInicio?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
