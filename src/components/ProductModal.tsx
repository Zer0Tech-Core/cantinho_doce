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

  const handleCompartilhar = () => {
    // 🔥 LINK DA PÁGINA DO PRODUTO (COM OG TAGS PARA PREVIEW)
    const produtoUrl = `https://cantinho-docecg.vercel.app/produto/${produto.id}`
    
    // 🔥 MENSAGEM CURTA E PROFISSIONAL COM O LINK
    const linhas: string[] = []

    linhas.push(`🍪 *${produto.nome}*`)
    linhas.push(`_${produto.descricao}_`)
    linhas.push('')
    
    if (produto.precoPromocional) {
      linhas.push(`💰 Preço: R$ ${produto.precoPromocional.toFixed(2)} (de R$ ${produto.preco.toFixed(2)})`)
    } else {
      linhas.push(`💰 Preço: R$ ${produto.preco.toFixed(2)}`)
    }
    linhas.push(`📦 Peso: ${produto.peso}`)
    linhas.push('')
    
    // 🔥 O LINK É O QUE GERA O PREVIEW NO WHATSAPP
    linhas.push(`👀 Veja mais detalhes:`)
    linhas.push(produtoUrl)
    linhas.push('')
    linhas.push(`🛒 Peça agora pelo WhatsApp:`)
    linhas.push(`https://wa.me/5521972279173`)

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