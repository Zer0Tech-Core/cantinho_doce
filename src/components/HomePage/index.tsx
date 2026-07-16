// src/components/HomePage/index.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronLeft, ChevronRight, Star, TrendingUp, Sparkles,
  Home, Cookie, ChefHat, Wine, Candy, Cake, Nut
} from 'lucide-react'
import styles from './HomePage.module.css'
import { ProductCard } from './ProductCard'
import { HomePageProps, Produto, ProdutoComCategoria } from '@/core/domain/types'

export default function HomePage({ 
  categorias, 
  produtos, 
  onCategoriaClick 
}: HomePageProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const bannerInterval = useRef<NodeJS.Timeout | null>(null)

  const destaques = produtos.getProdutosEmDestaque()
  const novidades = destaques.slice(4, 8)
  const categoriasDestaque = categorias.filter(c => c.destaque && c.id !== 'inicio')

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Home: <Home size={28} />,
      Cookie: <Cookie size={28} />,
      ChefHat: <ChefHat size={28} />,
      Wine: <Wine size={28} />,
      Candy: <Candy size={28} />,
      Cake: <Cake size={28} />,
      Nut: <Nut size={28} />,
      Sparkles: <Sparkles size={28} />,
    }
    return icons[iconName] || <Cookie size={28} />
  }

  // 🔥 FUNÇÃO PARA CONVERTER Produto → ProdutoComCategoria
  const toProdutoComCategoria = (produto: Produto, categoriaId: string, categoriaNome: string): ProdutoComCategoria => {
    return {
      ...produto,
      categoriaId,
      categoriaNome
    }
  }

  const banners = [
    {
      id: 1,
      title: 'Biscoitos Artesanais',
      subtitle: 'Feitos com amor e ingredientes selecionados',
      emoji: '🍪',
      cta: 'Ver Destaques'
    },
    {
      id: 2,
      title: 'Doces de Compota',
      subtitle: 'Cocadas e doce de leite cremosos no pote',
      emoji: '🍯',
      cta: 'Explorar Doces'
    },
    {
      id: 3,
      title: 'Provolone Desidratado',
      subtitle: 'O petisco crocante que você vai amar!',
      emoji: '🧀',
      cta: 'Ver Sabores'
    }
  ]

  useEffect(() => {
    if (!isHovering) {
      bannerInterval.current = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length)
      }, 5000)
    }
    return () => {
      if (bannerInterval.current) {
        clearInterval(bannerInterval.current)
      }
    }
  }, [isHovering, banners.length])

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)
  }

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length)
  }

  return (
    <div className={styles.homePage}>
      
      {/* BANNER */}
      <section 
        className={styles.bannerSection}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={styles.bannerContainer}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.bannerSlide} ${
                index === currentBanner ? styles.active : ''
              }`}
              style={{
                transform: `translateX(${(index - currentBanner) * 100}%)`,
              }}
            >
              <div className={styles.bannerContent}>
                <div className={styles.bannerText}>
                  <span className={styles.bannerBadge}>✨ Destaque</span>
                  <h1 className={styles.bannerTitle}>{banner.title}</h1>
                  <p className={styles.bannerSubtitle}>{banner.subtitle}</p>
                  <button 
                    className={styles.bannerCta}
                    onClick={() => {
                      const section = document.getElementById('destaques')
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {banner.cta}
                  </button>
                </div>
                <div className={styles.bannerImage}>
                  <span style={{ fontSize: 120 }}>{banner.emoji}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className={`${styles.bannerControl} ${styles.prev}`}
          onClick={prevBanner}
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className={`${styles.bannerControl} ${styles.next}`}
          onClick={nextBanner}
          aria-label="Próximo"
        >
          <ChevronRight size={24} />
        </button>

        <div className={styles.bannerIndicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentBanner ? styles.active : ''
              }`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Ir para banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIAS RÁPIDAS */}
      <section className={styles.quickCategories}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={20} />
          Nossas Categorias
        </h2>
        <div className={styles.categoriesScroll}>
          {categoriasDestaque.map((categoria) => (
            <button
              key={categoria.id}
              className={styles.categoryCircle}
              onClick={() => onCategoriaClick(categoria.id)}
            >
              <div 
                className={styles.categoryIcon}
                style={{ backgroundColor: categoria.cor ? `${categoria.cor}20` : '#F1F8E9' }}
              >
                {getIcon(categoria.icone)}
              </div>
              <span className={styles.categoryName}>{categoria.nome}</span>
            </button>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section id="destaques" className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Star size={20} />
            Queridinhos da Galera
          </h2>
          <button 
            className={styles.seeAll}
            onClick={() => onCategoriaClick('inicio')}
          >
            Ver todos →
          </button>
        </div>
        
        <div className={styles.horizontalScroll}>
          {destaques.slice(0, 8).map((produto) => (
            <ProductCard 
              key={produto.id}
              produto={produto}
            />
          ))}
        </div>
      </section>

      {/* NOVIDADES */}
      {novidades.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={20} />
              Novidades
            </h2>
            <button 
              className={styles.seeAll}
              onClick={() => onCategoriaClick('inicio')}
            >
              Ver todos →
            </button>
          </div>
          
          <div className={styles.horizontalScroll}>
            {novidades.map((produto) => (
              <ProductCard 
                key={produto.id}
                produto={produto}
              />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÕES POR CATEGORIA */}
      {categorias
        .filter(c => c.id !== 'inicio' && c.produtos && c.produtos.length > 0)
        .slice(0, 4)
        .map((categoria) => {
          const produtosCat = categoria.produtos.slice(0, 4)
          if (produtosCat.length === 0) return null
          
          return (
            <section key={categoria.id} className={styles.categorySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span style={{ color: categoria.cor || '#2E7D32' }}>●</span>
                  {categoria.nome}
                </h2>
                <button 
                  className={styles.seeAll}
                  onClick={() => onCategoriaClick(categoria.id)}
                >
                  Ver todos →
                </button>
              </div>
              
              <div className={styles.horizontalScroll}>
                {produtosCat.map((produto: Produto) => (
                  <ProductCard 
                    key={produto.id}
                    produto={toProdutoComCategoria(produto, categoria.id, categoria.nome)}
                    showCategory={false}
                  />
                ))}
              </div>
            </section>
          )
        })}

      {/* WHATSAPP BANNER */}
      <section className={styles.whatsappBanner}>
        <div className={styles.whatsappContent}>
          <div>
            <h3>📱 Peça pelo WhatsApp!</h3>
            <p>Faça seu pedido direto pelo WhatsApp e receba em casa</p>
          </div>
          <a 
            href={`https://wa.me/${produtos.loja.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            Falar com a Cantinho Doce
          </a>
        </div>
      </section>

    </div>
  )
}