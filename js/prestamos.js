// prestamos.js
import { supabase } from "./config.js";

// Cargar préstamos
async function cargarPrestamos() {
  const { data, error } = await supabase
    .from("prestamos")
    .select("*")
    .order("fecha_prestamo", { ascending: false });

  if (error) {
    console.error(error);
    alert("Error al cargar préstamos");
    return;
  }

  const tabla = document.getElementById("tablaPrestamos");
  tabla.innerHTML = "";

  data.forEach((p) => {
    const interesMonto = (p.monto * p.interes) / 100;
    const total = p.monto + interesMonto;

    const row = `
      <tr>
        <td>${p.cliente_nombre}</td>
        <td>${p.monto}</td>
        <td>${p.interes}%</td>
        <td>${interesMonto.toFixed(0)}</td>
        <td>${total.toFixed(0)}</td>
        <td>${p.fecha_prestamo}</td>
        <td>${p.fecha_vencimiento}</td>
        <td>${p.estado}</td>
      </tr>
    `;
    tabla.innerHTML += row;
  });
}

// Agregar préstamo
async function agregarPrestamo() {
  const cliente = document.getElementById("cliente").value.trim();
  const monto = parseFloat(document.getElementById("monto").value);
  const interes = parseFloat(document.getElementById("interes").value || 20);
  const fechaPrestamo = new Date().toISOString().split("T")[0];
  const fechaVencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (!cliente || !monto) {
    alert("❗ Debes completar todos los campos");
    return;
  }

  const total = monto + (monto * interes) / 100;

  const { error } = await supabase.from("prestamos").insert([
    {
      cliente_nombre: cliente,
      monto,
      interes,
      total,
      fecha_prestamo: fechaPrestamo,
      fecha_vencimiento: fechaVencimiento,
      estado: "pendiente",
    },
  ]);

  if (error) alert("❌ Error: " + error.message);
  else {
    alert("✅ Préstamo agregado correctamente");
    window.location.href = "index.html";
  }
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tablaPrestamos")) cargarPrestamos();
  document.getElementById("btnAgregarPrestamo")?.addEventListener("click", agregarPrestamo);
});
