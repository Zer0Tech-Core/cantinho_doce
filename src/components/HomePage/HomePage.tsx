'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronLeft, ChevronRight, Star, TrendingUp, Sparkles,
  Home, Cookie, ChefHat, Wine, Candy, Cake, Nut
} from 'lucide-react'
import styles from './HomePage.module.css'
import { ProductCard } from '../Product/ProductCard'
import { banners as bannerList, produtos as produtosImportados } from '@/core/domain/data';
import { HomePageProps, Produto, ProdutoComCategoria } from '@/core/domain/types'

export default function HomePage({ 
  categorias = [], // Fallback para evitar undefined
  onCategoriaClick 
}: HomePageProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const bannerInterval = useRef<NodeJS.Timeout | null>(null)

  // Extrai todos os produtos mapeando com suas respectivas categorias corretas
  const destaques: ProdutoComCategoria[] = []
  
  categorias.forEach(cat => {
    if (cat.id !== 'inicio' && cat.produtos) {
      cat.produtos.forEach(p => {
        if (p.destaque) {
          destaques.push({
            ...p,
            categoriaId: cat.id,
            categoriaNome: cat.nome
          })
        }
      })
    }
  })

  // Remove duplicados caso o mesmo produto esteja em mais de uma categoria
  const destaquesUnicos = destaques.filter((value, index, self) =>
    self.findIndex(t => t.id === value.id) === index
  )

  const novidades = destaquesUnicos.slice(4, 8)
  const categoriasDestaque = categorias?.filter(c => c.destaque && c.id !== 'inicio') || []

  // Número do WhatsApp da loja
  const whatsappLoja = "5521972279173"

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Home: <Home size={24} />,
      Cookie: <Cookie size={24} />,
      ChefHat: <ChefHat size={24} />,
      Wine: <Wine size={24} />,
      Candy: <Candy size={24} />,
      Cake: <Cake size={24} />,
      Nut: <Nut size={24} />,
      Sparkles: <Sparkles size={24} />,
    }
    return icons[iconName] || <Cookie size={24} />
  }

  useEffect(() => {
    if (!isHovering && bannerList && bannerList.length > 0) {
      bannerInterval.current = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % bannerList.length)
      }, 5000)
    }
    return () => {
      if (bannerInterval.current) {
        clearInterval(bannerInterval.current)
      }
    }
  }, [isHovering, bannerList?.length])

  const prevBanner = () => {
    if (!bannerList) return
    setCurrentBanner(prev => (prev - 1 + bannerList.length) % bannerList.length)
  }

  const nextBanner = () => {
    if (!bannerList) return
    setCurrentBanner(prev => (prev + 1) % bannerList.length)
  }

  return (
    <div className={styles.homePage}>
      
      {/* BANNER PRINCIPAL */}
      {bannerList && bannerList.length > 0 && (
        <section 
          className={styles.bannerSection}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Destaques rotativos"
        >
          <div className={styles.bannerContainer}>
            {bannerList.map((banner, index) => (
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
                        section?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {banner.cta}
                    </button>
                  </div>
                  <div className={styles.bannerImage} aria-hidden="true">
                    <img 
                      src={banner.imagem} 
                      alt={banner.title} 
                      className={styles.bannerImgElement} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className={`${styles.bannerControl} ${styles.prev}`}
            onClick={prevBanner}
            aria-label="Banner anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className={`${styles.bannerControl} ${styles.next}`}
            onClick={nextBanner}
            aria-label="Próximo banner"
          >
            <ChevronRight size={24} />
          </button>

          <div className={styles.bannerIndicators}>
            {bannerList.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentBanner ? styles.active : ''
                }`}
                onClick={() => setCurrentBanner(index)}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIAS RÁPIDAS */}
      {categoriasDestaque.length > 0 && (
        <section className={styles.quickCategories}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} className={styles.iconAccent} />
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
                  style={{ backgroundColor: categoria.cor ? `${categoria.cor}15` : '#F1F8E9' }}
                >
                  {getIcon(categoria.icone)}
                </div>
                <span className={styles.categoryName}>{categoria.nome}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {destaquesUnicos.length > 0 && (
        <section id="destaques" className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Star size={20} className={styles.iconStar} />
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
            {destaquesUnicos.slice(0, 8).map((produto: ProdutoComCategoria) => (
              <div key={produto.id} className={styles.scrollItem}>
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NOVIDADES */}
      {novidades.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={20} className={styles.iconTrend} />
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
            {novidades.map((produto: ProdutoComCategoria) => (
              <div key={produto.id} className={styles.scrollItem}>
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEÇÕES POR CATEGORIA */}
      {categorias
        ?.filter(c => c.id !== 'inicio' && c.produtos && c.produtos.length > 0)
        .slice(0, 4)
        .map((categoria) => {
          const produtosCat = categoria.produtos.slice(0, 4)
          if (produtosCat.length === 0) return null
          
          return (
            <section key={categoria.id} className={styles.categorySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.dotIndicator} style={{ backgroundColor: categoria.cor || '#2E7D32' }} />
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
                  <div key={produto.id} className={styles.scrollItem}>
                    <ProductCard 
                      produto={{
                        ...produto,
                        categoriaId: categoria.id,
                        categoriaNome: categoria.nome
                      }}
                      showCategory={false}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}

      {/* WHATSAPP BANNER */}
      <section className={styles.whatsappBanner}>
        <div className={styles.whatsappContent}>
          <div className={styles.whatsappTextGroup}>
            <h3>📱 Peça pelo WhatsApp!</h3>
            <p>Faça seu pedido direto pelo WhatsApp e receba em casa com toda comodidade.</p>
          </div>
          <a 
            href={`https://wa.me/${whatsappLoja}`}
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