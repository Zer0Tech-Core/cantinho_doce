// src/hooks/useCart.tsx
'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Produto, Categoria, CartItem, ResumoCarrinho, PesoTotal, CartContextType } from '@/core/domain/types'
import { PRODUTOS } from '@/core/domain/data'

// =============================================
// 📦 CONSTANTES
// =============================================

const STORAGE_KEY = 'carrinho_cantinho_doce'
const LIMITE_MAXIMO = 10

// =============================================
// 🔧 CONTEXT
// =============================================

const CartContext = createContext<CartContextType | undefined>(undefined)

// =============================================
// 🚀 PROVIDER
// =============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<CartItem[]>([])

  // ===========================================
  // 📦 CARREGAR DO LOCALSTORAGE
  // ===========================================
  
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo)
        if (Array.isArray(parsed)) {
          setCarrinho(parsed)
        }
      } catch (e) {
        console.warn('Erro ao carregar carrinho:', e)
        setCarrinho([])
      }
    }
  }, [])

  // ===========================================
  // 💾 SALVAR NO LOCALSTORAGE
  // ===========================================
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho))
  }, [carrinho])

  // ===========================================
  // 📊 FUNÇÕES DE ANÁLISE
  // ===========================================
  
  const getTotalItens = useCallback(() => {
    return carrinho.reduce((sum, item) => sum + item.quantidade, 0)
  }, [carrinho])

  const getTotalItensUnicos = useCallback(() => {
    return carrinho.length
  }, [carrinho])

  const getTotal = useCallback((considerarPromocao: boolean = true) => {
    return carrinho.reduce((sum, item) => {
      const preco = considerarPromocao && item.precoPromocional 
        ? item.precoPromocional 
        : item.preco
      return sum + (preco * item.quantidade)
    }, 0)
  }, [carrinho])

  const getQuantidade = useCallback((produtoId: string) => {
    const item = carrinho.find(i => i.id === produtoId)
    return item?.quantidade || 0
  }, [carrinho])

  const estaNoCarrinho = useCallback((produtoId: string) => {
    return carrinho.some(item => item.id === produtoId)
  }, [carrinho])

  const getPesoTotal = useCallback((): PesoTotal => {
    let totalGramas = 0
    carrinho.forEach(item => {
      const peso = parseInt(item.peso)
      if (!isNaN(peso)) {
        totalGramas += peso * item.quantidade
      }
    })
    
    return {
      gramas: totalGramas,
      kg: totalGramas / 1000,
      formatado: totalGramas >= 1000 
        ? `${(totalGramas/1000).toFixed(2)}kg` 
        : `${totalGramas}g`
    }
  }, [carrinho])

  const getResumo = useCallback((): ResumoCarrinho => {
    const totalItens = getTotalItens()
    const totalItensUnicos = getTotalItensUnicos()
    const subtotal = getTotal(true)
    const totalSemPromocao = getTotal(false)
    const economia = totalSemPromocao - subtotal
    
    const itensOrdenados = [...carrinho].sort((a, b) => {
      const precoA = a.precoPromocional || a.preco
      const precoB = b.precoPromocional || b.preco
      return (precoB * b.quantidade) - (precoA * a.quantidade)
    })
    
    const categorias = new Set<string>()
    carrinho.forEach(item => {
      if (item.categoria) categorias.add(item.categoria)
    })
    
    return {
      totalItens,
      totalItensUnicos,
      subtotal,
      economia,
      temEconomia: economia > 0,
      itemMaisCaro: itensOrdenados[0] || null,
      itens: [...carrinho],
      categorias: Array.from(categorias)
    }
  }, [carrinho, getTotalItens, getTotalItensUnicos, getTotal])

  // ===========================================
  // 🛒 FUNÇÕES DE MANIPULAÇÃO
  // ===========================================
  
  const adicionarItem = useCallback((produtoId: string, quantidade: number = 1) => {
    if (!produtoId) {
      return { success: false, message: 'ID do produto inválido' }
    }

    if (quantidade <= 0) {
      return { success: false, message: 'Quantidade deve ser maior que zero' }
    }

    // Busca o produto no catálogo
    let produto: Produto | null = null
    let categoriaEncontrada: Categoria | null = null
    
    for (const categoria of PRODUTOS.categorias) {
      const encontrado = categoria.produtos.find((p: { id: string }) => p.id === produtoId)
      if (encontrado) {
        produto = encontrado
        categoriaEncontrada = categoria
        break
      }
    }

    if (!produto) {
      return { success: false, message: 'Produto não encontrado' }
    }

    // Verifica limite máximo
    const existente = carrinho.find(item => item.id === produtoId)
    if (existente && existente.quantidade + quantidade > LIMITE_MAXIMO) {
      return { 
        success: false, 
        message: `Limite máximo de ${LIMITE_MAXIMO} unidades por produto`
      }
    }

    const precoFinal = produto.precoPromocional || produto.preco

    setCarrinho(prev => {
      if (existente) {
        return prev.map(item =>
          item.id === produtoId
            ? { 
                ...item, 
                quantidade: item.quantidade + quantidade,
                preco: precoFinal,
                precoPromocional: produto.precoPromocional || undefined
              }
            : item
        )
      }
      
      const novoItem: CartItem = {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        peso: produto.peso,
        preco: precoFinal,
        precoPromocional: produto.precoPromocional || undefined,
        icone: produto.icone || 'Cookie',
        categoria: categoriaEncontrada?.id,
        quantidade: quantidade,
        dataAdicao: new Date().toISOString(),
        tags: produto.tags || [],
        imagem: ''
      }
      
      return [...prev, novoItem]
    })

    return { 
      success: true, 
      message: `${produto.nome} adicionado ao carrinho!`
    }
  }, [carrinho])

  const alterarQuantidade = useCallback((produtoId: string, delta: number) => {
    if (!produtoId || delta === 0) {
      return { success: false, message: 'Dados inválidos', quantidade: 0 }
    }

    const index = carrinho.findIndex(i => i.id === produtoId)
    if (index === -1) {
      return { success: false, message: 'Item não encontrado no carrinho', quantidade: 0 }
    }

    const item = carrinho[index]
    const novaQuantidade = item.quantidade + delta

    if (novaQuantidade < 0) {
      return { success: false, message: 'Quantidade não pode ser negativa', quantidade: item.quantidade }
    }

    setCarrinho(prev => {
      if (novaQuantidade === 0) {
        return prev.filter(i => i.id !== produtoId)
      }
      
      const novoItem = { ...item, quantidade: novaQuantidade }
      const newCarrinho = [...prev]
      newCarrinho[index] = novoItem
      return newCarrinho
    })

    return { 
      success: true, 
      message: novaQuantidade === 0 ? 'Item removido' : 'Quantidade atualizada',
      quantidade: novaQuantidade
    }
  }, [carrinho])

  const removerItem = useCallback((produtoId: string) => {
    if (!produtoId) {
      return { success: false, message: 'ID do produto inválido' }
    }

    const itemRemovido = carrinho.find(i => i.id === produtoId)
    if (!itemRemovido) {
      return { success: false, message: 'Item não encontrado no carrinho' }
    }

    setCarrinho(prev => prev.filter(i => i.id !== produtoId))

    return { 
      success: true, 
      message: `${itemRemovido.nome} removido do carrinho`
    }
  }, [carrinho])

  const limparCarrinho = useCallback(() => {
    const quantidadeItems = carrinho.length
    setCarrinho([])
    
    return { 
      success: true, 
      message: 'Carrinho limpo com sucesso',
      itensRemovidos: quantidadeItems
    }
  }, [carrinho])

  // ===========================================
  // 💾 PERSISTÊNCIA AVANÇADA
  // ===========================================
  
  const exportarCarrinho = useCallback(() => {
    return JSON.stringify({
      carrinho,
      dataExportacao: new Date().toISOString(),
      total: getTotal(),
      totalItens: getTotalItens()
    }, null, 2)
  }, [carrinho, getTotal, getTotalItens])

  const importarCarrinho = useCallback((jsonString: string) => {
    try {
      const dados = JSON.parse(jsonString)
      if (!dados.carrinho || !Array.isArray(dados.carrinho)) {
        return { success: false, message: 'Dados inválidos' }
      }
      
      setCarrinho(dados.carrinho)
      
      return { 
        success: true, 
        message: 'Carrinho importado com sucesso',
        itens: dados.carrinho.length
      }
    } catch (e) {
      return { success: false, message: 'Erro ao importar carrinho: ' + (e as Error).message }
    }
  }, [])

  const resetarCarrinho = useCallback(() => {
    setCarrinho([])
    localStorage.removeItem(STORAGE_KEY)
    return { success: true, message: 'Carrinho resetado' }
  }, [])

  // ===========================================
  // 📦 VALORES DO CONTEXT
  // ===========================================
  
  const value: CartContextType = {
    carrinho,
    totalItens: getTotalItens(),
    total: getTotal(),
    pesoTotal: getPesoTotal(),
    resumo: getResumo(),
    getQuantidade,
    estaNoCarrinho,
    adicionarItem,
    alterarQuantidade,
    removerItem,
    limparCarrinho,
    exportarCarrinho,
    importarCarrinho,
    resetarCarrinho
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// =============================================
// 🎯 HOOK PARA USAR O CARRINHO
// =============================================

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}