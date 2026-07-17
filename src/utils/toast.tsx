// src/utils/toast.tsx
'use client'

// =============================================
// SISTEMA DE TOAST - NOTIFICACOES (Next.js)
// =============================================

import { CheckCircle, XCircle, AlertTriangle, Info, Star } from 'lucide-react'
import ReactDOM from 'react-dom/client'
import { ReactNode } from 'react'
import { ToastOptions, ToastItem, ToastComponentProps, TipoToast } from '@/core/domain/types'

// ===========================================
// 🎨 CONFIGURAÇÕES
// ===========================================

const CORES_TOAST = {
  sucesso: {
    bg: 'linear-gradient(135deg, #2E7D32, #43A047)',
    icon: CheckCircle,
    cor: '#FFFFFF',
    sombra: '0 4px 20px rgba(46, 125, 50, 0.4)'
  },
  erro: {
    bg: 'linear-gradient(135deg, #C62828, #E53935)',
    icon: XCircle,
    cor: '#FFFFFF',
    sombra: '0 4px 20px rgba(198, 40, 40, 0.4)'
  },
  aviso: {
    bg: 'linear-gradient(135deg, #E65100, #FB8C00)',
    icon: AlertTriangle,
    cor: '#FFFFFF',
    sombra: '0 4px 20px rgba(230, 81, 0, 0.4)'
  },
  info: {
    bg: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
    icon: Info,
    cor: '#FFFFFF',
    sombra: '0 4px 20px rgba(13, 71, 161, 0.4)'
  },
  destaque: {
    bg: 'linear-gradient(135deg, #D4A574, #C49A6C)',
    icon: Star,
    cor: '#1B5E20',
    sombra: '0 4px 20px rgba(212, 165, 116, 0.5)'
  }
}

// ===========================================
// 🧠 ESTADO
// ===========================================

let timeoutId: NodeJS.Timeout | null = null
let filaToasts: ToastItem[] = []
let toastAtivo = false
let root: ReactDOM.Root | null = null

function ToastComponent({ mensagem, tipo, duracao, opcoes, onClose }: ToastComponentProps) {
  const config = CORES_TOAST[tipo] || CORES_TOAST.info
  const Icone = config.icon

  return (
    <div
      className="toast-custom"
      style={{
        position: 'fixed',
        bottom: opcoes.posicao === 'topo' ? 'auto' : '100px',
        top: opcoes.posicao === 'topo' ? '80px' : 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        background: config.bg,
        color: config.cor,
        padding: opcoes.compacto ? '10px 18px' : '14px 24px',
        borderRadius: opcoes.quadrado ? '12px' : '50px',
        fontWeight: 600,
        zIndex: 9999,
        boxShadow: config.sombra,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: opcoes.maxWidth || '90%',
        minWidth: opcoes.minWidth || 'auto',
        fontSize: opcoes.tamanhoFonte || '15px',
        pointerEvents: opcoes.botaoFechar ? 'auto' : 'none',
        userSelect: 'none',
        border: opcoes.borda || 'none',
        boxSizing: 'border-box',
        animation: 'slideUp 0.3s ease forwards'
      }}
    >
      <span className="toast-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icone size={opcoes.iconSize || 22} color={config.cor} />
      </span>
      
      <span className="toast-mensagem" style={{ lineHeight: 1.4, flex: 1 }}>
        {mensagem}
      </span>

      {opcoes.botaoFechar && (
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: config.cor,
            width: 28,
            height: 28,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            marginLeft: 'auto',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)' }}
        >
          ✕
        </button>
      )}

      {opcoes.barraProgresso && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'rgba(255,255,255,0.4)',
              transition: `width ${duracao}ms linear`,
              width: '100%'
            }}
          />
        </div>
      )}
    </div>
  )
}

// ===========================================
// FUNÇÃO PRINCIPAL
// ===========================================

export function mostrarToast(
  mensagem: string,
  tipo: TipoToast = 'sucesso',
  duracao: number = 2500,
  opcoes: ToastOptions = {}
) {
  if (toastAtivo) {
    filaToasts.push({ mensagem, tipo, duracao, opcoes })
    return
  }

  // Remove toast existente
  const toastExistente = document.querySelector('.toast-custom')
  if (toastExistente) {
    toastExistente.remove()
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  // Cria o container do toast
  const container = document.createElement('div')
  container.id = 'toast-container'
  document.body.appendChild(container)

  toastAtivo = true

  // Função para remover o toast
  const handleClose = () => {
    removerToast(container)
  }

  // Renderiza o componente React
  if (!root) {
    root = ReactDOM.createRoot(container)
  }

  root.render(
    <ToastComponent
      mensagem={mensagem}
      tipo={tipo}
      duracao={duracao}
      opcoes={opcoes}
      onClose={handleClose}
    />
  )

  // Estilos globais (apenas uma vez)
  adicionarEstilosGlobais()

  // Remove após duração
  const tempo = duracao || 2500
  if (timeoutId) clearTimeout(timeoutId)
  
  timeoutId = setTimeout(() => {
    removerToast(container)
  }, tempo)

  // Retorna função para remover manualmente
  return () => removerToast(container)
}

// ===========================================
// 🗑️ REMOVER TOAST
// ===========================================

function removerToast(container: HTMLDivElement) {
  const toast = container.querySelector('.toast-custom')
  if (toast) {
    toast.classList.add('removendo')
    toast.setAttribute('style', (toast.getAttribute('style') || '') + ' animation: slideDown 0.3s ease forwards;')
  }

  setTimeout(() => {
    if (container.parentNode) {
      container.remove()
    }
    toastAtivo = false
    timeoutId = null
    
    // Processa a fila
    processarFila()
  }, 300)
}

// ===========================================
// 📋 PROCESSAR FILA
// ===========================================

function processarFila() {
  if (filaToasts.length > 0 && !toastAtivo) {
    const proximo = filaToasts.shift()
    if (proximo) {
      mostrarToast(proximo.mensagem, proximo.tipo, proximo.duracao, proximo.opcoes)
    }
  }
}

// ===========================================
// 🎨 ESTILOS GLOBAIS
// ===========================================

function adicionarEstilosGlobais() {
  if (document.getElementById('toast-styles')) return

  const style = document.createElement('style')
  style.id = 'toast-styles'
  style.textContent = `
    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateX(-50%) translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0) scale(1); 
      }
    }
    @keyframes slideDown {
      from { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0) scale(1); 
      }
      to { 
        opacity: 0; 
        transform: translateX(-50%) translateY(20px) scale(0.95); 
      }
    }
    .toast-custom {
      animation: slideUp 0.3s ease forwards;
      box-sizing: border-box;
    }
    .toast-custom.removendo {
      animation: slideDown 0.3s ease forwards;
    }
    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .toast-icon svg {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .toast-mensagem {
      line-height: 1.4;
      flex: 1;
    }
    .toast-close {
      flex-shrink: 0;
    }
  `
  document.head.appendChild(style)
}

// ===========================================
//  ATALHOS
// ===========================================

export const toastSucesso = (mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
  return mostrarToast(mensagem, 'sucesso', duracao, opcoes)
}

export const toastErro = (mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
  return mostrarToast(mensagem, 'erro', duracao, opcoes)
}

export const toastAviso = (mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
  return mostrarToast(mensagem, 'aviso', duracao, opcoes)
}

export const toastInfo = (mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
  return mostrarToast(mensagem, 'info', duracao, opcoes)
}

export const toastDestaque = (mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
  return mostrarToast(mensagem, 'destaque', duracao, opcoes)
}

// ===========================================
// UTILITÁRIOS
// ===========================================

export function limparToasts() {
  const containers = document.querySelectorAll('#toast-container')
  containers.forEach(container => {
    container.remove()
  })
  toastAtivo = false
  filaToasts = []
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

export function temToastAtivo(): boolean {
  return toastAtivo || filaToasts.length > 0
}

export function getTamanhoFila(): number {
  return filaToasts.length
}

// ===========================================
// 🐛 DEBUG
// ===========================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🍞 Sistema de Toast carregado!')
  console.log('Atalhos: toastSucesso, toastErro, toastAviso, toastInfo, toastDestaque')
  console.log('Use limparToasts() para remover todos')
  
  ;(window as any).__TOAST = {
    mostrar: mostrarToast,
    sucesso: toastSucesso,
    erro: toastErro,
    aviso: toastAviso,
    info: toastInfo,
    destaque: toastDestaque,
    limpar: limparToasts,
    fila: () => filaToasts
  }
}