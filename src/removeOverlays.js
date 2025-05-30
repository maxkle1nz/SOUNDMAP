// Script para remover elementos de sobreposição indesejados
function removeOverlayElements() {
  // Função para remover elementos com base em seletores
  function removeElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      console.log('Removendo elemento:', el);
      el.remove();
    });
  }

  // Função para verificar e remover elementos periodicamente
  function checkAndRemove() {
    // Seletores para os elementos que queremos remover
    const selectors = [
      // Elementos pela classe e posição
      '.absolute.top-4.right-4',
      '.absolute.top-4.left-4',
      // Elementos pelo atributo data-component-name
      'div[data-component-name="<div />"]',
      // Elementos com o texto específico
      'div:contains("Milano Music Districts")',
      'div:contains("Markers Personalizzati")'
    ];

    // Remover cada tipo de elemento
    selectors.forEach(removeElements);
    
    // Tenta remover por conteúdo de texto
    document.querySelectorAll('div').forEach(div => {
      if (div.textContent.includes('Milano Music Districts') || 
          div.textContent.includes('Markers Personalizzati')) {
        console.log('Removendo pelo conteúdo de texto:', div);
        div.remove();
      }
    });
  }

  // Executar a remoção imediatamente
  checkAndRemove();
  
  // Continuar verificando periodicamente (pode ser necessário para elementos injetados dinamicamente)
  setInterval(checkAndRemove, 1000);

  // Adiciona um estilo global para garantir que os elementos permaneçam ocultos
  const style = document.createElement('style');
  style.textContent = `
    .absolute.top-4.right-4,
    .absolute.top-4.left-4,
    div[data-component-name="<div />"],
    div.absolute {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeOverlayElements);
} else {
  removeOverlayElements();
}

// Também executar quando a janela estiver totalmente carregada
window.addEventListener('load', removeOverlayElements);
