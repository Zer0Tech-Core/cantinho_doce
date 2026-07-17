'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { Produto, ProductActionsProps } from '@/core/domain/types'
import { gerarMensagemWhatsApp } from '@/core/use-cases/formatarPedidoWhatsapp' // Importando seu use-case existente
import styles from './ProductActions.module.css'

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
      const result = alterarQuantidade(produto.id, quantidade)
      if (result.success) {
        toast.sucesso(`🛒 +${quantidade} ${produto.nome}`)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
      } else {
        toast.erro(result.message)
      }
    } else {
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

  // Função disparada ao clicar no botão do WhatsApp Direct
  const handleEnviarWhatsAppDireto = () => {
    const itemPedido = {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      peso: produto.peso,
      preco: produto.preco,
      precoPromocional: produto.precoPromocional,
      quantidade: quantidade, // Envia a quantidade selecionada no contador
      tags: produto.tags || [],
      imagem: produto.imagem || ''
    }

    // Passa o array contendo o item atual e um objeto vazio para os dados do cliente (ou ajuste conforme seu use-case)
    const resultado = gerarMensagemWhatsApp([itemPedido], {} as any)
    
    // Abre o WhatsApp em uma nova aba
    window.open(resultado.url, '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.qtyContainer}>
        <label className={styles.qtyLabel}>Quantidade</label>
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
      </div>

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

      <div className={styles.totalPrice}>
        Total: {(precoFinal * quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>

      <div className={styles.divider} />

      {/* BOTÃO DO WHATSAPP INSERIDO AQUI */}
      <button 
        className={styles.whatsappDirectBtn}
        onClick={handleEnviarWhatsAppDireto}
      >
        💬 Comprar pelo WhatsApp
      </button>

      {qtdNoCarrinho > 0 && (
        <div className={styles.cartIndicator}>
          {qtdNoCarrinho} {qtdNoCarrinho === 1 ? 'unidade' : 'unidades'} no carrinho
        </div>
      )}
    </div>
  )
}