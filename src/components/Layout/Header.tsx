// src/components/Layout/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ShoppingCart, Menu, X, Cookie, Search as SearchIcon, ArrowLeft,
  Home, ChefHat, Wine, Candy, Cake, Nut, Sparkles, Package
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import type { Categoria, UnifiedHeaderProps } from '@/core/domain/types'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Header.module.css' // ← USANDO CSS MODULAR

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

  // DETECTA MOBILE
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // DETECTA SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // PULSO NO BADGE
  useEffect(() => {
    if (totalItens > prevTotalRef.current) {
      setBadgePulse(true)
      setTimeout(() => setBadgePulse(false), 300)
    }
    prevTotalRef.current = totalItens
  }, [totalItens])

  // ESC FECHA BUSCA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchMode) {
        handleCloseSearch()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchMode])

  // FOCA NO INPUT AO ABRIR BUSCA
  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isSearchMode])

  // FUNÇÃO DO CARRINHO
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

  // FUNÇÕES DA BUSCA
  const handleOpenSearch = () => {
    setIsSearchMode(true)
  }

  const handleCloseSearch = () => {
    setIsSearchMode(false)
    if (searchValue) {
      onSearchChange('')
    }
  }

  // MAPEAMENTO DE ÍCONES
  const getIcon = (icone: string) => {
    const icons: Record<string, React.ReactNode> = {
      Home: <Home size={16} />,
      Cookie: <Cookie size={16} />,
      ChefHat: <ChefHat size={16} />,
      Wine: <Wine size={16} />,
      Candy: <Candy size={16} />,
      Cake: <Cake size={16} />,
      Nut: <Nut size={16} />,
      Sparkles: <Sparkles size={16} />,
      Package: <Package size={16} />,
    }
    return icons[icone] || <Package size={16} />
  }

  // LINKS DO MENU
  const menuLinks = [
    { href: '/', label: 'Início', active: categoriaAtiva === 'inicio' },
    { href: '/sobre', label: 'Sobre', active: false },
  ]

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      
      {/* ========================================== */}
      {/* 📱 TOP BAR                                 */}
      {/* ========================================== */}
      
      {!isSearchMode && (
        <>
          <div className={styles.topbar}>
            {/* MENU HAMBURGUER */}
            <button 
              className={styles.menuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* LOGO */}
            <Link 
              href="/" 
              className={styles.logo}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Voltar ao início"
            >
              <img 
                src="/logo.png" 
                alt="Cantinho Doce" 
                className={styles.logoImg} 
                width={40}
                height={40}
              />
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Cantinho Doce</span>
                <small className={styles.logoSub}>Biscoitos Artesanais</small>
              </div>
            </Link>

            {/* BUSCA DESKTOP */}
            {!isMobile && (
              <div className={styles.searchWrapper}>
                <div className={styles.searchInputWrapper}>
                  <span className={styles.searchIcon}>
                    {isSearching ? (
                      <span className={styles.searchSpinner} />
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
                    className={styles.searchInput}
                    aria-label="Buscar produtos"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className={styles.searchClear}
                      aria-label="Limpar busca"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CARRINHO */}
            <div 
              className={`${styles.cart} ${totalItens > 0 ? styles.hasItems : ''}`}
              onClick={handleCartClick}
              role="button"
              aria-label="Abrir carrinho"
              tabIndex={0}
            >
              <div className={styles.cartIconWrapper}>
                <ShoppingCart size={20} />
                {totalItens > 0 && (
                  <span className={`${styles.cartBadge} ${badgePulse ? styles.pulse : ''}`}>
                    {totalItens > 99 ? '99+' : totalItens}
                  </span>
                )}
              </div>
              <span className={styles.cartTotal}>
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* BOTÃO BUSCA MOBILE */}
            {isMobile && (
              <button
                type="button"
                onClick={handleOpenSearch}
                className={styles.searchToggle}
                aria-label="Abrir busca"
              >
                <SearchIcon size={20} />
              </button>
            )}
          </div>

          {/* CATEGORIAS */}
          {showCategories && categorias.length > 0 && (
            <nav className={styles.categories} role="tablist">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${cat.id === categoriaAtiva ? styles.active : ''}`}
                  onClick={() => onCategoriaChange(cat.id)}
                  role="tab"
                  aria-selected={cat.id === categoriaAtiva}
                >
                  {getIcon(cat.icone)}
                  {cat.nome}
                  <span className={styles.categoryWeight}>{cat.descricao}</span>
                </button>
              ))}
            </nav>
          )}
        </>
      )}

      {/* ========================================== */}
      {/*  MODO BUSCA MOBILE                      */}
      {/* ========================================== */}
      
      {isSearchMode && isMobile && (
        <>
          <div className={styles.searchMode}>
            <button
              type="button"
              onClick={handleCloseSearch}
              className={styles.searchBack}
              aria-label="Voltar"
            >
              <ArrowLeft size={24} />
            </button>

            <div className={styles.searchModeWrapper}>
              <div className={styles.searchModeInputWrapper}>
                <span className={styles.searchModeIcon}>
                  {isSearching ? (
                    <span className={styles.searchSpinner} />
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
                  className={styles.searchModeInput}
                  autoFocus
                  aria-label="Buscar produtos"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className={styles.searchModeClear}
                    aria-label="Limpar busca"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORIAS NO MODO BUSCA */}
          {showCategories && categorias.length > 0 && (
            <nav className={styles.categories} role="tablist">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${cat.id === categoriaAtiva ? styles.active : ''}`}
                  onClick={() => {
                    onCategoriaChange(cat.id)
                    handleCloseSearch()
                  }}
                  role="tab"
                  aria-selected={cat.id === categoriaAtiva}
                >
                  {getIcon(cat.icone)}
                  {cat.nome}
                  <span className={styles.categoryWeight}>{cat.descricao}</span>
                </button>
              ))}
            </nav>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* MENU MOBILE - DRAWER                   */}
      {/* ========================================== */}
      
      {isMenuOpen && (
        <div className={styles.menuOverlay} onClick={() => setIsMenuOpen(false)}>
          <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
            {/* HEADER DO MENU */}
            <div className={styles.menuHeader}>
              <div className={styles.menuLogoWrapper}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image 
                    src="/logo.png" 
                    alt="Cantinho Doce" 
                    width={42}
                    height={42}
                    className={styles.menuLogo}
                    priority
                  />
                </Link>
                <Link 
                  href="/" 
                  className={styles.menuTitleLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.menuTitle}>Cantinho Doce</span>
                </Link>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                aria-label="Fechar menu"
                className={styles.menuClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* NAVEGAÇÃO */}
            <nav className={styles.menuNav}>
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.menuLink} ${link.active ? styles.active : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* CATEGORIAS NO MENU */}
              <div className={styles.menuDivider} />
              {categorias
                .filter(c => c.id !== 'inicio')
                .slice(0, 8)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href="/"
                    className={`${styles.menuLink} ${styles.menuCategory} ${cat.id === categoriaAtiva ? styles.active : ''}`}
                    onClick={() => {
                      onCategoriaChange(cat.id)
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className={styles.menuCategoryIcon}>
                      {getIcon(cat.icone)}
                    </span>
                    {cat.nome}
                  </Link>
                ))}
              
              <div className={styles.menuDivider} />
              
              {/* WHATSAPP */}
              <a 
                href="https://wa.me/5521972279173" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.menuLink} ${styles.menuWhatsapp}`}
                onClick={() => setIsMenuOpen(false)}
              >
                WhatsApp
              </a>

              {/* INSTAGRAM */}
              <a 
                href="https://instagram.com/cantinho_doce.cg" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.menuLink} ${styles.menuInstagram}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Instagram
              </a>
            </nav>

            {/* FOOTER */}
            <div className={styles.menuFooter}>
              <small>© 2026 Cantinho Doce • Campo Grande - RJ</small>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}