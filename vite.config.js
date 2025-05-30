import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    // Configuração para suportar SPA routing
    historyApiFallback: true,
    // Permitir acesso externo
    host: '0.0.0.0',
    // Permitir todos os hosts
    allowedHosts: ['3002-i7ettbvgrbnb255a0kxf7-b9967cf2.manusvm.computer', 'all']
  },
  // Configuração para garantir que todas as rotas sejam redirecionadas para index.html
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
