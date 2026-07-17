// src/hooks/useShare.tsx
import { useState } from 'react'
import { Produto } from '@/core/domain/types'
import { useToast } from '@/context/ToastContext'

export function useShare(produto: Produto) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const precoFinal = produto.precoPromocional || produto.preco
  const produtoUrl = `https://cantinho-docecg.vercel.app/produto/${produto.id}`
  
  const mensagemCompartilhamento = `🍪 ${produto.nome}\n${produto.descricao}\n💰 Preço: R$ ${precoFinal.toFixed(2)}\nPeso: ${produto.peso}\n\n👀 Veja mais: `

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
      
      // Fallback manual totalmente limpo de erros sintáticos
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      return false
    }
  }

  const ejecutarCopiaLink = async () => {
    const copiou = await copyToClipboard(`${mensagemCompartilhamento}${produtoUrl}`)
    if (copiou) {
      setCopied(true)
      toast.sucesso('🔗 Link copiado!', 2000)
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.erro('❌ Erro ao copiar link', 2000)
    }
  }

  return {
    produtoUrl,
    mensagemCompartilhamento,
    copied,
    executarCopiaLink,
    copyToClipboard
  }
}
