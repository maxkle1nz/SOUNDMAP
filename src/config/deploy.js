// Configuração para deploy do SOUNDMAP
import { createClient } from '@supabase/supabase-js';

// Em produção, estas variáveis devem vir de variáveis de ambiente
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'your-mapbox-token';

// Inicialização do cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configurações para deploy
export const config = {
  appName: 'SOUNDMAP',
  version: '1.0.0',
  mapboxToken: MAPBOX_TOKEN,
  apiEndpoints: {
    base: SUPABASE_URL,
    auth: `${SUPABASE_URL}/auth/v1`,
    rest: `${SUPABASE_URL}/rest/v1`
  },
  defaultMapSettings: {
    center: [12.4964, 41.9028], // Roma como centro padrão
    zoom: 5,
    style: 'mapbox://styles/mapbox/light-v10'
  }
};

// Configurações para diferentes ambientes
export const environments = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true
  },
  production: {
    apiUrl: 'https://soundmap-app.vercel.app',
    debug: false
  }
};

// Ambiente atual
export const currentEnvironment = process.env.NODE_ENV || 'development';

// Exporta configurações do ambiente atual
export const env = environments[currentEnvironment];
