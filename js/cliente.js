import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const nombreInput = document.getElementById('nombre');
  const telefonoInput = document.getElementById('telefono');
  const notasInput = document.getElementById('notas');
  const guardarBtn = document.getElementById('guardar');
  const msgEl = document.getElementById('msg');

  guardarBtn?.addEventListener('click', async () => {
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const notas = notasInput.value.trim();

    if (!nombre) return msgEl.textContent = '⚠️ Ingresa el nombre';

    const { error } = await supabase.from('clientes').insert([{ nombre, telefono, notas }]);
    msgEl.textContent = error ? '❌ ' + error.message : '✅ Cliente creado';
    
    if (!error) {
      nombreInput.value = '';
      telefonoInput.value = '';
      notasInput.value = '';
    }
  });
});
