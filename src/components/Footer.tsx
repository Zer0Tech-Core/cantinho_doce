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
  ArrowUp
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { PRODUTOS } from '@/data'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const currentYear = new Date().getFullYear()

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

  const loja = PRODUTOS.loja

  return (
    <footer className="footer">
      {/* Botão Scroll Top */}
      {showScrollTop && (
        <button 
          className="footer-scroll-top" 
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="footer-container">
        {/* =========================================== */}
        {/* 📌 SOBRE A LOJA                            */}
        {/* =========================================== */}
        <div className="footer-section">
          <div className="footer-brand">
            <img 
              src="/logo.png" 
              alt="Cantinho Doce" 
              className="footer-logo"
            />
            <h3>Cantinho Doce</h3>
          </div>
          <p className="footer-description">
            Biscoitos artesanais feitos com amor e ingredientes selecionados. 
            Leve sabor e qualidade para sua mesa!
          </p>
          <div className="footer-social">
            <a 
              href="https://instagram.com/cantinho_doce.cg" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-social-link"
            >
              <Image 
                src="/icon/instagram.svg" 
                alt="Instagram" 
                width={20} 
                height={20}
                className="footer-social-icon"
              />
            </a>
          </div>
        </div>

        {/* =========================================== */}
        {/* 📍 CONTATO E ENDEREÇO                     */}
        {/* =========================================== */}
        <div className="footer-section">
          <h4 className="footer-section-title">Contato</h4>
          <ul className="footer-list">
            <li>
              <MapPin size={16} />
              <span>{loja.endereco}</span>
            </li>
            <li>
              <Phone size={16} />
              <a href={`tel:${loja.telefone}`}>
                {loja.telefone}
              </a>
            </li>
            <li>
              <Mail size={16} />
              <a href="mailto:cantinhodoce399@gmail.com">
                cantinhodoce399@gmail.com
              </a>
            </li>
            <li>
              <Clock size={16} />
              <span>{loja.horario}</span>
            </li>
          </ul>
        </div>

        {/* =========================================== */}
        {/* 🛒 INFORMAÇÕES ÚTEIS                      */}
        {/* =========================================== */}
        <div className="footer-section">
          <h4 className="footer-section-title">Informações</h4>
          <ul className="footer-list">
            <li>
              <Cookie size={16} />
              <span>Produtos artesanais</span>
            </li>
            <li>
              <Shield size={16} />
              <span>Qualidade garantida</span>
            </li>
            <li>
              <Truck size={16} />
              <span>Entrega em Campo Grande - RJ</span>
            </li>
            <li>
              <CreditCard size={16} />
              <span>Aceitamos Pix e Cartões</span>
            </li>
          </ul>
        </div>

        {/* =========================================== */}
        {/* 📱 NEWSLETTER                             */}
        {/* =========================================== */}
        <div className="footer-section">
          <h4 className="footer-section-title">Novidades</h4>
          <p className="footer-newsletter-text">
            Receba promoções e novidades no seu WhatsApp!
          </p>
          <a 
            href={`https://wa.me/${loja.telefone}?text=Olá! Gostaria de receber novidades do Cantinho Doce 🍪`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-newsletter-btn"
          >
            <Phone size={18} />
            Quero receber novidades
          </a>
        </div>
      </div>

      {/* =========================================== */}
      {/* 📋 RODAPÉ INFERIOR                        */}
      {/* =========================================== */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            © {currentYear} <strong>Cantinho Doce</strong> - Todos os direitos reservados
          </p>
          <p className="footer-made-with">
            Feito com <Heart size={14} className="footer-heart" /> em Campo Grande - RJ
          </p>
        </div>
      </div>
    </footer>
  )
}