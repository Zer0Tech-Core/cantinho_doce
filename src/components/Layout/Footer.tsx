// src/components/Layout/Footer.tsx
'use client'

import { 
  Heart,
  Phone, 
  MapPin, 
  Mail, 
  Clock,
  Cookie,
  Shield,
  Truck,
  CreditCard,
  ArrowUp,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LOJA, PRODUTOS } from '@/core/domain/data'
import styles from './Footer.module.css'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const currentYear = new Date().getFullYear()

  // DADOS DA LOJA (Única Fonte de Verdade)
  const loja = LOJA
  const totalProdutos = PRODUTOS.getTotalProdutos()
  const totalCategorias = PRODUTOS.categorias.length
  const destaques = PRODUTOS.getProdutosEmDestaque().length

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // FORMATA TELEFONE PARA EXIBIÇÃO
  const formatPhone = (phone: string) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  // LINKS RÁPIDOS
  const quickLinks = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Biscoitos Doces', href: '/?categoria=biscoitos-doces' },
    { label: 'Biscoitos Salgados', href: '/?categoria=biscoitos-salgados' },
    { label: 'Doces de Compota', href: '/?categoria=potes-de-doce' },
  ]

  // INFORMAÇÕES DA LOJA
  const infoItems = [
    { icon: <Cookie size={16} />, label: `${totalProdutos} produtos artesanais` },
    { icon: <Shield size={16} />, label: 'Qualidade garantida' },
    { icon: <Truck size={16} />, label: `Entrega em ${loja.endereco}` },
    { icon: <CreditCard size={16} />, label: 'Aceitamos Pix e Cartões' },
  ]

  // REDES SOCIAIS (apenas as que existem)
  const socialLinks = []

  // Instagram
  if (loja.instagram && loja.instagram !== '@') {
    socialLinks.push({
      icon: (
        <img 
        src="/icon/instagram.svg"
        alt="Instagram"
        width={18}
        height={18}
        className="social-icon-svg"
        />
      ),
      label: loja.instagram,
      href: `https://instagram.com/${loja.instagram.replace('@', '')}`,
      ariaLabel: 'Instagram'
    })
  }

  return (
    <footer className={styles.footer}>
      {/* Botão Scroll Top */}
      {showScrollTop && (
        <button 
          className={styles.scrollTop} 
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className={styles.container}>
        {/* =========================================== */}
        {/* SOBRE A LOJA                            */}
        {/* =========================================== */}
        <div className={styles.section}>
          <div className={styles.brand}>
            <img 
              src="/logo.png" 
              alt={loja.nome} 
              className={styles.logo}
            />
            <div>
              <h3 className={styles.brandName}>{loja.nome}</h3>
              <span className={styles.brandTag}>{loja.nomeCompleto}</span>
            </div>
          </div>
          <p className={styles.description}>
            {loja.nomeCompleto}. Feitos com amor e ingredientes selecionados. 
            Leve sabor e qualidade para sua mesa!
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalProdutos}</span>
              <span className={styles.statLabel}>Produtos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalCategorias}</span>
              <span className={styles.statLabel}>Categorias</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{destaques}</span>
              <span className={styles.statLabel}>Destaques</span>
            </div>
          </div>
          
          {/* REDES SOCIAIS DINÂMICAS */}
          {socialLinks.length > 0 && (
            <div className={styles.social}>
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className={styles.socialLink}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* =========================================== */}
        {/* LINKS RÁPIDOS                          */}
        {/* =========================================== */}
        <div className={styles.section}>
          <h4 className={styles.title}>Navegação</h4>
          <ul className={styles.list}>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* =========================================== */}
        {/* CONTATO                               */}
        {/* =========================================== */}
        <div className={styles.section}>
          <h4 className={styles.title}>Contato</h4>
          <ul className={styles.list}>
            <li>
              <MapPin size={16} />
              <span>{loja.endereco}</span>
            </li>
            <li>
              <Phone size={16} />
              <a href={`tel:${loja.telefone}`} className={styles.link}>
                {formatPhone(loja.telefone)}
              </a>
            </li>
            {loja.email && (
              <li>
                <Mail size={16} />
                <a href={`mailto:${loja.email}`} className={styles.link}>
                  {loja.email}
                </a>
              </li>
            )}
            <li>
              <Clock size={16} />
              <span>{loja.horario}</span>
            </li>
          </ul>
        </div>

        {/* =========================================== */}
        {/* INFORMAÇÕES                            */}
        {/* =========================================== */}
        <div className={styles.section}>
          <h4 className={styles.title}>Informações</h4>
          <ul className={styles.list}>
            {infoItems.map((item, index) => (
              <li key={index}>
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          
          {/* WhatsApp CTA */}
          <a 
            href={`https://wa.me/${loja.whatsapp}?text=Olá! Gostaria de fazer um pedido`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <Phone size={18} />
            Fazer Pedido
          </a>
        </div>
      </div>

      {/* =========================================== */}
      {/* RODAPÉ INFERIOR                        */}
      {/* =========================================== */}
      <div className={styles.bottom}>
        <div className={styles.bottomContent}>
          <p>
            © {currentYear} <strong>{loja.nome}</strong> - Todos os direitos reservados
          </p>
          <p className={styles.madeWith}>
            Feito com <Heart size={14} className={styles.heart} /> em {loja.endereco}
          </p>
        </div>
      </div>
    </footer>
  )
}