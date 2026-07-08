// src/components/CartDrawer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  Percent, 
  Send,
  CreditCard,
  Coins,
  User,
  MapPin,
  Pencil,
  ChevronRight
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { gerarMensagemWhatsApp, validarDadosCliente } from '@/utils/whatsapp'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    carrinho, 
    totalItens, 
    total, 
    pesoTotal, 
    resumo,
    alterarQuantidade,
    removerItem,
    limparCarrinho
  } = useCart()
  
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [obs, setObs] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState('')
  const [troco, setTroco] = useState('')
  const [mostrarTroco, setMostrarTroco] = useState(false)
  
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    setMostrarTroco(metodoPagamento === 'Dinheiro')
    if (metodoPagamento !== 'Dinheiro') {
      setTroco('')
    }
  }, [metodoPagamento])

  const handleAlterarQuantidade = (id: string, delta: number) => {
    const result = alterarQuantidade(id, delta)
    if (!result.success) {
      toast.erro(result.message)
    }
  }

  const handleRemoverItem = (id: string, nome: string) => {
    const result = removerItem(id)
    if (result.success) {
      toast.sucesso(`🗑️ ${nome} removido`)
    } else {
      toast.erro(result.message)
    }
  }

  const handleLimparCarrinho = () => {
    if (carrinho.length === 0) return
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      limparCarrinho()
      toast.aviso('🛒 Carrinho limpo')
    }
  }

  const handleFinalizarPedido = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validacao = validarDadosCliente({ 
      nome, 
      endereco, 
      troco: troco ? parseFloat(troco) : undefined 
    })
    
    if (!validacao.valido) {
      toast.erro(validacao.erros[0])
      setIsSubmitting(false)
      return
    }

    if (metodoPagamento === 'Dinheiro' && troco) {
      const trocoNumero = parseFloat(troco)
      if (isNaN(trocoNumero) || trocoNumero < total) {
        toast.erro(`O valor do troco precisa ser maior que o total do pedido (${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})!`)
        setIsSubmitting(false)
        return
      }
    }

    const resultado = gerarMensagemWhatsApp(
      carrinho,
      {
        nome,
        endereco,
        obs,
        metodoPagamento,
        troco: troco ? parseFloat(troco) : undefined
      },
      'Cantinho Doce',
      '5521972279173'
    )

    window.open(resultado.url, '_blank')
    
    limparCarrinho()
    onClose()
    setStep('cart')
    
    toast.sucesso('📱 Pedido enviado! Confira no WhatsApp.', 4000)
    
    setNome('')
    setEndereco('')
    setObs('')
    setMetodoPagamento('')
    setTroco('')
    setIsSubmitting(false)
  }

  const handleBackToCart = () => {
    setStep('cart')
  }

  if (!isOpen) return null

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer" ref={drawerRef}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-header-left">
            <ShoppingCart size={22} />
            <h2>
              Carrinho
              {totalItens > 0 && <span className="cart-drawer-badge">{totalItens}</span>}
            </h2>
          </div>
          <button 
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X size={24} />
          </button>
        </div>

        {carrinho.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="cart-drawer-empty-icon"><ShoppingCart /></div>
            <h3>Seu carrinho está vazio</h3>
            <p>Explore nossos produtos e adicione suas delícias favoritas!</p>
            <button 
              className="cart-drawer-empty-btn"
              onClick={onClose}
            >
              Continuar Comprando
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <div className="cart-drawer-items">
              {carrinho.map((item) => {
                const preco = item.precoPromocional || item.preco
                const subtotal = preco * item.quantidade
                
                return (
                  <div key={item.id} className="cart-drawer-item">
                    <div className="cart-drawer-item-info">
                      <div className="cart-drawer-item-icon">
                        <Package size={18} />
                      </div>
                      <div className="cart-drawer-item-details">
                        <span className="cart-drawer-item-name">{item.nome}</span>
                        <span className="cart-drawer-item-peso">{item.peso}</span>
                        {item.precoPromocional && (
                          <span className="cart-drawer-item-promo">
                            <Percent size={12} /> Promoção
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="cart-drawer-item-actions">
                      <div className="cart-drawer-item-qty">
                        <button
                          className="cart-drawer-qty-btn"
                          onClick={() => handleAlterarQuantidade(item.id, -1)}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-drawer-qty-display">{item.quantidade}</span>
                        <button
                          className="cart-drawer-qty-btn"
                          onClick={() => handleAlterarQuantidade(item.id, 1)}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="cart-drawer-item-price">
                        {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <button
                        className="cart-drawer-item-remove"
                        onClick={() => handleRemoverItem(item.id, item.nome)}
                        aria-label="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-drawer-summary">
              <div className="cart-drawer-summary-row">
                <span>Subtotal</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              {resumo.economia > 0 && (
                <div className="cart-drawer-summary-row cart-drawer-summary-economy">
                  <span>Economia</span>
                  <span>- {resumo.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              )}
              <div className="cart-drawer-summary-row cart-drawer-summary-total">
                <span>Total</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              {pesoTotal.gramas > 0 && (
                <div className="cart-drawer-summary-row cart-drawer-summary-peso">
                  <span>Peso total</span>
                  <span>{pesoTotal.formatado}</span>
                </div>
              )}
              <div className="cart-drawer-summary-row cart-drawer-summary-itens">
                <span>Itens</span>
                <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
              </div>
            </div>

            <div className="cart-drawer-actions">
              <button
                className="cart-drawer-clear-btn"
                onClick={handleLimparCarrinho}
                disabled={carrinho.length === 0}
              >
                <Trash2 size={16} />
                Limpar
              </button>
              <button
                className="cart-drawer-checkout-btn"
                onClick={() => setStep('checkout')}
                disabled={carrinho.length === 0}
              >
                <ChevronRight size={18} />
                Finalizar Pedido
              </button>
            </div>
          </>
        ) : (
          <div className="cart-drawer-checkout">
            <button 
              className="cart-drawer-back-btn"
              onClick={handleBackToCart}
            >
              <ChevronRight size={18} />
              Voltar ao Carrinho
            </button>

            <form onSubmit={handleFinalizarPedido} className="cart-drawer-form">
              <div className="cart-drawer-checkout-summary">
                <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
                <span className="cart-drawer-checkout-total">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <div className="cart-drawer-form-group">
                <label><User size={16} /> Seu nome</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="cart-drawer-form-group">
                <label><MapPin size={16} /> Ponto de encontro / Endereço</label>
                <textarea
                  placeholder="Ex: Praça Central, Campo Grande - RJ"
                  required
                  rows={2}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>

              <div className="cart-drawer-form-group">
                <label><CreditCard size={16} /> Forma de Pagamento</label>
                <select
                  className="cart-drawer-form-select"
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                </select>
              </div>

              {mostrarTroco && (
                <div className="cart-drawer-form-group">
                  <label><Coins size={16} /> Troco para quanto?</label>
                  <input
                    type="number"
                    placeholder="Ex: 50,00"
                    step="0.01"
                    min="0"
                    value={troco}
                    onChange={(e) => setTroco(e.target.value)}
                  />
                  <small>💡 Digite o valor que você vai pagar</small>
                </div>
              )}

              <div className="cart-drawer-form-group">
                <label><Pencil size={16} /> Observações (opcional)</label>
                <textarea
                  placeholder="Alguma preferência? (ex: sem açúcar, mais crocante...)"
                  rows={2}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="cart-drawer-send-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="cart-drawer-spinner" />
                ) : (
                  <>
                    <Send size={18} />
                    Enviar para WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}