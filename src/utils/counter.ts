// =============================================
// COUNTER - Componente Interativo (Next.js)
// =============================================
import { CounterConfig, CounterAPI } from "@/core/domain/types"


/**
 * Configura um contador com funcionalidades avançadas
 * @param {HTMLElement} element - Elemento onde o contador será renderizado
 * @param {CounterConfig} options - Opções de configuração
 * @returns {CounterAPI} API do contador
 */
export function setupCounter(element: HTMLElement, options: CounterConfig = {}): CounterAPI {
  // CORREÇÃO: Removemos os valores `null` e usamos `undefined`
  const config: CounterConfig = {
    valorInicial: 0,
    valorMinimo: 0,
    valorMaximo: 100,
    passo: 1,
    prefixo: '',
    sufixo: '',
    formato: (valor: number) => `${config.prefixo}${valor}${config.sufixo}`,
    ...options
  }

  let valor = config.valorInicial || 0
  const listeners: Array<(novoValor: number, valorAntigo: number) => void> = []
  let timeoutId: NodeJS.Timeout | null = null

  // ===========================================
  // 🖥️ RENDERIZAÇÃO
  // ===========================================

  function renderizar(): void {
    if (!element) return
    
    const valorFormatado = config.formato ? config.formato(valor) : `${valor}`
    
    element.innerHTML = `
      <div class="counter-container">
        <button class="counter-btn counter-btn-minus" aria-label="Diminuir">
          <span class="counter-icon">−</span>
        </button>
        <span class="counter-value">${valorFormatado}</span>
        <button class="counter-btn counter-btn-plus" aria-label="Aumentar">
          <span class="counter-icon">+</span>
        </button>
        <button class="counter-btn counter-btn-reset" aria-label="Resetar">
          <span class="counter-icon">↺</span>
        </button>
      </div>
    `

    adicionarEstilos()

    const btnMinus = element.querySelector('.counter-btn-minus') as HTMLButtonElement
    if (btnMinus) {
      btnMinus.addEventListener('click', (e) => {
        e.stopPropagation()
        diminuir()
      })
      
      btnMinus.addEventListener('mousedown', () => {
        timeoutId = setTimeout(() => {
          const interval = setInterval(() => {
            if (valor <= (config.valorMinimo || 0)) {
              clearInterval(interval)
              return
            }
            diminuir()
          }, 100)
          
          ;(btnMinus as any)._interval = interval
        }, 500)
      })
      
      btnMinus.addEventListener('mouseup', () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((btnMinus as any)._interval) {
          clearInterval((btnMinus as any)._interval)
          ;(btnMinus as any)._interval = null
        }
      })
      
      btnMinus.addEventListener('mouseleave', () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((btnMinus as any)._interval) {
          clearInterval((btnMinus as any)._interval)
          ;(btnMinus as any)._interval = null
        }
      })
    }

    const btnPlus = element.querySelector('.counter-btn-plus') as HTMLButtonElement
    if (btnPlus) {
      btnPlus.addEventListener('click', (e) => {
        e.stopPropagation()
        aumentar()
      })
      
      btnPlus.addEventListener('mousedown', () => {
        timeoutId = setTimeout(() => {
          const interval = setInterval(() => {
            if (valor >= (config.valorMaximo || 100)) {
              clearInterval(interval)
              return
            }
            aumentar()
          }, 100)
          
          ;(btnPlus as any)._interval = interval
        }, 500)
      })
      
      btnPlus.addEventListener('mouseup', () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((btnPlus as any)._interval) {
          clearInterval((btnPlus as any)._interval)
          ;(btnPlus as any)._interval = null
        }
      })
      
      btnPlus.addEventListener('mouseleave', () => {
        if (timeoutId) clearTimeout(timeoutId)
        if ((btnPlus as any)._interval) {
          clearInterval((btnPlus as any)._interval)
          ;(btnPlus as any)._interval = null
        }
      })
    }

    const btnReset = element.querySelector('.counter-btn-reset') as HTMLButtonElement
    if (btnReset) {
      btnReset.addEventListener('click', (e) => {
        e.stopPropagation()
        resetar()
      })
    }

    atualizarBotoes()
  }

  // ===========================================
  // FUNÇÕES DE CONTROLE
  // ===========================================

  function aumentar(): void {
    const novoValor = Math.min(valor + (config.passo || 1), config.valorMaximo || 100)
    if (novoValor === valor) {
      if (config.onMaximo) config.onMaximo(valor)
      return
    }
    setValor(novoValor)
  }

  function diminuir(): void {
    const novoValor = Math.max(valor - (config.passo || 1), config.valorMinimo || 0)
    if (novoValor === valor) {
      if (config.onMinimo) config.onMinimo(valor)
      return
    }
    setValor(novoValor)
  }

  function resetar(): void {
    setValor(config.valorInicial || 0)
  }

  function setValor(novoValor: number): void {
    const valorAnterior = valor
    valor = Math.min(Math.max(novoValor, config.valorMinimo || 0), config.valorMaximo || 100)
    
    if (valor !== valorAnterior) {
      renderizar()
      
      listeners.forEach(listener => {
        try {
          listener(valor, valorAnterior)
        } catch (e) {
          console.warn('Erro no listener do contador:', e)
        }
      })
      
      if (config.onMudanca) {
        config.onMudanca(valor, valorAnterior)
      }
    }
  }

  function atualizarBotoes(): void {
    const btnMinus = element?.querySelector('.counter-btn-minus') as HTMLButtonElement
    const btnPlus = element?.querySelector('.counter-btn-plus') as HTMLButtonElement
    
    if (btnMinus) {
      btnMinus.disabled = valor <= (config.valorMinimo || 0)
      btnMinus.style.opacity = valor <= (config.valorMinimo || 0) ? '0.4' : '1'
      btnMinus.style.cursor = valor <= (config.valorMinimo || 0) ? 'not-allowed' : 'pointer'
    }
    
    if (btnPlus) {
      btnPlus.disabled = valor >= (config.valorMaximo || 100)
      btnPlus.style.opacity = valor >= (config.valorMaximo || 100) ? '0.4' : '1'
      btnPlus.style.cursor = valor >= (config.valorMaximo || 100) ? 'not-allowed' : 'pointer'
    }
  }

  // ===========================================
  // 🎨 ESTILOS
  // ===========================================

  function adicionarEstilos(): void {
    if (document.getElementById('counter-styles')) return

    const style = document.createElement('style')
    style.id = 'counter-styles'
    style.textContent = `
      .counter-container {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #f5f5f5;
        padding: 6px 10px;
        border-radius: 50px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        font-family: 'Segoe UI', system-ui, sans-serif;
        user-select: none;
      }
      
      .counter-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 50%;
        background: white;
        color: #333;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .counter-btn:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      
      .counter-btn:active:not(:disabled) {
        transform: scale(0.9);
      }
      
      .counter-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
      }
      
      .counter-btn-minus {
        background: #ff6b6b;
        color: white;
      }
      
      .counter-btn-minus:hover:not(:disabled) {
        background: #ee5a24;
      }
      
      .counter-btn-plus {
        background: #2ecc71;
        color: white;
      }
      
      .counter-btn-plus:hover:not(:disabled) {
        background: #27ae60;
      }
      
      .counter-btn-reset {
        background: #f39c12;
        color: white;
        font-size: 16px;
      }
      
      .counter-btn-reset:hover {
        background: #e67e22;
        transform: rotate(180deg);
      }
      
      .counter-value {
        min-width: 40px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        padding: 0 4px;
      }
      
      .counter-value.pulse {
        animation: pulse 0.3s ease;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      @media (max-width: 480px) {
        .counter-btn {
          width: 28px;
          height: 28px;
          font-size: 16px;
        }
        .counter-value {
          font-size: 16px;
          min-width: 32px;
        }
        .counter-container {
          padding: 4px 8px;
        }
      }
    `
    document.head.appendChild(style)
  }

  // ===========================================
  // 📋 API PÚBLICA
  // ===========================================

  const api: CounterAPI = {
    getValor: () => valor,
    
    setValor: (novoValor: number) => {
      setValor(novoValor)
      return api
    },
    
    aumentar: () => {
      aumentar()
      return api
    },
    
    diminuir: () => {
      diminuir()
      return api
    },
    
    resetar: () => {
      resetar()
      return api
    },
    
    onMudanca: (callback: (novoValor: number, valorAntigo: number) => void) => {
      if (typeof callback === 'function') {
        listeners.push(callback)
      }
      return api
    },
    
    removerListener: (callback: (novoValor: number, valorAntigo: number) => void) => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
      return api
    },
    
    destroy: () => {
      if (element) {
        element.innerHTML = ''
      }
      listeners.length = 0
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    },
    
    updateOptions: (novasOpcoes: Partial<CounterConfig>) => {
      Object.assign(config, novasOpcoes)
      renderizar()
      return api
    },
    
    comConfig: (opcoes: Partial<CounterConfig>) => {
      return setupCounter(element, { ...config, ...opcoes })
    }
  }

  // ===========================================
  //  INICIALIZAÇÃO
  // ===========================================

  renderizar()

  return api
}

// =============================================
//  ATALHOS PARA CRIAR CONTADORES
// =============================================

/**
 * Cria um contador simples
 */
export function criarContador(element: HTMLElement, valorInicial: number = 0): CounterAPI {
  return setupCounter(element, {
    valorInicial,
    valorMinimo: 0,
    valorMaximo: 999,
    passo: 1
  })
}

/**
 * Cria um contador de quantidade (para carrinho)
 */
export function criarContadorQuantidade(
  element: HTMLElement,
  valorInicial: number = 1,
  maximo: number = 99
): CounterAPI {
  return setupCounter(element, {
    valorInicial,
    valorMinimo: 1,
    valorMaximo: maximo,
    passo: 1,
    prefixo: 'x ',
    onMinimo: (valor: number) => {
      console.log('Mínimo atingido:', valor)
    },
    onMaximo: (valor: number) => {
      console.log('Máximo atingido:', valor)
    }
  })
}

/**
 * Cria um contador de preço
 */
export function criarContadorPreco(
  element: HTMLElement,
  valorInicial: number = 0,
  passo: number = 0.50
): CounterAPI {
  return setupCounter(element, {
    valorInicial,
    valorMinimo: 0,
    valorMaximo: 100,
    passo,
    prefixo: 'R$ ',
    formato: (valor: number) => `R$ ${valor.toFixed(2)}`
  })
}

// =============================================
// 🐛 DEBUG
// =============================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔢 Módulo Counter carregado!')
  console.log('Atalhos: criarContador, criarContadorQuantidade, criarContadorPreco')
  
  ;(window as any).__COUNTER = {
    setup: setupCounter,
    criar: criarContador,
    quantidade: criarContadorQuantidade,
    preco: criarContadorPreco
  }
}