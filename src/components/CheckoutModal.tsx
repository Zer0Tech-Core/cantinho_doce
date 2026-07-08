// src/components/CheckoutModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  X, Package, DollarSign, User, MapPin, 
  Pencil, Send, CreditCard, Coins, Clipboard,
  Trash2, Plus, Minus
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { gerarMensagemWhatsApp, validarDadosCliente } from '@/utils/whatsapp'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { carrinho, total, pesoTotal, limparCarrinho, alterarQuantidade, removerItem } = useCart()
  const toast = useToast()
  
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [obs, setObs] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState('')
  const [troco, setTroco] = useState('')
  const [mostrarTroco, setMostrarTroco] = useState(false)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    setMostrarTroco(metodoPagamento === 'Dinheiro')
    if (metodoPagamento !== 'Dinheiro') {
      setTroco('')
    }
  }, [metodoPagamento])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Valida os dados do cliente
    const validacao = validarDadosCliente({ 
      nome, 
      endereco, 
      troco: troco ? parseFloat(troco) : undefined 
    })
    
    if (!validacao.valido) {
      toast.erro(validacao.erros[0])
      return
    }

    // Validação do troco
    if (metodoPagamento === 'Dinheiro' && troco) {
      const trocoNumero = parseFloat(troco)
      if (isNaN(trocoNumero) || trocoNumero < total) {
        toast.erro(`O valor do troco precisa ser maior que o total do pedido (${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})!`)
        return
      }
    }

    // Gera a mensagem do WhatsApp
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

    // Abre o WhatsApp
    window.open(resultado.url, '_blank')
    
    // Limpa o carrinho e fecha o modal
    limparCarrinho()
    onClose()
    
    toast.sucesso('📱 Pedido enviado! Confira no WhatsApp.', 3500)
    
    // Reset form
    setNome('')
    setEndereco('')
    setObs('')
    setMetodoPagamento('')
    setTroco('')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>
            <Clipboard size={20} /> Finalizar Pedido
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={24} />
          </button>
        </div>

        <div className="modal-items">
          {carrinho.map((item) => {
            const preco = item.precoPromocional || item.preco
            return (
              <div key={item.id} className="modal-item">
                <div className="modal-item-info">
                  <span className="item-name">
                    <Package size={14} /> {item.nome}
                  </span>
                  <span className="item-peso">{item.peso}</span>
                </div>
                <div className="modal-item-actions">
                  <button 
                    className="item-qty-btn"
                    onClick={() => alterarQuantidade(item.id, -1)}
                    aria-label="Remover um"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="item-qty">{item.quantidade}</span>
                  <button 
                    className="item-qty-btn"
                    onClick={() => alterarQuantidade(item.id, 1)}
                    aria-label="Adicionar um"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    className="item-remove-btn"
                    onClick={() => removerItem(item.id)}
                    aria-label="Remover item"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="item-price">
                    {(preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="modal-total">
          <div className="modal-total-row">
            <span><DollarSign size={20} /> Total</span>
            <span className="modal-total-value">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          {pesoTotal && pesoTotal.gramas > 0 && (
            <div className="modal-total-row modal-total-peso">
              <span><Package size={14} /> Peso total</span>
              <span>{pesoTotal.formatado}</span>
            </div>
          )}
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clienteNome">
              <User size={16} /> Seu nome
            </label>
            <input
              type="text"
              id="clienteNome"
              placeholder="Digite seu nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clienteEndereco">
              <MapPin size={16} /> Ponto de encontro / Endereço
            </label>
            <textarea
              id="clienteEndereco"
              placeholder="Ex: Praça Central, Campo Grande - RJ"
              required
              rows={2}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="metodoPagamento">
              <CreditCard size={16} /> Forma de Pagamento
            </label>
            <select
              id="metodoPagamento"
              className="form-select"
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
            <div className="form-group" id="trocoGroup">
              <label htmlFor="troco">
                <Coins size={16} /> Troco para quanto?
              </label>
              <input
                type="number"
                id="troco"
                placeholder="Ex: 50,00"
                step="0.01"
                min="0"
                value={troco}
                onChange={(e) => setTroco(e.target.value)}
              />
              <small>💡 Digite o valor que você vai pagar para calcular o troco</small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="clienteObs">
              <Pencil size={16} /> Observações (opcional)
            </label>
            <textarea
              id="clienteObs"
              placeholder="Alguma preferência? (ex: sem açúcar, mais crocante...)"
              rows={2}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-send-whatsapp">
            <Send size={18} />
            Enviar para WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}