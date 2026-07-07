'use client'

import { createContext, useContext, useCallback, ReactNode } from 'react'
import { toastSucesso, toastErro, toastAviso, toastInfo, toastDestaque, ToastOptions } from '@/utils/toast'

interface ToastContextType {
  sucesso: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  erro: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  aviso: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  info: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  destaque: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const sucesso = useCallback((mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
    toastSucesso(mensagem, duracao, opcoes)
  }, [])

  const erro = useCallback((mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
    toastErro(mensagem, duracao, opcoes)
  }, [])

  const aviso = useCallback((mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
    toastAviso(mensagem, duracao, opcoes)
  }, [])

  const info = useCallback((mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
    toastInfo(mensagem, duracao, opcoes)
  }, [])

  const destaque = useCallback((mensagem: string, duracao?: number, opcoes?: ToastOptions) => {
    toastDestaque(mensagem, duracao, opcoes)
  }, [])

  return (
    <ToastContext.Provider value={{ sucesso, erro, aviso, info, destaque }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}