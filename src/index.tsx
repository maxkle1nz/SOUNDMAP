// Configuração básica para o ambiente de teste
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import './styles.css';
// Importar script para remover elementos de sobreposição
import './removeOverlays.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
