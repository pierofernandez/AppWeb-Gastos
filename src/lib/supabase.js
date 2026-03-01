import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug en consola para verificar si Vite carga las variables
if (!supabaseUrl) {
    console.warn("⚠️ Advertencia: VITE_SUPABASE_URL no está definida. Verifica tu archivo .env.local y reinicia el servidor.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
