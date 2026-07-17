// src/core/use-cases/formatarPedidoWhatsapp.ts
// =============================================
// CORE USE-CASE - Centralização das Mensagens WhatsApp
// =============================================
import { CartItem, DadosCliente, ConfigWhatsApp, ResultadoWhatsApp, ValidacaoCliente, ParamsWhatsApp } from '@/core/domain/types'
import { LOJA } from '@/core/domain/data' // Consumindo diretamente a Única Fonte de Verdade da loja

// ===========================================
// CONFIGURAÇÕES PADRÃO
// ===========================================
const CONFIG_PADRAO: ConfigWhatsApp = {
  idioma: 'pt_BR',
  timeout: 5000,
  abrirNovaAba: true,
  formatarNumeros: true,
  incluirResumo: true,
  incluirPeso: true,
  incluirEconomia: true,
  incluirData: true
}

// ===========================================
// FUNÇÕES DE INTENÇÃO (NOVAS ADIÇÕES)
// ===========================================

/**
 * Gera o link direto para tirar dúvidas sobre um produto específico do site
 */
export function obterLinkDuvidaProduto(nomeProduto: string, idProduto: string): string {
  const mensagem = `Olá! Gostaria de mais informações sobre o produto *${nomeProduto}* que vi no site.\n\nLink do produto: https://cantinhodoce.cg/produto/${idProduto}`
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

/**
 * Gera o link para contato genérico ("Vim do site")
 */
export function obterLinkContatoGenerico(): string {
  const mensagem = `Olá, vim do site ${LOJA.nome} e gostaria de conhecer mais sobre os produtos!`
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

// ===========================================
// FUNÇÃO PRINCIPAL (ATUALIZADA)
// ===========================================

/**
 * Gera o link do WhatsApp com a mensagem de pedido formatada
 */
export function gerarMensagemWhatsApp(
  carrinho: CartItem[],
  dadosCliente: DadosCliente = {} as DadosCliente,
  opcoes: ConfigWhatsApp = {}
): ResultadoWhatsApp {
  const config = { ...CONFIG_PADRAO, ...opcoes }
  const { nome, endereco, obs, metodoPagamento, troco } = dadosCliente

  // Pegando dados estáticos do json injetado pelo index.ts
  const nomeLoja = LOJA.nome
  const telefone = LOJA.whatsapp

  // ===========================================
  // CÁLCULOS
  // ===========================================
  const total = carrinho.reduce((sum, item) => {
    const preco = item.precoPromocional || item.preco
    return sum + (preco * item.quantidade)
  }, 0)

  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0)
  const pesoTotal = calcularPesoTotal(carrinho)
  const economia = calcularEconomia(carrinho)

  // ===========================================
  // CONSTRUÇÃO DA MENSAGEM
  // ===========================================
  let mensagem = ''

  mensagem += `🛒 *NOVO PEDIDO - ${nomeLoja}* 🛒\n`
  mensagem += `══════════════════════════════\n\n`

  if (nome) mensagem += `👤 *Cliente:* ${nome}\n`
  if (endereco) mensagem += `📍 *Entrega:* ${endereco}\n`
  if (metodoPagamento) mensagem += `💳 *Pagamento:* ${metodoPagamento}\n`
  if (troco) mensagem += `🔄 *Troco para:* R$ ${troco.toFixed(2)}\n`
  if (obs) mensagem += `*Observações:* ${obs}\n`

  mensagem += `\n`
  mensagem += `📋 *ITENS DO PEDIDO*\n`
  mensagem += `────────────────────\n`

  carrinho.forEach((item, index) => {
    const preco = item.precoPromocional || item.preco
    const subtotal = preco * item.quantidade
    const numero = String(index + 1).padStart(2, '0')
    const qtd = String(item.quantidade).padStart(2, ' ')

    mensagem += `${numero}. ${qtd}x ${item.nome}`
    if (item.peso) mensagem += ` (${item.peso})`
    mensagem += `\n   💰 R$ ${subtotal.toFixed(2)}`

    if (item.quantidade > 1) {
      mensagem += ` (R$ ${preco.toFixed(2)}/un)`
    }
    mensagem += `\n`
  })

  mensagem += `────────────────────\n`

  mensagem += `\n*RESUMO DO PEDIDO*\n`
  mensagem += `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}\n`
  mensagem += `💰 *Total: R$ ${total.toFixed(2)}*\n`

  if (economia > 0) {
    mensagem += `💸 *Economia: R$ ${economia.toFixed(2)}*\n`
  }

  if (pesoTotal > 0 && config.incluirPeso) {
    const pesoFormatado = pesoTotal >= 1000
      ? `${(pesoTotal / 1000).toFixed(2)}kg`
      : `${pesoTotal}g`
    mensagem += `⚖️ *Peso total: ${pesoFormatado}*\n`
  }

  if (config.incluirData) {
    const agora = new Date()
    const dataFormatada = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    mensagem += `\n📅 ${dataFormatada} - ${horaFormatada}\n`
  }

  mensagem += `\n══════════════════════════════\n`
  mensagem += `🙏 *Obrigado pela preferência!*\n`
  mensagem += `📍 *${LOJA.nomeCompleto}* - ${LOJA.endereco}\n`
  mensagem += `📱 *WhatsApp:* ${formatarTelefone(telefone)}\n`
  mensagem += `📸 *Instagram:* ${LOJA.instagram}\n`

  const numeroLimpo = limparNumero(telefone)
  const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`

  return {
    url,
    mensagem,
    total,
    totalItens,
    pesoTotal,
    economia,
    dados: { nome, endereco, obs, metodoPagamento, troco },
    config
  }
}

// ===========================================
// FUNÇÕES AUXILIARES INTERNAS
// ===========================================
function calcularPesoTotal(carrinho: CartItem[]): number {
  let totalGramas = 0
  carrinho.forEach(item => {
    if (item.peso) {
      const pesoNumerico = parseInt(item.peso)
      if (!isNaN(pesoNumerico)) {
        totalGramas += pesoNumerico * item.quantidade
      }
    }
  })
  return totalGramas
}

function calcularEconomia(carrinho: CartItem[]): number {
  let economia = 0
  carrinho.forEach(item => {
    if (item.precoPromocional && item.precoPromocional < item.preco) {
      economia += (item.preco - item.precoPromocional) * item.quantidade
    }
  })
  return economia
}

function limparNumero(telefone: string): string {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

function formatarTelefone(telefone: string): string {
  if (!telefone) return ''
  const limpo = limparNumero(telefone)
  if (limpo.length === 13) {
    return `+${limpo.slice(0, 2)} ${limpo.slice(2, 4)} ${limpo.slice(4, 9)}-${limpo.slice(9)}`
  }
  return telefone
}

/**
 * Disparador de abertura
 */
export function abrirWhatsApp(params: Omit<ParamsWhatsApp, 'nomeLoja' | 'telefone'>): Window | null {
  const resultado = gerarMensagemWhatsApp(params.carrinho, params.dadosCliente, params.opcoes)

  if (params.opcoes?.abrirNovaAba !== false) {
    return window.open(resultado.url, '_blank')
  } else {
    window.location.href = resultado.url
    return null
  }
}