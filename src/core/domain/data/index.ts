// src/data/index.ts
// =============================================
// DATA - Arquivo Principal
// =============================================

import lojaData from './loja.json'
import categoriasData from './categorias.json'
import produtosData from './produtos.json'
import bannerData from './banner.json'
import { Produto, Categoria, Loja, ProdutoComCategoria, CategoriaComProdutos } from '@/core/domain/types'


export {
  produtosData as produtos,
  lojaData as loja,
  bannerData as banners
};

// Única Fonte de Verdade para configurações institucionis da loja
export const LOJA: Loja = lojaData

// ===========================================
// MONTA O CATÁLOGO COMPLETO
// ===========================================

const categorias: CategoriaComProdutos[] = categoriasData.map((cat: any) => ({
  ...cat,
  produtos: produtosData[cat.id as keyof typeof produtosData] || []
}))

// ===========================================
// FUNÇÃO AUXILIAR PARA NORMALIZAR IDs
// ===========================================

function normalizarId(id: string): string {
  return id
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
}

// ===========================================
// OBJETO PRINCIPAL
// ===========================================

export const PRODUTOS = {
  loja: LOJA,
  categorias,

  // ===========================================
  // MÉTODOS UTILITÁRIOS
  // ===========================================

  //  CORRIGIDO: Busca normalizada
  getProdutoPorId(id: string): ProdutoComCategoria | null {
    if (!id || typeof id !== 'string') return null
    
    const idNormalizado = normalizarId(id)
    
    for (const categoria of this.categorias) {
      for (const produto of categoria.produtos) {
        if (normalizarId(produto.id) === idNormalizado) {
          return {
            ...produto,
            categoriaId: categoria.id,
            categoriaNome: categoria.nome
          }
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

  //  CORRIGIDO: Busca normalizada
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
            normalizarId(produto.id).includes(termoNormalizado)) {
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
//  EXPORTAÇÃO PARA DEBUG
// ===========================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Catálogo Cantinho Doce carregado!')
  console.log(`${PRODUTOS.getTotalProdutos()} produtos em ${PRODUTOS.categorias.length} categorias`)
  console.log('Use PRODUTOS.buscarProdutos("termo") para pesquisar')
  console.log('Use PRODUTOS.getEstatisticas() para ver estatísticas')
  console.log('Destaques: ' + PRODUTOS.getProdutosEmDestaque().length + ' produtos')
  
  ;(window as any).__PRODUTOS = PRODUTOS
}