// Conexión a la DB de SupaBase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  'https://ajkxbcainldvjviwnojs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa3hiY2Fpbmxkdmp2aXdub2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzQyNjYsImV4cCI6MjA3ODM1MDI2Nn0.r9LqE_odJ2VmFlgjCTlzTvPrYvS4PvXVjlfaxf7OJ4c'
);
