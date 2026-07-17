// src/core/domain/types.ts
// Única fonte de verdade do sistema para tipagens

// ==========================================
// [ 1 ] CORE / DOMAIN ENTITIES (Entidades Base)
// ==========================================

export interface Loja {
  nome: string
  nomeCompleto: string
  telefone: string
  whatsapp: string
  endereco: string
  instagram: string
  email?: string
  horario: string
  cores: {
    primaria: string
    secundaria: string
    destaque: string
  }
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  imagem: string
  peso: string
  preco: number
  precoPromocional?: number
  destaque?: boolean
  icone?: string
  emEstoque?: boolean
  categoria?: string     // ID da categoria correspondente
  categoriaNome?: string // Nome amigável da categoria
  tags?: string[]
}

// Extende o produto base injetando obrigatoriamente o contexto da categoria
export interface ProdutoComCategoria extends Produto {
  categoriaId: string
  categoriaNome: string
}

export interface Categoria {
  produtos: Produto[]
  id: string
  nome: string
  descricao: string
  icone: string
  cor: string
  destaque: boolean
}

// Extende a categoria para quando ela carregar a sua lista interna de produtos
export interface CategoriaComProdutos extends Categoria {
  produtos: Produto[]
}


// ==========================================
// [ 2 ] CART / CARRINHO
// ==========================================

export interface CartItem extends Omit<Produto, 'emEstoque'> {
  quantidade: number
  dataAdicao?: string
}

export interface PesoTotal {
  gramas: number
  kg: number
  formatado: string
}

export interface ResumoCarrinho {
  totalItens: number
  totalItensUnicos: number
  subtotal: number
  economia: number
  temEconomia: boolean
  itemMaisCaro: CartItem | null
  itens: CartItem[]
  categorias: string[]
}

export interface CartContextType {
  carrinho: CartItem[]
  totalItens: number
  total: number
  pesoTotal: PesoTotal
  resumo: ResumoCarrinho
  getQuantidade: (id: string) => number
  estaNoCarrinho: (id: string) => boolean
  adicionarItem: (produtoId: string, quantidade?: number) => { success: boolean; message: string }
  alterarQuantidade: (produtoId: string, delta: number) => { success: boolean; message: string; quantidade: number }
  removerItem: (produtoId: string) => { success: boolean; message: string }
  limparCarrinho: () => { success: boolean; message: string }
  exportarCarrinho: () => string
  importarCarrinho: (jsonString: string) => { success: boolean; message: string }
  resetarCarrinho: () => { success: boolean; message: string }
}


// ==========================================
// [ 3 ] WHATSAPP / CHECKOUT INTEGRATION
// ==========================================

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

export interface ParamsWhatsApp {
  carrinho: CartItem[] // Unificado para usar CartItem em vez de ItemCarrinho duplicado
  dadosCliente: DadosCliente
  nomeLoja?: string
  telefone?: string
  opcoes?: ConfigWhatsApp
}


// ==========================================
// [ 4 ] NEXT.JS & UI COMPONENT PROPS
// ==========================================

// Next.js 15 Dynamic Page Params (com suporte à Promise obrigatória)
export interface PageProps {
  params: Promise<{
    id: string
  }>
}

export interface ProductModalProps {
  produto: Produto | null
  isOpen: boolean
  onClose: () => void
}

export interface ProductGridProps {
  produtos: Produto[]
  categoria?: { nome: string; icone: string }
  isSearch?: boolean
}

export interface ProductActionsProps {
  produto: Produto
}

export interface CartFloatingProps {
  onCheckout: () => void
}

export interface ShareMenuProps {
  produto: Pick<Produto, 'id' | 'nome' | 'descricao' | 'preco' | 'precoPromocional' | 'imagem' | 'peso'>
  className?: string
}

export interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSearch?: (value: string) => void
  isLoading?: boolean
  showClear?: boolean
  showMic?: boolean
}

export interface ProductImageProps {
  src: string
  name: string
  priority?: boolean
  width?: number
  height?: number
  className?: string
}

export interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export interface UnifiedHeaderProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  categorias?: Categoria[]
  categoriaAtiva?: string
  onCategoriaChange?: (id: string) => void
  isSearching?: boolean
  showCategories?: boolean
  onCartClick?: () => void
}

export interface ClientHeaderProps {
  showCategories?: boolean
}

export interface ProductCardProps {
  produto: ProdutoComCategoria
  showCategory?: boolean
}

export interface HomePageProps {
  categorias: Categoria[]
  produtos: {
    getProdutosEmDestaque: () => ProdutoComCategoria[]
    loja: Loja
  }
  onCategoriaClick: (categoriaId: string) => void
}

export interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CategoriesProps {
  categorias: Categoria[]
  categoriaAtiva: string
  onCategoriaChange: (id: string) => void
}

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}


// ==========================================
// [ 5 ] SERVICES / UTILS (Toast & Counter)
// ==========================================

export type TipoToast = 'sucesso' | 'erro' | 'aviso' | 'info' | 'destaque'

export interface ToastOptions {
  duracao?: number
  botaoFechar?: boolean
  barraProgresso?: boolean
  posicao?: 'topo' | 'fundo'
  compacto?: boolean
  quadrado?: boolean
  maxWidth?: string
  minWidth?: string
  tamanhoFonte?: string
  iconSize?: number
  borda?: string
}

export interface ToastItem {
  mensagem: string
  tipo: TipoToast
  duracao: number
  opcoes: ToastOptions
}

export interface ToastComponentProps extends ToastItem {
  onClose: () => void
}

export interface ToastContextType {
  sucesso: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  erro: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  aviso: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  info: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
  destaque: (mensagem: string, duracao?: number, opcoes?: ToastOptions) => void
}

export interface CounterConfig {
  valorInicial?: number
  valorMinimo?: number
  valorMaximo?: number
  passo?: number
  prefixo?: string
  sufixo?: string
  formato?: (valor: number) => string
  onMudanca?: (novoValor: number, valorAntigo: number) => void
  onMaximo?: (valor: number) => void
  onMinimo?: (valor: number) => void
}

export interface CounterAPI {
  getValor: () => number
  setValor: (novoValor: number) => CounterAPI
  aumentar: () => CounterAPI
  diminuir: () => CounterAPI
  resetar: () => CounterAPI
  onMudanca: (callback: (novoValor: number, valorAntigo: number) => void) => CounterAPI
  removerListener: (callback: (novoValor: number, valorAntigo: number) => void) => CounterAPI
  destroy: () => void
  updateOptions: (novasOpcoes: Partial<CounterConfig>) => CounterAPI
  comConfig: (opcoes: Partial<CounterConfig>) => CounterAPI
}