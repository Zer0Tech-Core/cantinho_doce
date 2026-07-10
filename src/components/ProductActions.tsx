// src/components/ProductActions.tsx
'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Send, Check } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { gerarMensagemWhatsApp } from '@/utils/whatsapp'
import styles from '@/app/produto/[id]/page.module.css'

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

interface ProductActionsProps {
  produto: Produto
}

export default function ProductActions({ produto }: ProductActionsProps) {
  const { getQuantidade, adicionarItem, alterarQuantidade } = useCart()
  const toast = useToast()
  const [quantidade, setQuantidade] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const qtdNoCarrinho = getQuantidade(produto.id)
  const precoFinal = produto.precoPromocional || produto.preco

  const handleAdicionarAoCarrinho = () => {
    setIsLoading(true)
    
    if (qtdNoCarrinho > 0) {
      // Se já tem no carrinho, adiciona mais
      const result = alterarQuantidade(produto.id, quantidade)
      if (result.success) {
        toast.sucesso(`🛒 +${quantidade} ${produto.nome}`)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
      } else {
        toast.erro(result.message)
      }
    } else {
      // Adiciona pela primeira vez
      const result = adicionarItem(produto.id, quantidade)
      if (result.success) {
        toast.sucesso(`🛒 ${produto.nome} adicionado!`)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
      } else {
        toast.erro(result.message)
      }
    }
    
    setIsLoading(false)
  }

  const handleWhatsApp = () => {
    const carrinho = [{
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      peso: produto.peso,
      preco: produto.preco,
      precoPromocional: produto.precoPromocional,
      quantidade: quantidade,
      tags: produto.tags
    }]

    const resultado = gerarMensagemWhatsApp(
      carrinho,
      {} as any,
      'Cantinho Doce',
      '5521972279173'
    )

    window.open(resultado.url, '_blank')
  }

  return (
    <div className={styles.actionsContainer}>
      {/* Controle de Quantidade */}
      <div className={styles.qtyContainer}>
        <label className={styles.qtyLabel}>Quantidade</label>
        <div className={styles.qtyControls}>
          <button
            className={styles.qtyBtn}
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            disabled={quantidade <= 1}
            aria-label="Diminuir quantidade"
          >
            <Minus size={16} />
          </button>
          <span className={styles.qtyDisplay}>{quantidade}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => setQuantidade(quantidade + 1)}
            aria-label="Aumentar quantidade"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Botão Adicionar ao Carrinho */}
      <button
        className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
        onClick={handleAdicionarAoCarrinho}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner} />
        ) : isAdded ? (
          <>
            <Check size={18} />
            Adicionado!
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Adicionar ao Carrinho
          </>
        )}
      </button>

      {/* Preço total */}
      <div className={styles.totalPrice}>
        Total: {(precoFinal * quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>

      <div className={styles.divider} />

      {/* Indicador de itens no carrinho */}
      {qtdNoCarrinho > 0 && (
        <div className={styles.cartIndicator}>
          {qtdNoCarrinho} {qtdNoCarrinho === 1 ? 'unidade' : 'unidades'} no carrinho
        </div>
      )}
    </div>
  )
}