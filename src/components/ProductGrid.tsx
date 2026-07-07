'use client'

import { Plus, Package, Star, Tag, Search } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

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
}

interface ProductGridProps {
  produtos: Produto[]
  categoria?: { nome: string; icone: string }
  isSearch?: boolean
}

export default function ProductGrid({ produtos, categoria, isSearch }: ProductGridProps) {
  const { getQuantidade, adicionarItem, alterarQuantidade } = useCart()

  if (!produtos || produtos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>Nenhum produto encontrado</p>
        <small>Tente buscar por outro termo</small>
      </div>
    )
  }

  return (
    <div className="products-grid">
      {produtos.map((produto) => {
        const qtd = getQuantidade(produto.id)
        const temImagem = produto.imagem && produto.imagem !== ''

        return (
          <div key={produto.id} className="product-card">
            <div className="product-image">
              {temImagem ? (
                <img 
                  src={produto.imagem} 
                  alt={produto.nome}
                  className="product-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback')
                    if (fallback) (fallback as HTMLElement).style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="image-fallback" style={{ display: temImagem ? 'none' : 'flex' }}>
                <span style={{ fontSize: 56 }}>🍪</span>
              </div>
              {produto.destaque && (
                <span className="destaque-tag">
                  <Star size={14} /> Destaque
                </span>
              )}
              {produto.precoPromocional && (
                <span className="promocao-tag">
                  <Tag size={12} /> 
                  {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}% OFF
                </span>
              )}
              {isSearch && (
                <span className="destaque-tag" style={{ background: '#2196F3' }}>
                  <Search size={14} /> Busca
                </span>
              )}
            </div>
            <div className="product-info">
              <div className="product-name">{produto.nome}</div>
              <div className="product-desc">{produto.descricao}</div>
              <div className="product-meta">
                <span className="product-peso">
                  <Package size={14} /> {produto.peso}
                </span>
                <span className="product-price">
                  {produto.precoPromocional ? (
                    <>
                      <span className="preco-antigo">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className="preco-promocional">
                        R$ {produto.precoPromocional.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `R$ ${(produto.preco || 0).toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="product-actions">
                {qtd === 0 ? (
                  <button 
                    className="btn-add"
                    onClick={() => adicionarItem(produto.id)}
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-qty"
                      onClick={() => alterarQuantidade(produto.id, -1)}
                    >−</button>
                    <span className="qty-display">{qtd}</span>
                    <button 
                      className="btn-qty"
                      onClick={() => alterarQuantidade(produto.id, 1)}
                    >+</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}