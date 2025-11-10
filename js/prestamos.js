// js/prestamos.js
import { supabase } from './config.js';

// SELECTORES tolerantes
const tablaBody = document.querySelector('#tabla-prestamos tbody') || document.querySelector('#tabla tbody') || null;
const filtroSelect = document.getElementById('filtro') || document.getElementById('filtro-status') || null;
const btnAgregar = document.getElementById('btnAgregarPrestamo') || document.getElementById('guardar') || null;
const clienteInput = document.getElementById('cliente');
const resultados = document.getElementById('resultados') || document.getElementById('resultadosClientes') || null;
const montoInput = document.getElementById('monto');
const interesInput = document.getElementById('interes');
const msgEl = document.getElementById('msg') || null;

// Cargar préstamos (filtrado por estado si se pasa)
export async function cargarPrestamos(estado = 'pendiente') {
  try {
    let query = supabase
      .from('prestamos')
      // Trae también datos del cliente relacionado (nombre)
      .select('id, cliente_id, monto, interes_porcentaje, interes_monto, total, fecha_prestamo, fecha_vencimiento, estado, clientes!inner(nombre)')
      .order('fecha_prestamo', { ascending: false });

    if (estado && estado !== 'todos') {
      query = query.eq('estado', estado);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Renderizar tabla
    const rows = data.map(p => {
      const clienteNombre = p.clientes?.nombre || '';
      // interes_monto y total pueden venir desde el DB (generated columns). Si no, calculemos
      const interesMonto = p.interes_monto ?? Math.round((p.monto * (p.interes_porcentaje ?? 20)) / 100);
      const total = p.total ?? Math.round(p.monto + interesMonto);
      return `
        <tr>
          <td>${clienteNombre}</td>
          <td>${Number(p.monto).toLocaleString()}</td>
          <td>${Number(p.interes_porcentaje ?? 20)}%</td>
          <td>${Number(interesMonto).toLocaleString()}</td>
          <td>${Number(total).toLocaleString()}</td>
          <td>${p.fecha_prestamo}</td>
          <td>${p.fecha_vencimiento}</td>
          <td>${p.estado}</td>
        </tr>
      `;
    }).join('');

    if (tablaBody) tablaBody.innerHTML = rows;
  } catch (err) {
    console.error('Error cargando prestamos', err);
    if (tablaBody) tablaBody.innerHTML = `<tr><td colspan="8">Error al cargar</td></tr>`;
  }
}

// Agregar préstamo (toma cliente seleccionado por data-selected-id o por selección en UL)
export async function agregarPrestamo() {
  try {
    const monto = parseFloat(montoInput?.value || 0);
    const interes = parseFloat(interesInput?.value || 20);
    let clienteId = null;

    // buscar cliente id en el atributo data-selected-id (setear por clientes.js cuando se selecciona)
    if (clienteInput?.dataset?.selectedId) {
      clienteId = parseInt(clienteInput.dataset.selectedId);
    } else {
      // fallback: intentar buscar cliente por nombre exacto y usar el primer resultado
      const nombre = (clienteInput?.value || '').trim();
      if (nombre.length >= 3) {
        const { data } = await supabase.from('clientes').select('id').ilike('nombre', nombre).limit(1);
        if (data?.length) clienteId = data[0].id;
      }
    }

    if (!clienteId) {
      if (msgEl) msgEl.textContent = '⚠️ Selecciona un cliente válido';
      else alert('Selecciona un cliente válido');
      return;
    }
    if (!monto || monto <= 0) {
      if (msgEl) msgEl.textContent = '⚠️ Ingresa un monto válido';
      return;
    }

    // Inserción: solo cliente_id e interes_porcentaje y monto; triggers en DB asignan user_id, calculan total, vencimiento si los definiste
    const { error } = await supabase.from('prestamos').insert([{
      cliente_id: clienteId,
      monto,
      interes_porcentaje: interes
    }]);

    if (error) throw error;

    if (msgEl) msgEl.textContent = '✅ Préstamo guardado';
    // limpiar/recargar
    if (clienteInput) { clienteInput.value = ''; delete clienteInput.dataset.selectedId; }
    if (montoInput) montoInput.value = '';
    if (interesInput) interesInput.value = '20';
    // recargar lista si estamos en index
    if (typeof cargarPrestamos === 'function') cargarPrestamos(filtroSelect?.value || 'pendiente');
  } catch (err) {
    console.error('Error agregando préstamo', err);
    if (msgEl) msgEl.textContent = '❌ ' + (err.message || err);
  }
}

// Conectar eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // cargar inicialmente según filtro (si existe)
  const estado = filtroSelect?.value || 'pendiente';
  cargarPrestamos(estado);

  filtroSelect?.addEventListener('change', (e) => {
    cargarPrestamos(e.target.value);
  });

  // conectar agregar
  if (btnAgregar) btnAgregar.addEventListener('click', adicionarHandler);
});

// handler wrapper para evitar error de referencia hoisting
async function adicionarHandler(e) {
  e?.preventDefault?.();
  await agregarPrestamo();
}
