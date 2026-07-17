// src/components/Shared/ShareMenu.tsx
'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { ShareMenuProps } from '@/core/domain/types'
import { useShare } from '@/hooks/useShare'

export default function ShareMenu({ produto, className = '' }: ShareMenuProps) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  
  const { 
    produtoUrl, 
    mensagemCompartilhamento, 
    executarCopiaLink 
  } = useShare(produto)

  const handleShareClick = async () => {
    // 1. Tenta usar o COMPARTILHAR NATURAL do aparelho
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: produto.nome,
          text: mensagemCompartilhamento,
          url: produtoUrl
        })
        return // Deu certo, encerra aqui!
      } catch (err) {
        // Se o usuário apenas fechou a folha nativa sem compartilhar, não fazemos nada
        console.log('Compartilhamento nativo fechado ou cancelado')
        return
      }
    }

    // 2. FALLBACK PARA DESKTOP/NAVEGADORES ANTIGOS: Copia o link direto
    // Se o aparelho não tiver a função nativa, ele apenas copia o link e avisa o usuário
    await executarCopiaLink()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`share-menu-wrapper ${className}`}>
      <button
        className={`share-menu-trigger ${copied ? 'copied' : ''}`}
        onClick={handleShareClick}
        aria-label="Compartilhar produto"
        title={copied ? "Link copiado!" : "Compartilhar"}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {copied ? (
          <Check size={20} style={{ color: '#28a745' }} />
        ) : (
          <Share2 size={20} />
        )}
      </button>
    </div>
  )
}