// clientes.js
import { supabase } from "./config.js";

// Crear nuevo cliente
async function crearCliente() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre) {
    alert("❗ Ingresa el nombre del cliente");
    return;
  }

  const { error } = await supabase.from("clientes").insert([{ nombre, telefono }]);

  if (error) alert("❌ Error: " + error.message);
  else {
    alert("✅ Cliente creado correctamente");
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
  }
}

// Buscar clientes que coincidan con al menos 3 letras
async function buscarClientes(termino) {
  if (termino.length < 3) return [];

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .ilike("nombre", `%${termino}%`);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// Listener para el input de búsqueda
document.getElementById("nombre")?.addEventListener("input", async (e) => {
  const clientes = await buscarClientes(e.target.value);
  const lista = document.getElementById("resultadosClientes");
  if (!lista) return;

  lista.innerHTML = clientes.map(c => `<option value="${c.nombre}">`).join("");
});

// Botón de crear cliente
document.getElementById("btnCrearCliente")?.addEventListener("click", crearCliente);
