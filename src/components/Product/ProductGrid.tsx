'use client'

import { Plus, Package, Star, Tag, Search, Box } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import ProductImage from './ProductImage'
import { Produto, ProductGridProps } from '@/core/domain/types'
import styles from './ProductGrid.module.css'

export default function ProductGrid({ produtos, categoria, isSearch }: ProductGridProps) {
  const { getQuantidade, adicionarItem, alterarQuantidade } = useCart()

  if (!produtos || produtos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}><Box /></span>
        <p>Nenhum produto encontrado</p>
        <small>Tente buscar por outro termo</small>
      </div>
    )
  }

  return (
    <div className={styles.productsGrid}>
      {produtos.map((produto) => {
        const qtd = getQuantidade(produto.id)
        const temImagem = produto.imagem && produto.imagem !== ''

        return (
          <Link
            key={produto.id}
            href={`/produto/${produto.id}`}
            className={styles.productCard}
          >
            <div className={styles.productImageWrapper}>
              {temImagem ? (
                <ProductImage
                  src={produto.imagem}
                  name={produto.nome}
                  width={200}  // <-- Menor
                  height={200} // <-- Menor
                />
              ) : (
                <div className={styles.imageFallback}>
                  <span>🍪</span>
                </div>
              )}
              
              {/* Badges posicionados dentro da imagem */}
              {produto.destaque && (
                <span className={styles.destaqueTag}>
                  <Star size={10} /> Destaque
                </span>
              )}
              
              {produto.precoPromocional && (
                <span className={styles.promocaoTag}>
                  <Tag size={10} /> 
                  {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}%
                </span>
              )}
              
              {isSearch && (
                <span className={styles.searchTag}>
                  <Search size={10} />
                </span>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <div className={styles.productName}>{produto.nome}</div>
              <div className={styles.productDesc}>{produto.descricao}</div>
              
              <div className={styles.productMeta}>
                <span className={styles.productPeso}>
                  <Package size={12} /> {produto.peso}
                </span>
                <span className={styles.productPrice}>
                  {produto.precoPromocional ? (
                    <>
                      <span className={styles.precoAntigo}>
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className={styles.precoPromocional}>
                        R$ {produto.precoPromocional.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `R$ ${(produto.preco || 0).toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div 
                className={styles.productActions} 
                onClick={(e) => e.preventDefault()}
              >
                {qtd === 0 ? (
                  <button 
                    className={styles.btnAdd}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      adicionarItem(produto.id)
                    }}
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                ) : (
                  <>
                    <button 
                      className={styles.btnQty}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        alterarQuantidade(produto.id, -1)
                      }}
                    >−</button>
                    <span className={styles.qtyDisplay}>{qtd}</span>
                    <button 
                      className={styles.btnQty}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        alterarQuantidade(produto.id, 1)
                      }}
                    >+</button>
                  </>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}