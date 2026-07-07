'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Cookie } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'

export default function Header() {
  const { totalItens, total } = useCart()
  const toast = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [badgePulse, setBadgePulse] = useState(false)
  const prevTotalRef = useRef(totalItens)

  // Detecta scroll para efeito de sombra
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Anima o badge quando o carrinho muda
  useEffect(() => {
    if (totalItens > prevTotalRef.current) {
      setBadgePulse(true)
      setTimeout(() => setBadgePulse(false), 300)
    }
    prevTotalRef.current = totalItens
  }, [totalItens])

  const handleCartClick = () => {
    if (totalItens === 0) {
      toast.aviso('🛒 Carrinho vazio! Adicione produtos.', 2500)
      return
    }
    
    const cartElement = document.getElementById('cartFloating')
    if (cartElement) {
      cartElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-left">
        <button 
          className="header-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <span className="header-logo" onClick={handleLogoClick} role="button" tabIndex={0}>
          <img 
            src="/logo.png" 
            alt="Cantinho Doce" 
            className="header-logo-img"
          />
        </span>
        
        <div className="header-title">
          <h1>Cantinho Doce</h1>
          <small>Biscoitos Artesanais • Campo Grande - RJ</small>
        </div>
      </div>

      <div className="header-right">
        {/* Menu Mobile (overlay) */}
        {isMenuOpen && (
          <div className="header-menu-overlay" onClick={() => setIsMenuOpen(false)}>
            <div className="header-menu-content" onClick={(e) => e.stopPropagation()}>
              <div className="header-menu-header">
                <Cookie size={24} />
                <span className="header-menu-title">Cantinho Doce</span>
                <button onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
                  <X size={24} />
                </button>
              </div>
              <nav className="header-menu-nav">
                <a href="#" className="header-menu-link active">Início</a>
                <a href="#produtos" className="header-menu-link">Produtos</a>
                <a href="#sobre" className="header-menu-link">Sobre</a>
                <a href="#contato" className="header-menu-link">Contato</a>
                <a 
                  href="https://wa.me/5521972279173" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="header-menu-link header-menu-whatsapp"
                >
                  WhatsApp
                </a>
              </nav>
              <div className="header-menu-footer">
                <small>© 2024 Cantinho Doce</small>
              </div>
            </div>
          </div>
        )}

        {/* Carrinho */}
        <div 
          className={`header-cart ${totalItens > 0 ? 'has-items' : ''}`}
          onClick={handleCartClick}
          role="button"
          aria-label="Abrir carrinho"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCartClick()
            }
          }}
        >
          <div className="header-cart-icon-wrapper">
            <ShoppingCart size={20} aria-hidden="true" />
            {totalItens > 0 && (
              <span className={`cart-badge ${badgePulse ? 'pulse' : ''}`}>
                {totalItens > 99 ? '99+' : totalItens}
              </span>
            )}
          </div>
          <span className="cart-total">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </header>
  )
}