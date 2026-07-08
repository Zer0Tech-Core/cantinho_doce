// src/app/page.tsx
'use client'

import { useState } from 'react'
import { PRODUTOS } from '@/data'
import UnifiedHeader from '@/components/UnifiedHeader'
import ProductGrid from '@/components/ProductGrid'
import CartFloating from '@/components/CartFloating'
import CartDrawer from '@/components/CartDrawer' // 🔥 NOVO
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function Home() {
  const [categoriaAtiva, setCategoriaAtiva] = useState(
    PRODUTOS.categorias[0]?.id || 'biscoitos-doces'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false) // 🔥 NOVO
  const [isSearching, setIsSearching] = useState(false)

  const categoria = PRODUTOS.categorias.find(c => c.id === categoriaAtiva)
  const produtos = categoria?.produtos || []

  const filteredProducts = searchTerm
    ? PRODUTOS.buscarProdutos(searchTerm)
    : produtos

  const handleSearch = (value: string) => {
    setIsSearching(true)
    setSearchTerm(value)
    setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }

  return (
    <main>
      <UnifiedHeader
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        categorias={PRODUTOS.categorias}
        categoriaAtiva={categoriaAtiva}
        onCategoriaChange={setCategoriaAtiva}
        isSearching={isSearching}
        onCartClick={() => setIsCartDrawerOpen(true)} // 🔥 NOVO
      />

      <div className={styles.container}>
        <ProductGrid
          produtos={filteredProducts}
          categoria={categoria}
          isSearch={!!searchTerm}
        />
      </div>

      {/* 🔥 NOVO - CARRINHO DRAWER */}
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />

      {/* 🔥 CART FLUTUANTE - AGORA ABRE O DRAWER */}
      <CartFloating onCheckout={() => setIsCartDrawerOpen(true)} />

      <Footer />
    </main>
  )
}