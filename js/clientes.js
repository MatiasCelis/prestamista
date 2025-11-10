// js/clientes.js
import { supabase } from './config.js';

// SELECTORES tolerantes a ids distintos
const nombreInput = document.getElementById('nombre') || document.getElementById('cliente-name');
const telefonoInput = document.getElementById('telefono');
const notasInput = document.getElementById('notas');
const btnCrear = document.getElementById('guardar') || document.getElementById('btnCrearCliente');
const resultadosUl = document.getElementById('resultados') || document.getElementById('resultadosClientes') || null;
const msgEl = document.getElementById('msg') || null;

// Crear cliente
export async function crearCliente(nombre, telefono = '', notas = '') {
  if (!nombre) throw new Error('Nombre requerido');
  const { error } = await supabase.from('clientes').insert([{ nombre, telefono, notas }]);
  if (error) throw error;
  return true;
}

// Buscar clientes por término (ILIKE %term%)
export async function buscarClientes(term) {
  if (!term || term.length < 3) return [];
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .ilike('nombre', `%${term}%`)
    .limit(20);
  if (error) {
    console.error('Error buscar clientes', error);
    return [];
  }
  return data;
}

// Si hay formulario de creación en la página, conectar
if (btnCrear) {
  btnCrear.addEventListener('click', async () => {
    const nombre = (nombreInput?.value || '').trim();
    const telefono = (telefonoInput?.value || '').trim();
    const notas = (notasInput?.value || '').trim();
    try {
      if (!nombre) {
        if (msgEl) msgEl.textContent = '⚠️ Ingresa nombre';
        else alert('Ingresa nombre');
        return;
      }
      await crearCliente(nombre, telefono, notas);
      if (msgEl) msgEl.textContent = '✅ Cliente creado';
      // limpiar inputs
      if (nombreInput) nombreInput.value = '';
      if (telefonoInput) telefonoInput.value = '';
      if (notasInput) notasInput.value = '';
    } catch (err) {
      console.error(err);
      if (msgEl) msgEl.textContent = '❌ ' + (err.message || err);
    }
  });
}

// Si hay input para búsqueda (ej: agregar préstamo), conectar listener
const searchInput = document.getElementById('cliente') || document.getElementById('search-cliente');
if (searchInput && resultadosUl) {
  let lastTerm = '';
  searchInput.addEventListener('input', async (e) => {
    const term = (e.target.value || '').trim();
    if (term.length < 3) {
      resultadosUl.innerHTML = '';
      return;
    }
    // evitar llamadas repetidas
    if (term === lastTerm) return;
    lastTerm = term;

    const clientes = await buscarClientes(term);
    // resultados pueden ser <datalist> or <ul>
    if (resultadosUl.tagName === 'DATALIST') {
      resultadosUl.innerHTML = clientes.map(c => `<option value="${c.nombre}" data-id="${c.id}">`).join('');
    } else { // ul or other
      resultadosUl.innerHTML = clientes.map(c => `<li data-id="${c.id}">${c.nombre}</li>`).join('');
    }
  });

  // Si es UL y se hacen clicks, devolver id/llenar input
  resultadosUl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    const nombre = li.textContent;
    searchInput.value = nombre;
    // marcar selección colocando data-selected-id en input
    searchInput.dataset.selectedId = id;
    resultadosUl.innerHTML = '';
  });
}
