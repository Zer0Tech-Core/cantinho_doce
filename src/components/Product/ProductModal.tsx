'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  X, 
  Package, 
  Star, 
  Tag, 
  Plus, 
  Minus,
  ShoppingCart,
  Check
} from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { Produto, ProductModalProps } from '@/core/domain/types'
import styles from './ProductModal.module.css' // <-- Import do CSS Module

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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        {/* Header */}
        <div className={styles.header}>
          <button 
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageSection}>
            {temImagem && imagemPath ? (
              <div className={styles.imageWrapper}>
                <Image
                  src={imagemPath}
                  alt={produto.nome}
                  width={280}
                  height={280}
                  priority
                />
              </div>
            ) : (
              <div className={styles.imageFallback}>
                <span>🍪</span>
              </div>
            )}
            
            <div className={styles.badges}>
              {produto.destaque && (
                <span className={`${styles.badge} ${styles.badgeDestaque}`}>
                  <Star size={12} /> Destaque
                </span>
              )}
              {produto.precoPromocional && (
                <span className={`${styles.badge} ${styles.badgePromocao}`}>
                  <Tag size={12} /> 
                  {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoHeader}>
              <h2 className={styles.productName}>{produto.nome}</h2>
              {produto.categoriaNome && (
                <span className={styles.categoria}>{produto.categoriaNome}</span>
              )}
            </div>

            <p className={styles.desc}>{produto.descricao}</p>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Package size={16} />
                <span>{produto.peso}</span>
              </div>
              {produto.tags && produto.tags.length > 0 && (
                <div className={styles.tags}>
                  {produto.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.price}>
              {produto.precoPromocional ? (
                <>
                  <span className={styles.priceOld}>
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className={`${styles.priceCurrent} ${styles.promocional}`}>
                    R$ {produto.precoPromocional.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className={styles.priceCurrent}>
                  R$ {produto.preco.toFixed(2)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <div className={styles.qtyControls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={quantidade <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.qtyDisplay}>{quantidade}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantidade(quantidade + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={`${styles.addBtn} ${isAdded ? styles.added : ''}`}
                onClick={handleAdicionar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner} />
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
              <div className={styles.cartIndicator}>
                🛒 {qtdNoCarrinho} {qtdNoCarrinho === 1 ? 'unidade' : 'unidades'} no carrinho
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}