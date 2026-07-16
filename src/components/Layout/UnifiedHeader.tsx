// src/components/UnifiedHeader.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Cookie, Search as SearchIcon, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import Image from 'next/image'
import Link from 'next/link'
import { Categoria, UnifiedHeaderProps } from '@/core/domain/types'

export default function UnifiedHeader({
  searchValue = '',
  onSearchChange = () => {},
  categorias = [],
  categoriaAtiva = '',
  onCategoriaChange = () => {},
  isSearching = false,
  showCategories = true,
  onCartClick,
}: UnifiedHeaderProps) {
  const { totalItens, total } = useCart()
  const toast = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [badgePulse, setBadgePulse] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prevTotalRef = useRef(totalItens)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (totalItens > prevTotalRef.current) {
      setBadgePulse(true)
      setTimeout(() => setBadgePulse(false), 300)
    }
    prevTotalRef.current = totalItens
  }, [totalItens])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchMode) {
        handleCloseSearch()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchMode])

  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isSearchMode])

  const handleCartClick = () => {
    if (totalItens === 0) {
      toast.aviso('🛒 Carrinho vazio! Adicione produtos.', 2500)
      return
    }
    if (onCartClick) {
      onCartClick()
    } else {
      const cartElement = document.getElementById('cartFloating')
      if (cartElement) {
        cartElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleOpenSearch = () => {
    setIsSearchMode(true)
  }

  const handleCloseSearch = () => {
    setIsSearchMode(false)
    if (searchValue) {
      onSearchChange('')
    }
  }

  const getIcon = (icone: string) => {
    const icons: Record<string, React.ReactNode> = {
      Cookie: <Cookie size={16} />,
    }
    return icons[icone] || <Cookie size={16} />
  }

  const menuLinks = [
    { href: '/', label: 'Início', active: false },
    { href: '/sobre', label: 'Sobre', active: true },
  ]

  return (
    <header className={`unified-header ${isScrolled ? 'unified-header-scrolled' : ''}`}>
      
      {!isSearchMode && (
        <>
          <div className="unified-topbar">
            <button 
              className="unified-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 🔥 LOGO CORRIGIDA - Link envolve tudo */}
            <Link 
              href="/" 
              className="unified-logo"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Voltar ao início"
            >
              <img 
                src="/logo.png" 
                alt="Cantinho Doce" 
                className="unified-logo-img" 
                width={40}
                height={40}
              />
              <div className="unified-logo-text">
                <span className="unified-logo-title">Cantinho Doce</span>
                <small className="unified-logo-sub">Biscoitos Artesanais</small>
              </div>
            </Link>

            {!isMobile && (
              <div className="unified-search-wrapper">
                <div className="unified-search-input-wrapper">
                  <span className="unified-search-icon">
                    {isSearching ? (
                      <span className="unified-search-spinner" />
                    ) : (
                      <SearchIcon size={18} />
                    )}
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="unified-search-input"
                    aria-label="Buscar produtos"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="unified-search-clear"
                      aria-label="Limpar busca"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div 
              className={`unified-cart ${totalItens > 0 ? 'has-items' : ''}`}
              onClick={handleCartClick}
              role="button"
              aria-label="Abrir carrinho"
              tabIndex={0}
            >
              <div className="unified-cart-icon-wrapper">
                <ShoppingCart size={20} />
                {totalItens > 0 && (
                  <span className={`unified-cart-badge ${badgePulse ? 'pulse' : ''}`}>
                    {totalItens > 99 ? '99+' : totalItens}
                  </span>
                )}
              </div>
              <span className="unified-cart-total">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={handleOpenSearch}
                className="unified-search-toggle"
                aria-label="Abrir busca"
              >
                <SearchIcon size={20} />
              </button>
            )}
          </div>

          {showCategories && categorias.length > 0 && (
            <nav className="unified-categories" role="tablist">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`unified-category-btn ${cat.id === categoriaAtiva ? 'active' : ''}`}
                  onClick={() => onCategoriaChange(cat.id)}
                  role="tab"
                  aria-selected={cat.id === categoriaAtiva}
                >
                  {getIcon(cat.icone)}
                  {cat.nome}
                  <span className="unified-category-weight">{cat.descricao}</span>
                </button>
              ))}
            </nav>
          )}
        </>
      )}

      {isSearchMode && isMobile && (
        <>
          <div className="unified-search-mode">
            <button
              type="button"
              onClick={handleCloseSearch}
              className="unified-search-back"
              aria-label="Voltar"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="unified-search-mode-wrapper">
              <div className="unified-search-mode-input-wrapper">
                <span className="unified-search-mode-icon">
                  {isSearching ? (
                    <span className="unified-search-spinner" />
                  ) : (
                    <SearchIcon size={18} />
                  )}
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="unified-search-mode-input"
                  autoFocus
                  aria-label="Buscar produtos"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="unified-search-mode-clear"
                    aria-label="Limpar busca"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {showCategories && categorias.length > 0 && (
            <nav className="unified-categories" role="tablist">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`unified-category-btn ${cat.id === categoriaAtiva ? 'active' : ''}`}
                  onClick={() => {
                    onCategoriaChange(cat.id)
                    handleCloseSearch()
                  }}
                  role="tab"
                  aria-selected={cat.id === categoriaAtiva}
                >
                  {getIcon(cat.icone)}
                  {cat.nome}
                  <span className="unified-category-weight">{cat.descricao}</span>
                </button>
              ))}
            </nav>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* 🍔 MENU MOBILE - DRAWER ATUALIZADO        */}
      {/* ========================================== */}
      {isMenuOpen && (
        <div className="unified-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="unified-menu-content" onClick={(e) => e.stopPropagation()}>
            {/* HEADER DO MENU */}
            <div className="unified-menu-header">
              <div className="unified-menu-logo-wrapper">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image 
                    src="/logo.png" 
                    alt="Cantinho Doce" 
                    width={42}
                    height={42}
                    className="unified-menu-logo"
                    priority
                  />
                </Link>
                <Link 
                  href="/" 
                  className="unified-menu-title-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="unified-menu-title">Cantinho Doce</span>
                </Link>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                aria-label="Fechar menu"
                className="unified-menu-close"
              >
                <X size={24} />
              </button>
            </div>

            {/* NAVEGAÇÃO */}
            <nav className="unified-menu-nav">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`unified-menu-link ${link.active ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* 🔥 WHATSAPP */}
              <a 
                href="https://wa.me/5521972279173" 
                target="_blank" 
                rel="noopener noreferrer"
                className="unified-menu-link unified-menu-whatsapp"
                onClick={() => setIsMenuOpen(false)}
              >
                WhatsApp
              </a>

              {/* 🔥 INSTAGRAM */}
              <a 
                href="https://instagram.com/cantinho_doce.cg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="unified-menu-link unified-menu-instagram"
                onClick={() => setIsMenuOpen(false)}
              >
                Instagram
              </a>
            </nav>

            {/* FOOTER */}
            <div className="unified-menu-footer">
              <small>© 2026 Cantinho Doce</small>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}