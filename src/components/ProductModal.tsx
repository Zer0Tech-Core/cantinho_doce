// src/components/ProductModal.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  X, 
  Package, 
  Star, 
  Tag, 
  Plus, 
  Minus,
  Share2,
  ShoppingCart,
  Check
} from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'

interface Produto {
  id: string
  nome: string
  descricao: string
  imagem: string
  peso: string
  preco: number
  precoPromocional?: number
  destaque?: boolean
  icone?: string
  categoria?: string
  categoriaNome?: string
  tags?: string[]
}

interface ProductModalProps {
  produto: Produto | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ produto, isOpen, onClose }: ProductModalProps) {
  const { adicionarItem, getQuantidade, alterarQuantidade } = useCart()
  const toast = useToast()
  const [quantidade, setQuantidade] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && produto) {
      setQuantidade(1)
      setIsAdded(false)
    }
  }, [isOpen, produto])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!produto || !isOpen) return null

  const precoFinal = produto.precoPromocional || produto.preco
  const qtdNoCarrinho = getQuantidade(produto.id)
  const temImagem = produto.imagem && produto.imagem !== ''
  
  const getImagemPath = () => {
    if (!temImagem) return null
    const nomeArquivo = produto.imagem.split('/').pop() || produto.imagem
    const nomeSemExtensao = nomeArquivo.replace(/\.[^.]+$/, '')
    return `/imagens/produtos/${nomeSemExtensao}.webp`
  }

  const imagemPath = getImagemPath()

  const handleAdicionar = () => {
    setIsLoading(true)
    
    if (qtdNoCarrinho > 0) {
      const result = alterarQuantidade(produto.id, quantidade)
      if (result.success) {
        toast.sucesso(`🛒 +${quantidade} ${produto.nome}`)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1500)
      } else {
        toast.erro(result.message)
      }
    } else {
      const result = adicionarItem(produto.id, quantidade)
      if (result.success) {
        toast.sucesso(`🛒 ${produto.nome} adicionado!`)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1500)
      } else {
        toast.erro(result.message)
      }
    }
    
    setIsLoading(false)
  }

  // 🔥 VERSÃO SEM EMOJIS - 100% LIMPA
  const handleCompartilhar = () => {
    const precoFinal = produto.precoPromocional || produto.preco
    
    // 🔥 CONSTRÓI A URL DA IMAGEM
    const getImagemUrl = () => {
      if (!produto.imagem) return ''
      const nomeArquivo = produto.imagem.split('/').pop() || produto.imagem
      const nomeSemExtensao = nomeArquivo.replace(/\.[^.]+$/, '')
      return `https://cantinho-docecg.vercel.app/imagens/produtos/${nomeSemExtensao}.webp`
    }

    const imagemUrl = getImagemUrl()
    
    // 🔥 MENSAGEM SEM EMOJIS - APENAS TEXTO PURO
    const linhas: string[] = []

    // Título em negrito
    linhas.push(`*${produto.nome}*`)
    // Descrição em itálico
    linhas.push(`_${produto.descricao}_`)
    linhas.push('')

    // Peso
    linhas.push(`Peso: ${produto.peso}`)
    
    // Preço
    if (produto.precoPromocional) {
      linhas.push(`Preco: ${precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (de R$ ${produto.preco.toFixed(2)})`)
    } else {
      linhas.push(`Preco: ${precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
    }
    
    // Tags
    if (produto.tags && produto.tags.length > 0) {
      linhas.push(`Tags: ${produto.tags.slice(0, 3).join(' | ')}`)
    }
    
    linhas.push('')
    
    // Imagem
    if (imagemUrl) {
      linhas.push(`Veja a foto do produto:`)
      linhas.push(imagemUrl)
      linhas.push('')
    }
    
    // WhatsApp
    linhas.push(`Peça agora pelo nosso WhatsApp!`)
    linhas.push(`https://wa.me/5521972279173`)

    // Junta todas as linhas e codifica
    const mensagem = linhas.join('\n')
    const url = `https://wa.me/5521972279173?text=${encodeURIComponent(mensagem)}`
    
    window.open(url, '_blank')
  }

  return (
    <div className="product-modal-overlay">
      <div className="product-modal" ref={modalRef}>
        {/* Header com botões de ação */}
        <div className="product-modal-header">
          <button 
            className="product-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
          <button 
            className="product-modal-share"
            onClick={handleCompartilhar}
            aria-label="Compartilhar no WhatsApp"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Conteúdo principal em grid */}
        <div className="product-modal-grid">
          {/* Imagem */}
          <div className="product-modal-image">
            {temImagem && imagemPath ? (
              <div className="product-modal-image-wrapper">
                <Image
                  src={imagemPath}
                  alt={produto.nome}
                  width={280}
                  height={280}
                  className="product-modal-image-img"
                  priority
                />
              </div>
            ) : (
              <div className="product-modal-image-fallback">
                <span>🍪</span>
              </div>
            )}
            
            {/* Badges */}
            <div className="product-modal-badges">
              {produto.destaque && (
                <span className="product-modal-badge destaque">
                  <Star size={12} /> Destaque
                </span>
              )}
              {produto.precoPromocional && (
                <span className="product-modal-badge promocao">
                  <Tag size={12} /> 
                  {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Informações do produto */}
          <div className="product-modal-info">
            <div className="product-modal-info-header">
              <h2 className="product-modal-name">{produto.nome}</h2>
              {produto.categoriaNome && (
                <span className="product-modal-categoria">{produto.categoriaNome}</span>
              )}
            </div>

            <p className="product-modal-desc">{produto.descricao}</p>
            
            <div className="product-modal-meta">
              <div className="product-modal-meta-item">
                <Package size={16} />
                <span>{produto.peso}</span>
              </div>
              {produto.tags && produto.tags.length > 0 && (
                <div className="product-modal-tags">
                  {produto.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="product-modal-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="product-modal-price">
              {produto.precoPromocional ? (
                <>
                  <span className="product-modal-price-old">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="product-modal-price-current">
                    R$ {produto.precoPromocional.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="product-modal-price-current">
                  R$ {produto.preco.toFixed(2)}
                </span>
              )}
            </div>

            {/* Ações */}
            <div className="product-modal-actions">
              <div className="product-modal-qty">
                <button
                  className="product-modal-qty-btn"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={quantidade <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={16} />
                </button>
                <span className="product-modal-qty-display">{quantidade}</span>
                <button
                  className="product-modal-qty-btn"
                  onClick={() => setQuantidade(quantidade + 1)}
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={`product-modal-add-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAdicionar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="product-modal-spinner" />
                ) : isAdded ? (
                  <>
                    <Check size={18} />
                    Adicionado!
                  </>
                ) : qtdNoCarrinho > 0 ? (
                  <>
                    <ShoppingCart size={18} />
                    Adicionar +{quantidade}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>

            {qtdNoCarrinho > 0 && (
              <div className="product-modal-cart-indicator">
                🛒 {qtdNoCarrinho} {qtdNoCarrinho === 1 ? 'unidade' : 'unidades'} no carrinho
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}