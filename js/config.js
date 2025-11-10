// ===============================
// CONFIGURACIÓN PARA SUPABASE
// Proyecto: App Prestamista
// Autor: Matías Celis (MCELIS TI)
// ===============================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ajkxbcainldvjviwnojs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa3hiY2Fpbmxkdmp2aXdub2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzQyNjYsImV4cCI6MjA3ODM1MDI2Nn0.r9LqE_odJ2VmFlgjCTlzTvPrYvS4PvXVjlfaxf7OJ4c";

// Inicializa cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificación opcional en consola
console.log("%c✅ Conectado a Supabase correctamente", "color: lime; font-weight: bold");
