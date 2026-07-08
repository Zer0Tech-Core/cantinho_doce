// src/utils/whatsapp.ts
// =============================================
// WHATSAPP - Integracao com API (Next.js)
// =============================================

// ===========================================
// 📦 TIPAGEM
// ===========================================

export interface ItemCarrinho {
  id: string
  nome: string
  descricao?: string
  peso: string
  preco: number
  precoPromocional?: number
  quantidade: number
  icone?: string
  categoria?: string
  tags?: string[]
}

export interface DadosCliente {
  nome: string
  endereco: string
  obs?: string
  metodoPagamento?: string
  troco?: number
}

export interface ConfigWhatsApp {
  idioma?: string
  timeout?: number
  abrirNovaAba?: boolean
  formatarNumeros?: boolean
  incluirResumo?: boolean
  incluirPeso?: boolean
  incluirEconomia?: boolean
  incluirData?: boolean
}

export interface ResultadoWhatsApp {
  url: string
  mensagem: string
  total: number
  totalItens: number
  pesoTotal: number
  economia: number
  dados: DadosCliente
  config: ConfigWhatsApp
}

export interface ValidacaoCliente {
  valido: boolean
  erros: string[]
}

// ===========================================
// 📦 CONFIGURAÇÕES PADRÃO
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
// 🔧 FUNÇÃO PRINCIPAL
// ===========================================

/**
 * Gera o link do WhatsApp com a mensagem formatada
 * @param {ItemCarrinho[]} carrinho - Lista de itens no carrinho
 * @param {DadosCliente} dadosCliente - Dados do cliente
 * @param {string} nomeLoja - Nome da loja
 * @param {string} telefone - Número do WhatsApp
 * @param {ConfigWhatsApp} opcoes - Opções adicionais
 * @returns {ResultadoWhatsApp} Objeto com URL e dados da mensagem
 */
export function gerarMensagemWhatsApp(
  carrinho: ItemCarrinho[],
  dadosCliente: DadosCliente = {} as DadosCliente,
  nomeLoja: string = 'Cantinho Doce',
  telefone: string = '5521972279173',
  opcoes: ConfigWhatsApp = {}
): ResultadoWhatsApp {
  const config = { ...CONFIG_PADRAO, ...opcoes }
  const { nome, endereco, obs, metodoPagamento, troco } = dadosCliente

  // ===========================================
  // 📊 CÁLCULOS
  // ===========================================

  const total = carrinho.reduce((sum, item) => {
    const preco = item.precoPromocional || item.preco
    return sum + (preco * item.quantidade)
  }, 0)

  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0)
  const pesoTotal = calcularPesoTotal(carrinho)
  const economia = calcularEconomia(carrinho)

  // ===========================================
  // 📝 CONSTRUÇÃO DA MENSAGEM
  // ===========================================

  let mensagem = ''

  // Cabeçalho
  mensagem += `🛒 *NOVO PEDIDO - ${nomeLoja}* 🛒\n`
  mensagem += `══════════════════════════════\n\n`

  // Dados do Cliente
  if (nome) mensagem += `👤 *Cliente:* ${nome}\n`
  if (endereco) mensagem += `📍 *Entrega:* ${endereco}\n`
  if (metodoPagamento) mensagem += `💳 *Pagamento:* ${metodoPagamento}\n`
  if (troco) mensagem += `🔄 *Troco para:* R$ ${troco.toFixed(2)}\n`
  if (obs) mensagem += `📝 *Observações:* ${obs}\n`

  mensagem += `\n`

  // Itens do Pedido
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

  // Resumo do Pedido
  mensagem += `\n📊 *RESUMO DO PEDIDO*\n`
  mensagem += `📦 ${totalItens} ${totalItens === 1 ? 'item' : 'itens'}\n`
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

  // Data e Hora
  if (config.incluirData) {
    const agora = new Date()
    const dataFormatada = agora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const horaFormatada = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    mensagem += `\n📅 ${dataFormatada} - ${horaFormatada}\n`
  }

  // Rodapé
  mensagem += `\n══════════════════════════════\n`
  mensagem += `🙏 *Obrigado pela preferência!*\n`
  mensagem += `📍 *${nomeLoja}* - Campo Grande - RJ\n`
  mensagem += `📱 *WhatsApp:* ${formatarTelefone(telefone)}\n`
  mensagem += `📸 *Instagram:* @cantinho_doce.cg\n`

  // Gerar URL
  const numeroLimpo = limparNumero(telefone)
  const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`

  return {
    url,
    mensagem,
    total,
    totalItens,
    pesoTotal,
    economia,
    dados: {
      nome,
      endereco,
      obs,
      metodoPagamento,
      troco
    },
    config
  }
}

// ===========================================
// 📦 FUNÇÕES AUXILIARES
// ===========================================

/**
 * Calcula o peso total do carrinho em gramas
 */
function calcularPesoTotal(carrinho: ItemCarrinho[]): number {
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

/**
 * Calcula a economia total (se houver preços promocionais)
 */
function calcularEconomia(carrinho: ItemCarrinho[]): number {
  let economia = 0
  carrinho.forEach(item => {
    if (item.precoPromocional && item.precoPromocional < item.preco) {
      economia += (item.preco - item.precoPromocional) * item.quantidade
    }
  })
  return economia
}

/**
 * Limpa o número de telefone (remove caracteres especiais)
 */
function limparNumero(telefone: string): string {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

/**
 * Formata o telefone para exibição
 */
function formatarTelefone(telefone: string): string {
  if (!telefone) return ''
  const limpo = limparNumero(telefone)
  if (limpo.length === 13) {
    // +55 21 97227-9173
    return `+${limpo.slice(0, 2)} ${limpo.slice(2, 4)} ${limpo.slice(4, 9)}-${limpo.slice(9)}`
  }
  if (limpo.length === 11) {
    // 21 97227-9173
    return `${limpo.slice(0, 2)} ${limpo.slice(2, 7)}-${limpo.slice(7)}`
  }
  return telefone
}

// ===========================================
// 🚀 ATALHOS
// ===========================================

interface ParamsWhatsApp {
  carrinho: ItemCarrinho[]
  dadosCliente: DadosCliente
  nomeLoja?: string
  telefone?: string
  opcoes?: ConfigWhatsApp
}

/**
 * Abre o WhatsApp com a mensagem formatada
 */
export function abrirWhatsApp(params: ParamsWhatsApp): Window | null {
  const resultado = gerarMensagemWhatsApp(
    params.carrinho,
    params.dadosCliente,
    params.nomeLoja,
    params.telefone,
    params.opcoes
  )

  if (params.opcoes?.abrirNovaAba !== false) {
    return window.open(resultado.url, '_blank')
  } else {
    window.location.href = resultado.url
    return null
  }
}

/**
 * Gera uma prévia da mensagem (sem enviar)
 */
export function previewWhatsApp(params: ParamsWhatsApp): string {
  const resultado = gerarMensagemWhatsApp(
    params.carrinho,
    params.dadosCliente,
    params.nomeLoja,
    params.telefone,
    params.opcoes
  )
  return resultado.mensagem
}

/**
 * Copia a mensagem para a área de transferência
 */
export async function copiarMensagemWhatsApp(
  params: ParamsWhatsApp
): Promise<{ success: boolean; mensagem?: string; error?: string }> {
  const resultado = gerarMensagemWhatsApp(
    params.carrinho,
    params.dadosCliente,
    params.nomeLoja,
    params.telefone,
    params.opcoes
  )

  try {
    await navigator.clipboard.writeText(resultado.mensagem)
    return { success: true, mensagem: resultado.mensagem }
  } catch (error) {
    console.error('Erro ao copiar mensagem:', error)
    return { success: false, error: (error as Error).message }
  }
}

// ===========================================
// 📋 VALIDAÇÕES
// ===========================================

/**
 * Valida os dados do cliente
 */
export function validarDadosCliente(dados: Partial<DadosCliente>): ValidacaoCliente {
  const erros: string[] = []

  if (!dados.nome || dados.nome.trim() === '') {
    erros.push('Nome é obrigatório')
  }

  if (!dados.endereco || dados.endereco.trim() === '') {
    erros.push('Endereço é obrigatório')
  }

  if (dados.troco && isNaN(dados.troco)) {
    erros.push('Valor do troco inválido')
  }

  return {
    valido: erros.length === 0,
    erros
  }
}

/**
 * Valida o telefone
 */
export function validarTelefone(telefone: string): boolean {
  if (!telefone) return false
  const limpo = limparNumero(telefone)
  return limpo.length >= 10 && limpo.length <= 13
}

// ===========================================
// 📊 MODELOS DE MENSAGEM
// ===========================================

/**
 * Gera mensagem para pedido de confirmação
 */
export function mensagemConfirmacao(
  carrinho: ItemCarrinho[],
  dadosCliente: DadosCliente,
  nomeLoja: string,
  telefone: string
): ResultadoWhatsApp {
  const resultado = gerarMensagemWhatsApp(carrinho, dadosCliente, nomeLoja, telefone)

  return {
    ...resultado,
    mensagem: `✅ *CONFIRMAÇÃO DE PEDIDO*\n\n${resultado.mensagem}`
  }
}

/**
 * Gera mensagem para pedido com entrega agendada
 */
export function mensagemComAgendamento(
  carrinho: ItemCarrinho[],
  dadosCliente: DadosCliente,
  nomeLoja: string,
  telefone: string,
  dataEntrega: string,
  horaEntrega: string
): ResultadoWhatsApp {
  const resultado = gerarMensagemWhatsApp(carrinho, dadosCliente, nomeLoja, telefone)

  let mensagem = resultado.mensagem
  mensagem = mensagem.replace(
    '📋 *ITENS DO PEDIDO*',
    `📅 *ENTREGA AGENDADA*\n📆 ${dataEntrega}\n🕐 ${horaEntrega}\n\n📋 *ITENS DO PEDIDO*`
  )

  return {
    ...resultado,
    mensagem
  }
}

// ===========================================
// 🐛 DEBUG
// ===========================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('📱 Módulo WhatsApp carregado!')
  console.log('🔧 Use abrirWhatsApp() para enviar mensagem')
  console.log('📋 Use previewWhatsApp() para ver a mensagem')

  ;(window as any).__WHATSAPP = {
    gerar: gerarMensagemWhatsApp,
    abrir: abrirWhatsApp,
    preview: previewWhatsApp,
    validar: validarDadosCliente
  }
}