'use client'

import { ShoppingCart, Send, Percent, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { CartFloatingProps } from '@/core/domain/types'
import styles from './CartFloating.module.css'

export default function CartFloating({ onCheckout }: CartFloatingProps) {
  const { totalItens, total, resumo, limparCarrinho } = useCart()

  if (totalItens === 0) return null

  return (
    <div className={styles.cartFloating} id="cartFloating">
      <div className={styles.cartInfo}>
        <span className="items">
          <ShoppingCart size={16} /> {totalItens} {totalItens === 1 ? 'item' : 'itens'}
        </span>
        <span className="total">
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        {resumo.economia > 0 && (
          <span className={styles.cartEconomia}>
            <Percent size={14} /> Economia: {resumo.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
        <button 
          className={styles.btnClear} 
          onClick={limparCarrinho}
          aria-label="Limpar carrinho"
        >
          <Trash2 size={14} /> Limpar
        </button>
      </div>
      <button 
        className={styles.btnCheckout} 
        onClick={onCheckout}
        disabled={totalItens === 0}
      >
        <Send size={18} />
        Finalizar Pedido
      </button>
    </div>
  )
}