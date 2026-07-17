'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Tag, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import ShareMenu from '@/components/Shared/ShareMenu' // Importando o ShareMenu correto
import styles from './ProductCard.module.css'
import { ProductCardProps } from '@/core/domain/types'

export function ProductCard({ produto, showCategory = true }: ProductCardProps) {
  const { adicionarItem, getQuantidade, alterarQuantidade } = useCart()
  const toast = useToast()
  const qtd = getQuantidade(produto.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const result = adicionarItem(produto.id, 1)
    if (result.success) {
      toast.sucesso(`🛒 ${produto.nome} adicionado!`)
    } else {
      toast.erro(result.message || 'Erro ao adicionar')
    }
  }

  const handleUpdateQty = (e: React.MouseEvent, value: number) => {
    e.preventDefault()
    e.stopPropagation()
    alterarQuantidade(produto.id, value)
  }

  return (
    <Link href={`/produto/${produto.id}`} className={styles.productCard}>
      <div className={styles.productImageWrapper}>
        {produto.imagem ? (
          <div className={styles.productImageContainer}>
            <Image 
              src={produto.imagem} 
              alt={produto.nome}
              width={300}
              height={300}
              className={styles.productImage}
              loading="lazy"
            />
          </div>
        ) : (
          <div className={styles.imageFallback}>
            <span>🍪</span>
          </div>
        )}

        {/* Container com a classe correta mapeada ao CSS modular */}
        <div 
          className={styles.shareBtnContainer} 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <ShareMenu produto={produto} />
        </div>

        {produto.destaque && (
          <span className={styles.destaqueTag}>
            <Star size={12} /> Destaque
          </span>
        )}
        
        {produto.precoPromocional && (
          <span className={styles.promocaoTag}>
            <Tag size={12} /> Promoção
          </span>
        )}
      </div>

      <div className={styles.productInfo}>
        {showCategory && produto.categoriaNome && (
          <span className={styles.productCategory}>
            {produto.categoriaNome}
          </span>
        )}
        <h4 className={styles.productName}>{produto.nome}</h4>
        <p className={styles.productDesc}>{produto.descricao}</p>
        
        <div className={styles.productMeta}>
          <div className={styles.productPeso}>{produto.peso}</div>
          <div className={styles.productPrice}>
            {produto.precoPromocional ? (
              <>
                <span className={styles.precoAntigo}>
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className={styles.precoPromocional}>
                  R$ {produto.precoPromocional.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
            )}
          </div>
        </div>

        <div className={styles.productActions} onClick={(e) => e.preventDefault()}>
          {qtd === 0 ? (
            <button className={styles.btnAdd} onClick={handleAddToCart}>
              <Plus size={16} /> Adicionar
            </button>
          ) : (
            <>
              <button className={styles.btnQty} onClick={(e) => handleUpdateQty(e, -1)}>−</button>
              <span className={styles.qtyDisplay}>{qtd}</span>
              <button className={styles.btnQty} onClick={(e) => handleUpdateQty(e, 1)}>+</button>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}