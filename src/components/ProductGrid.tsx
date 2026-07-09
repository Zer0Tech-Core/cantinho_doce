// src/components/ProductGrid.tsx
'use client'

import { useState } from 'react'
import { Plus, Package, Star, Tag, Search } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import ProductImage from './ProductImage'
import ProductModal from './ProductModal' // 🔥 NOVO

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
}

interface ProductGridProps {
  produtos: Produto[]
  categoria?: { nome: string; icone: string }
  isSearch?: boolean
}

export default function ProductGrid({ produtos, categoria, isSearch }: ProductGridProps) {
  const { getQuantidade, adicionarItem, alterarQuantidade } = useCart()
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null) // 🔥 NOVO
  const [isModalOpen, setIsModalOpen] = useState(false) // 🔥 NOVO

  if (!produtos || produtos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>Nenhum produto encontrado</p>
        <small>Tente buscar por outro termo</small>
      </div>
    )
  }

  const handleOpenModal = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setProdutoSelecionado(null), 300)
  }

  return (
    <>
      <div className="products-grid">
        {produtos.map((produto) => {
          const qtd = getQuantidade(produto.id)
          const temImagem = produto.imagem && produto.imagem !== ''

          return (
            <div 
              key={produto.id} 
              className="product-card"
              onClick={() => handleOpenModal(produto)} // 🔥 CLICA NO CARD
            >
              <div className="product-image-wrapper">
                {temImagem ? (
                  <ProductImage
                    src={produto.imagem}
                    name={produto.nome}
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="image-fallback">
                    <span style={{ fontSize: 56 }}>🍪</span>
                  </div>
                )}
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
                <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                  {qtd === 0 ? (
                    <button 
                      className="btn-add"
                      onClick={(e) => {
                        e.stopPropagation()
                        adicionarItem(produto.id)
                      }}
                    >
                      <Plus size={16} /> Adicionar
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn-qty"
                        onClick={(e) => {
                          e.stopPropagation()
                          alterarQuantidade(produto.id, -1)
                        }}
                      >−</button>
                      <span className="qty-display">{qtd}</span>
                      <button 
                        className="btn-qty"
                        onClick={(e) => {
                          e.stopPropagation()
                          alterarQuantidade(produto.id, 1)
                        }}
                      >+</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 🔥 MODAL DE DETALHES */}
      <ProductModal
        produto={produtoSelecionado}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}