import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente configuradas no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Logs para debug (remove em produção)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key não configurados!');
} else {
  console.log('Supabase configurado com sucesso!');
}
