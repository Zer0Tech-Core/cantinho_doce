// src/hooks/useShare.tsx
import { useState } from 'react'
import { Produto } from '@/core/domain/types'
import { useToast } from '@/context/ToastContext'

export function useShare(produto: Produto) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const precoFinal = produto.precoPromocional || produto.preco[span_10](start_span)[span_10](end_span)
  const produtoUrl = `https://cantinho-docecg.vercel.app/produto/${produto.id}`[span_11](start_span)[span_11](end_span)
  
  // CORREÇÃO: Removemos a variável ${produtoUrl} daqui de dentro!
  const mensagemCompartilhamento = `🍪 ${produto.nome}\n${produto.descricao}\n💰 Preço: R$ ${precoFinal.toFixed(2)}\nPeso: ${produto.peso}\n\n👀 Veja mais: `

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)[span_12](start_span)[span_12](end_span)
        return true[span_13](start_span)[span_13](end_span)
      }
      const textarea = document.createElement('textarea')[span_14](start_span)[span_14](end_span)
      textarea.value = text[span_15](start_span)[span_15](end_span)
      textarea.style.position = 'fixed[span_16](start_span)'[span_16](end_span)
      textarea.style.opacity = '0[span_17](start_span)'[span_17](end_span)
      document.body.appendChild(textarea)[span_18](start_span)[span_18](end_span)
      textarea.select()[span_19](start_span)[span_19](end_span)
      document.execCommand('copy')[span_20](start_span)[span_20](end_span)
      document.body.removeChild(textarea)[span_21](start_span)[span_21](end_span)
      return true[span_22](start_span)[span_22](end_span)
    } catch {
      return false[span_23](start_span)[span_23](end_span)
    }
  }

  const executarCopiaLink = async () => {
    // Para o Desktop, nós juntamos o texto e o link manualmente na hora de mandar para a área de transferência
    const copiou = await copyToClipboard(`${mensagemCompartilhamento}${produtoUrl}`)
    if (copiou) {
      setCopied(true)[span_24](start_span)[span_24](end_span)
      toast.sucesso('🔗 Link copiado!', 2000)[span_25](start_span)[span_25](end_span)
      setTimeout(() => setCopied(false), 2000)[span_26](start_span)[span_26](end_span)
    } else {
      toast.erro('❌ Erro ao copiar link', 2000)[span_27](start_span)[span_27](end_span)
    }
  }

  return {
    produtoUrl,
    mensagemCompartilhamento,
    copied,[span_28](start_span)[span_28](end_span)
    executarCopiaLink,
    copyToClipboard[span_29](start_span)[span_29](end_span)
  }
}
