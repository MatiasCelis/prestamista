// js/clientes.js
import { supabase } from './config.js';

// =====================
// SELECTORES
// =====================
const nombreInput = document.getElementById('nombre') || document.getElementById('cliente-name');
const telefonoInput = document.getElementById('telefono');
const notasInput = document.getElementById('notas');
const btnCrear = document.getElementById('guardar') || document.getElementById('btnCrearCliente');
const resultadosEl = document.getElementById('resultados') || document.getElementById('resultadosClientes');
const msgEl = document.getElementById('msg');
const btnVolverAlInicio = document.getElementById("btnVolverAlInicio");

// =====================
// FUNCIONES PRINCIPALES
// =====================
export async function crearCliente(nombre, telefono = '', notas = '') {
  if (!nombre) throw new Error('Nombre requerido');
  const { error } = await supabase.from('clientes').insert([{ nombre, telefono, notas }]);
  if (error) throw error;
  return true;
}

export async function buscarClientes(term) {
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre')
    .ilike('nombre', `%${term}%`)
    .limit(10);
  if (error) throw error;
  return data || [];
}

if (!btnVolverAlInicio){
  console.warn("btnVolverAlInicio no encontrado en el DOM. Verifica que el id exista en agregar.html");
} else {
    btnVolverAlInicio.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
    });
}

// =====================
// CREAR CLIENTE
// =====================
if (btnCrear) {
  btnCrear.addEventListener('click', async () => {
    const nombre = (nombreInput?.value || '').trim();
    const telefono = (telefonoInput?.value || '').trim();
    const notas = (notasInput?.value || '').trim();

    if (!nombre) {
      msgEl.textContent = '⚠️ Ingresa un nombre';
      return;
    }

    // evitar múltiples clics
    btnCrear.disabled = true;
    btnCrear.textContent = 'Guardando...';

    try {
      await crearCliente(nombre, telefono, notas);

      msgEl.textContent = '✅ Cliente creado... Redireccionando al inicio';
      nombreInput.value = '';
      if (telefonoInput) telefonoInput.value = '';
      if (notasInput) notasInput.value = '';

      // Esperar unos segundos antes de redirigir
      await new Promise(res => setTimeout(res, 2000));
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      msgEl.textContent = '❌ ' + (err.message || 'Error al crear cliente');
    } finally {
      // Rehabilitar botón (por si hay error)
      btnCrear.disabled = false;
      btnCrear.textContent = 'Guardar';
    }
  });
}

// =====================
// BÚSQUEDA DE CLIENTES
// =====================
const searchInput = document.getElementById('cliente') || document.getElementById('search-cliente');
if (searchInput && resultadosEl) {
  let lastTerm = '';

  searchInput.addEventListener('input', async (e) => {
    const term = (e.target.value || '').trim();
    if (term.length < 3) {
      resultadosEl.innerHTML = '';
      return;
    }

    if (term === lastTerm) return;
    lastTerm = term;

    const clientes = await buscarClientes(term);

    // Render dinámico: datalist o ul
    if (resultadosEl.tagName === 'DATALIST') {
      resultadosEl.innerHTML = clientes.map(c => `<option value="${c.nombre}" data-id="${c.id}">`).join('');
    } else {
      resultadosEl.innerHTML = clientes.map(c => `<li data-id="${c.id}">${c.nombre}</li>`).join('');
    }
  });

  // Selección si es una lista UL
  resultadosEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    searchInput.value = li.textContent;
    searchInput.dataset.selectedId = li.dataset.id;
    resultadosEl.innerHTML = '';
  });
}
