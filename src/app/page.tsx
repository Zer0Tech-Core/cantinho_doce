// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PRODUTOS } from '@/core/domain/data'
import UnifiedHeader from '@/components/Layout/UnifiedHeader'
import ProductGrid from '@/components/ProductGrid'
import HomePage from '@/components/HomePage'
import CartFloating from '@/components/CartFloating'
import CartDrawer from '@/components/CartDrawer/CartDrawer'
import Footer from '@/components/Layout/Footer'
import styles from './page.module.css'

export default function Home() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('inicio')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const handleForceOpen = () => {
      setIsCartDrawerOpen(true)
    }
    document.addEventListener('forceOpenCartDrawer', handleForceOpen)
    return () => document.removeEventListener('forceOpenCartDrawer', handleForceOpen)
  }, [])

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

  const handleCategoriaClick = (categoriaId: string) => {
    setCategoriaAtiva(categoriaId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        onCartClick={() => setIsCartDrawerOpen(true)}
      />

      <div className={styles.container}>
        {categoriaAtiva === 'inicio' && !searchTerm ? (
          <HomePage 
            categorias={PRODUTOS.categorias}
            produtos={PRODUTOS}
            onCategoriaClick={handleCategoriaClick}
          />
        ) : (
          <ProductGrid
            produtos={filteredProducts}
            categoria={categoria}
            isSearch={!!searchTerm}
          />
        )}
      </div>

      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />

      <CartFloating onCheckout={() => setIsCartDrawerOpen(true)} />

      <Footer />
    </main>
  )
}