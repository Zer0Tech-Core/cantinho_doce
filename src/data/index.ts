// =============================================
// 📦 DATA - Arquivo Principal
// =============================================

// Importa os JSONs
import lojaData from './loja.json'
import categoriasData from './categorias.json'
import produtosData from './produtos.json'

// ===========================================
// 📦 TIPAGEM (exportadas diretamente)
// ===========================================

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
  tags?: string[]
}

export interface Categoria {
  id: string
  nome: string
  descricao: string
  icone: string
  cor: string
  destaque: boolean
  produtos: Produto[]
}

export interface Loja {
  nome: string
  nomeCompleto: string
  telefone: string
  whatsapp: string
  endereco: string
  instagram: string
  horario: string
  cores: {
    primaria: string
    secundaria: string
    destaque: string
  }
}

export interface ProdutoComCategoria extends Produto {
  categoriaId: string
  categoriaNome: string
}

// ===========================================
// 🔧 MONTA O CATÁLOGO COMPLETO
// ===========================================

const loja: Loja = lojaData
const categorias: Categoria[] = categoriasData.map((cat: any) => ({
  ...cat,
  produtos: produtosData[cat.id as keyof typeof produtosData] || []
}))

// ===========================================
// 📦 OBJETO PRINCIPAL
// ===========================================

export const PRODUTOS = {
  loja,

  categorias,

  // ===========================================
  // 🔍 MÉTODOS UTILITÁRIOS
  // ===========================================

  getProdutoPorId(id: string): ProdutoComCategoria | null {
    if (!id || typeof id !== 'string') return null
    
    for (const categoria of this.categorias) {
      const produto = categoria.produtos.find(p => p.id === id)
      if (produto) {
        return {
          ...produto,
          categoriaId: categoria.id,
          categoriaNome: categoria.nome
        }
      }
    }
    return null
  },

  getCategoriaPorId(id: string): Categoria | null {
    if (!id || typeof id !== 'string') return null
    return this.categorias.find(c => c.id === id) || null
  },

  getProdutosPorCategoria(categoriaId: string): Produto[] {
    const categoria = this.getCategoriaPorId(categoriaId)
    return categoria ? categoria.produtos : []
  },

  getProdutosEmDestaque(): ProdutoComCategoria[] {
    const destaques: ProdutoComCategoria[] = []
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        if (produto.destaque) {
          destaques.push({
            ...produto,
            categoriaId: categoria.id,
            categoriaNome: categoria.nome
          })
        }
      }
    }
    return destaques
  },

  getPrecoFormatado(preco: number): string {
    if (typeof preco !== 'number') return 'R$ 0,00'
    return `R$ ${preco.toFixed(2).replace('.', ',')}`
  },

  getTotalProdutos(): number {
    return this.categorias.reduce((total, cat) => total + cat.produtos.length, 0)
  },

  buscarProdutos(termo: string): ProdutoComCategoria[] {
    if (!termo || typeof termo !== 'string' || termo.trim() === '') return []
    
    const termoNormalizado = termo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    
    const resultados: ProdutoComCategoria[] = []
    
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        const nomeNormalizado = produto.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        
        if (nomeNormalizado.includes(termoNormalizado) || 
            produto.id.includes(termoNormalizado)) {
          resultados.push({
            ...produto,
            categoriaId: categoria.id,
            categoriaNome: categoria.nome
          })
        }
      }
    }
    return resultados
  },

  getProdutosPorPreco(min: number, max: number): ProdutoComCategoria[] {
    const resultados: ProdutoComCategoria[] = []
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        if (produto.preco >= min && produto.preco <= max) {
          resultados.push({
            ...produto,
            categoriaId: categoria.id,
            categoriaNome: categoria.nome
          })
        }
      }
    }
    return resultados
  },

  getProdutosPorPeso(peso: string): ProdutoComCategoria[] {
    if (!peso) return []
    
    const resultados: ProdutoComCategoria[] = []
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        if (produto.peso === peso) {
          resultados.push({
            ...produto,
            categoriaId: categoria.id,
            categoriaNome: categoria.nome
          })
        }
      }
    }
    return resultados
  },

  getEstatisticas() {
    const total = this.getTotalProdutos()
    const categoriasCount = this.categorias.length
    const precos: number[] = []
    const pesos = new Set<string>()
    
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        precos.push(produto.preco)
        pesos.add(produto.peso)
      }
    }
    
    return {
      totalProdutos: total,
      totalCategorias: categoriasCount,
      precos: {
        min: precos.length ? Math.min(...precos) : 0,
        max: precos.length ? Math.max(...precos) : 0,
        medio: precos.length ? precos.reduce((a, b) => a + b, 0) / precos.length : 0
      },
      pesosDisponiveis: Array.from(pesos).sort()
    }
  }
}

// ===========================================
// 🚀 EXPORTAÇÃO PARA DEBUG
// ===========================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('📦 Catálogo Cantinho Doce carregado!')
  console.log(`📊 ${PRODUTOS.getTotalProdutos()} produtos em ${PRODUTOS.categorias.length} categorias`)
  console.log('🔍 Use PRODUTOS.buscarProdutos("termo") para pesquisar')
  console.log('📊 Use PRODUTOS.getEstatisticas() para ver estatísticas')
  console.log('⭐ Destaques: ' + PRODUTOS.getProdutosEmDestaque().length + ' produtos')
  
  ;(window as any).__PRODUTOS = PRODUTOS
}