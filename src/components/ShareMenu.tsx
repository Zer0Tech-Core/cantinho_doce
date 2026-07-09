// src/components/ShareMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Share2, 
  Copy, 
  Check,
  MessageCircle,
  Link2,
  X,
  Share
} from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/context/ToastContext'

interface ShareMenuProps {
  produto: {
    id: string
    nome: string
    descricao: string
    preco: number
    precoPromocional?: number
    imagem: string
    peso: string
  }
  className?: string
}

export default function ShareMenu({ produto, className = '' }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const precoFinal = produto.precoPromocional || produto.preco
  const produtoUrl = `https://cantinho-docecg.vercel.app/produto/${produto.id}`
  
  const getMensagem = () => {
    let msg = `🍪 ${produto.nome}\n`
    msg += `${produto.descricao}\n`
    msg += `💰 Preço: R$ ${precoFinal.toFixed(2)}\n`
    msg += `📦 Peso: ${produto.peso}\n\n`
    msg += `👀 Veja mais: ${produtoUrl}`
    return msg
  }

  // 🔥 FUNÇÃO SEGURA PARA COPIAR TEXTO
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      return false
    }
  }

  // 🔥 COMPARTILHAMENTO NATIVO DO APARELHO
  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: produto.nome,
          text: getMensagem(),
          url: produtoUrl
        })
        setIsOpen(false)
        return
      } catch {
        // Usuário cancelou
        setIsOpen(false)
        return
      }
    }
    // Fallback: abre o menu
    setIsOpen(!isOpen)
  }

  // 🔥 COMPARTILHAR PARA INSTAGRAM
  const shareToInstagram = async () => {
    const mensagem = getMensagem()
    
    // Tenta usar a API nativa
    if (navigator?.share) {
      try {
        await navigator.share({
          title: produto.nome,
          text: mensagem,
          url: produtoUrl
        })
        setIsOpen(false)
        return
      } catch {
        // Usuário cancelou
      }
    }
    
    // Fallback: copiar mensagem
    const copiou = await copyToClipboard(mensagem)
    if (copiou) {
      toast.sucesso('📋 Mensagem copiada! Abra o Instagram e cole.', 3000)
    } else {
      toast.erro('❌ Não foi possível copiar.', 3000)
    }
    
    // Tenta abrir o app ou web
    const instagramApp = 'instagram://user?username=cantinho_doce.cg'
    const instagramWeb = 'https://www.instagram.com/cantinho_doce.cg/'
    
    const appWindow = window.open(instagramApp, '_blank')
    setTimeout(() => {
      if (!appWindow || appWindow.closed) {
        window.open(instagramWeb, '_blank')
      }
    }, 500)
    
    setIsOpen(false)
  }

  // 🔥 FECHA AO CLICAR FORA
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 🔥 ÍCONES
  const InstagramIcon = () => (
    <Image 
      src="/icon/instagram.svg" 
      alt="Instagram" 
      width={20} 
      height={20}
      className="share-menu-svg-icon"
    />
  )

  const FacebookIcon = () => (
    <Image 
      src="/icon/facebook.svg" 
      alt="Facebook" 
      width={20} 
      height={20}
      className="share-menu-svg-icon"
    />
  )

  const TwitterIcon = () => (
    <Image 
      src="/icon/twitter.svg" 
      alt="Twitter" 
      width={20} 
      height={20}
      className="share-menu-svg-icon"
    />
  )

  return (
    <div className={`share-menu-wrapper ${className}`} ref={menuRef}>
      {/* 🔥 BOTÃO PRINCIPAL - COMPARTILHAMENTO NATIVO */}
      <button
        className="share-menu-trigger"
        onClick={handleNativeShare}
        aria-label="Compartilhar"
        title="Compartilhar"
      >
        <Share2 size={20} />
      </button>

      {/* 🔥 MENU DROPDOWN */}
      {isOpen && (
        <div className="share-menu-dropdown">
          <div className="share-menu-header">
            <span className="share-menu-title">Compartilhar</span>
            <button 
              className="share-menu-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="share-menu-options">
            {/* 🔥 COMPARTILHAR NATIVO (Mobile) */}
            <button
              className="share-menu-option"
              onClick={() => {
                handleNativeShare()
                setIsOpen(false)
              }}
            >
              <span className="share-menu-option-icon" style={{ color: '#6C757D' }}>
                <Share size={20} />
              </span>
              <span className="share-menu-option-label">Compartilhar (Nativo)</span>
            </button>

            {/* 🔥 WHATSAPP */}
            <button
              className="share-menu-option"
              onClick={() => {
                const msg = getMensagem()
                window.open(`https://wa.me/5521972279173?text=${encodeURIComponent(msg)}`, '_blank')
                setIsOpen(false)
              }}
            >
              <span className="share-menu-option-icon" style={{ color: '#25D366' }}>
                <MessageCircle size={20} />
              </span>
              <span className="share-menu-option-label">WhatsApp</span>
            </button>

            {/* 🔥 INSTAGRAM */}
            <button
              className="share-menu-option"
              onClick={shareToInstagram}
            >
              <span className="share-menu-option-icon" style={{ color: '#E4405F' }}>
                <InstagramIcon />
              </span>
              <span className="share-menu-option-label">Instagram</span>
            </button>

            {/* 🔥 FACEBOOK */}
            <button
              className="share-menu-option"
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(produtoUrl)}`, '_blank')
                setIsOpen(false)
              }}
            >
              <span className="share-menu-option-icon" style={{ color: '#1877F2' }}>
                <FacebookIcon />
              </span>
              <span className="share-menu-option-label">Facebook</span>
            </button>

            {/* 🔥 TWITTER/X */}
            <button
              className="share-menu-option"
              onClick={() => {
                const text = `${produto.nome} - ${produto.descricao}`
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(produtoUrl)}`, '_blank')
                setIsOpen(false)
              }}
            >
              <span className="share-menu-option-icon" style={{ color: '#000000' }}>
                <TwitterIcon />
              </span>
              <span className="share-menu-option-label">Twitter/X</span>
            </button>

            {/* 🔥 COPIAR LINK - GENÉRICO */}
            <button
              className="share-menu-option"
              onClick={async () => {
                const copiou = await copyToClipboard(produtoUrl)
                if (copiou) {
                  setCopied(true)
                  toast.sucesso('🔗 Link copiado!', 2000)
                  setTimeout(() => setCopied(false), 2000)
                } else {
                  toast.erro('❌ Erro ao copiar link', 2000)
                }
                setIsOpen(false)
              }}
            >
              <span className="share-menu-option-icon" style={{ color: '#6C757D' }}>
                {copied ? <Check size={20} /> : <Link2 size={20} />}
              </span>
              <span className="share-menu-option-label">
                {copied ? 'Copiado!' : 'Copiar Link'}
              </span>
              {copied && (
                <span className="share-menu-option-badge">✅</span>
              )}
            </button>
          </div>

          <div className="share-menu-footer">
            <span className="share-menu-url">{produtoUrl}</span>
          </div>
        </div>
      )}
    </div>
  )
}