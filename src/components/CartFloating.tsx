'use client'

import { ShoppingCart, Send, Percent, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

interface CartFloatingProps {
  onCheckout: () => void
}

export default function CartFloating({ onCheckout }: CartFloatingProps) {
  const { totalItens, total, resumo, limparCarrinho } = useCart()

  if (totalItens === 0) return null

  return (
    <div className="cart-floating" id="cartFloating">
      <div className="cart-info">
        <span className="items">
          <ShoppingCart size={16} /> {totalItens} {totalItens === 1 ? 'item' : 'itens'}
        </span>
        <span className="total">
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        {resumo.economia > 0 && (
          <span className="cart-economia">
            <Percent size={14} /> Economia: {resumo.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
        <button 
          className="btn-clear" 
          onClick={limparCarrinho}
          aria-label="Limpar carrinho"
        >
          <Trash2 size={14} /> Limpar
        </button>
      </div>
      <button 
        className="btn-checkout" 
        onClick={onCheckout}
        disabled={totalItens === 0}
      >
        <Send size={18} />
        Finalizar Pedido
      </button>
    </div>
  )
}