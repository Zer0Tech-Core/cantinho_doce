'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  X, ShoppingCart, Trash2, Plus, Minus, Package, Percent, Send, CreditCard, Coins, User, MapPin, Pencil, ChevronRight
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { gerarMensagemWhatsApp } from '@/core/use-cases/formatarPedidoWhatsapp'
import { CartDrawerProps } from '@/core/domain/types'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    carrinho, totalItens, total, pesoTotal, resumo, alterarQuantidade, removerItem, limparCarrinho
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
    const handleOpenCart = () => {
      if (!isOpen) {
        const event = new CustomEvent('forceOpenCartDrawer')
        document.dispatchEvent(event)
      }
    }
    document.addEventListener('openCartDrawer', handleOpenCart)
    return () => document.removeEventListener('openCartDrawer', handleOpenCart)
  }, [isOpen])

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
    if (metodoPagamento !== 'Dinheiro') setTroco('')
  }, [metodoPagamento])

  const handleAlterarQuantidade = (id: string, delta: number) => {
    const result = alterarQuantidade(id, delta)
    if (!result.success) toast.erro(result.message)
  }

  const handleRemoverItem = (id: string, nome: string) => {
    const result = removerItem(id)
    if (result.success) toast.sucesso(`🗑️ ${nome} removido`)
    else toast.erro(result.message)
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

    if (!nome.trim() || !endereco.trim()) {
      toast.erro('Por favor, preencha o seu nome e o endereço de entrega.')
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

    const resultado = gerarMensagemWhatsApp(carrinho, {
      nome, endereco, obs, metodoPagamento, troco: troco ? parseFloat(troco) : undefined
    })

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

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer} ref={drawerRef}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingCart size={22} />
            <h2>
              Carrinho
              {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
            </h2>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Fechar carrinho">
            <X size={24} />
          </button>
        </div>

        {carrinho.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h3>Seu carrinho está vazio</h3>
            <p>Explore nossos produtos e adicione suas delícias favoritas!</p>
            <button className={styles.emptyBtn} onClick={onClose}>
              Continuar Comprando
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <div className={styles.itemsContainer}>
              {carrinho.map((item) => {
                const preco = item.precoPromocional || item.preco
                const subtotal = preco * item.quantidade
                
                return (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemIcon}>
                        <Package size={18} />
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.nome}</span>
                        <span className={styles.itemPeso}>{item.peso}</span>
                        {item.precoPromocional && (
                          <span className={styles.itemPromo}>
                            <Percent size={12} /> Promoção
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.itemQty}>
                        <button className={styles.qtyBtn} onClick={() => handleAlterarQuantidade(item.id, -1)} aria-label="Diminuir quantidade">
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyDisplay}>{item.quantidade}</span>
                        <button className={styles.qtyBtn} onClick={() => handleAlterarQuantidade(item.id, 1)} aria-label="Aumentar quantidade">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className={styles.itemPrice}>
                        {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <button className={styles.itemRemove} onClick={() => handleRemoverItem(item.id, item.nome)} aria-label="Remover item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              {resumo.economia > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryEconomy}`}>
                  <span>Economia</span>
                  <span>- {resumo.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.clearBtn} onClick={handleLimparCarrinho}>
                <Trash2 size={16} /> Limpar
              </button>
              <button className={styles.checkoutBtn} onClick={() => setStep('checkout')}>
                <ChevronRight size={18} /> Finalizar Pedido
              </button>
            </div>
          </>
        ) : (
          <div className={styles.checkout}>
            <button className={styles.backBtn} onClick={() => setStep('cart')}>
              <ChevronRight size={18} /> Voltar ao Carrinho
            </button>

            <form onSubmit={handleFinalizarPedido} className={styles.form}>
              <div className={styles.checkoutSummary}>
                <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
                <span className={styles.checkoutTotal}>
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <div className={styles.formGroup}>
                <label><User size={16} /> Seu nome</label>
                <input type="text" placeholder="Digite seu nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label><MapPin size={16} /> Endereço</label>
                <textarea placeholder="Ex: Praça Central, Campo Grande" required rows={2} value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label><CreditCard size={16} /> Forma de Pagamento</label>
                <select className={styles.formSelect} value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {mostrarTroco && (
                <div className={styles.formGroup}>
                  <label><Coins size={16} /> Troco para quanto?</label>
                  <input type="number" step="0.01" value={troco} onChange={(e) => setTroco(e.target.value)} />
                </div>
              )}

              <button type="submit" className={styles.sendBtn} disabled={isSubmitting}>
                {isSubmitting ? <span className={styles.spinner} /> : <><Send size={18} /> Enviar para WhatsApp</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}