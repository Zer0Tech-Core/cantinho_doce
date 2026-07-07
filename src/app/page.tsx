'use client'

import { useState } from 'react'
import { PRODUTOS } from '@/data'
import Header from '@/components/Header'
import Categories from '@/components/Categories'
import ProductGrid from '@/components/ProductGrid'
import CartFloating from '@/components/CartFloating'
import CheckoutModal from '@/components/CheckoutModal'
import Footer from '@/components/Footer'
import Search from '@/components/Search'
import styles from './page.module.css'

export default function Home() {
  const [categoriaAtiva, setCategoriaAtiva] = useState(
    PRODUTOS.categorias[0]?.id || 'biscoitos-doces'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      <Header />
      
      {/* 🔧 Classe global 'search-container' para sincronizar sticky */}
      <div className="search-container">
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar produtos..."
          isLoading={isSearching}
          showClear={true}
          showMic={false}
        />
      </div>

      <Categories
        categorias={PRODUTOS.categorias}
        categoriaAtiva={categoriaAtiva}
        onCategoriaChange={setCategoriaAtiva}
      />

      <div className={styles.container}>
        <ProductGrid
          produtos={filteredProducts}
          categoria={categoria}
          isSearch={!!searchTerm}
        />
      </div>

      <CartFloating onCheckout={() => setIsModalOpen(true)} />
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <Footer />
    </main>
  )
}