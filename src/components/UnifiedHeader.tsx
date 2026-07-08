'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Cookie, Search as SearchIcon, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import Image from 'next/image'

interface UnifiedHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  categorias: Array<{ id: string; nome: string; descricao: string; icone: string; cor: string; destaque: boolean }>
  categoriaAtiva: string
  onCategoriaChange: (id: string) => void
  isSearching?: boolean
}

export default function UnifiedHeader({
  searchValue,
  onSearchChange,
  categorias,
  categoriaAtiva,
  onCategoriaChange,
  isSearching = false,
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

  // Detecta mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detecta scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Anima badge
  useEffect(() => {
    if (totalItens > prevTotalRef.current) {
      setBadgePulse(true)
      setTimeout(() => setBadgePulse(false), 300)
    }
    prevTotalRef.current = totalItens
  }, [totalItens])

  // Fecha busca ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchMode) {
        handleCloseSearch()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchMode])

  // Foco automático ao abrir busca
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
    const cartElement = document.getElementById('cartFloating')
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMenuOpen(false) // Fecha menu ao clicar na logo
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

  return (
    <header className={`unified-header ${isScrolled ? 'unified-header-scrolled' : ''}`}>
      
      {/* ========================================== */}
      {/* MODO NORMAL - Menu + Carrinho + Lupa     */}
      {/* ========================================== */}
      {!isSearchMode && (
        <>
          <div className="unified-topbar">
            {/* Menu Mobile */}
            <button 
              className="unified-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Desktop apenas */}
            <div className="unified-logo" onClick={handleLogoClick} role="button" tabIndex={0}>
              <img src="/logo.png" alt="Cantinho Doce" className="unified-logo-img" />
              <div className="unified-logo-text">
                <span className="unified-logo-title">Cantinho Doce</span>
                <small className="unified-logo-sub">Biscoitos Artesanais</small>
              </div>
            </div>

            {/* Search Desktop - Campo visível */}
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

            {/* Carrinho - Centralizado no mobile */}
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

            {/* Lupa - Mobile apenas */}
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

          {/* Categorias - Visíveis no modo normal */}
          <nav className="unified-categories">
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
        </>
      )}

      {/* ========================================== */}
      {/* MODO BUSCA - Mobile apenas               */}
      {/* ========================================== */}
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

          {/* Categorias - Mantidas visíveis no modo busca */}
          <nav className="unified-categories">
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
        </>
      )}

      {/* ========== MENU MOBILE OVERLAY ========== */}
      {isMenuOpen && (
        <div className="unified-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="unified-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="unified-menu-header">
              {/* 🔥 SUBSTITUÍDO Cookie PELA LOGO */}
              <Image 
                src="/logo.png" 
                alt="Cantinho Doce" 
                width={40}
                height={40}
                className="unified-menu-logo"
                priority
              />
              <span className="unified-menu-title">Cantinho Doce</span>
              <button onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
                <X size={24} />
              </button>
            </div>
            <nav className="unified-menu-nav">
              <a href="#" className="unified-menu-link active" onClick={() => setIsMenuOpen(false)}>Início</a>
              <a href="#produtos" className="unified-menu-link" onClick={() => setIsMenuOpen(false)}>Produtos</a>
              <a href="#sobre" className="unified-menu-link" onClick={() => setIsMenuOpen(false)}>Sobre</a>
              <a href="#contato" className="unified-menu-link" onClick={() => setIsMenuOpen(false)}>Contato</a>
              <a 
                href="https://wa.me/5521972279173" 
                target="_blank" 
                rel="noopener noreferrer"
                className="unified-menu-link unified-menu-whatsapp"
                onClick={() => setIsMenuOpen(false)}
              >
                WhatsApp
              </a>
            </nav>
            <div className="unified-menu-footer">
              <small>© 2026 Cantinho Doce</small>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}