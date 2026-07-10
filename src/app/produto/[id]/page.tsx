// src/app/produto/[id]/page.tsx
import { notFound } from 'next/navigation'
import { PRODUTOS } from '@/data'
import Image from 'next/image'
import Link from 'next/link'
import UnifiedHeader from '@/components/UnifiedHeader'
import Footer from '@/components/Footer'
import { ArrowLeft, Package, Star, Tag, ShoppingCart, ChevronRight } from 'lucide-react'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params
  const produto = PRODUTOS.getProdutoPorId(id)
  
  if (!produto) {
    notFound()
  }

  const precoFinal = produto.precoPromocional || produto.preco
  const temImagem = produto.imagem && produto.imagem !== ''

  const getImagemPath = () => {
    if (!temImagem) return null
    const nomeArquivo = produto.imagem.split('/').pop() || produto.imagem
    const nomeSemExtensao = nomeArquivo.replace(/\.[^.]+$/, '')
    return `/imagens/produtos/${nomeSemExtensao}.webp`
  }

  const imagemPath = getImagemPath()

  // 🔥 PRODUTOS RECOMENDADOS - MESMA CATEGORIA
  const produtosRecomendados = PRODUTOS.categorias
    .find(c => c.id === produto.categoriaId)
    ?.produtos
    .filter(p => p.id !== produto.id)
    .slice(0, 4) || []

  // 🔥 PRODUTOS RELACIONADOS - OUTRA CATEGORIA
  const produtosRelacionados = PRODUTOS.categorias
    .filter(c => c.id !== produto.categoriaId)
    .flatMap(c => c.produtos)
    .filter(p => p.id !== produto.id)
    .slice(0, 4)

  return (
    <main>
      <UnifiedHeader showCategories={false} />
      
      <div className={styles.pageContainer}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href={`/?categoria=${produto.categoriaId}`}>
            {produto.categoriaNome || 'Produtos'}
          </Link>
          <ChevronRight size={14} />
          <span>{produto.nome}</span>
        </div>

        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={18} />
          Voltar para loja
        </Link>

        {/* Produto Principal */}
        <div className={styles.productContainer}>
          <div className={styles.imageContainer}>
            {temImagem && imagemPath ? (
              <Image
                src={imagemPath}
                alt={produto.nome}
                width={500}
                height={500}
                className={styles.productImage}
                priority
              />
            ) : (
              <div className={styles.imageFallback}>🍪</div>
            )}
            {produto.destaque && (
              <span className={styles.badgeDestaque}>
                <Star size={14} /> Destaque
              </span>
            )}
            {produto.precoPromocional && (
              <span className={styles.badgePromocao}>
                <Tag size={14} /> 
                {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}% OFF
              </span>
            )}
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.breadcrumbMobile}>
              <Link href={`/?categoria=${produto.categoriaId}`}>
                {produto.categoriaNome || 'Produtos'}
              </Link>
            </div>
            <h1 className={styles.productName}>{produto.nome}</h1>
            {produto.categoriaNome && (
              <span className={styles.categoriaTag}>{produto.categoriaNome}</span>
            )}
            
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>
                <span className={styles.star}>★</span>
                <span className={styles.star}>★</span>
                <span className={styles.star}>★</span>
                <span className={styles.star}>★</span>
                <span className={styles.star}>★</span>
              </div>
              <span className={styles.ratingCount}>5.0 (12 avaliações)</span>
            </div>
            
            <p className={styles.productDesc}>{produto.descricao}</p>
            
            <div className={styles.productMeta}>
              <span className={styles.metaItem}>
                <Package size={16} /> {produto.peso}
              </span>
              {produto.tags && produto.tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {produto.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.priceContainer}>
              {produto.precoPromocional ? (
                <>
                  <span className={styles.priceOld}>R$ {produto.preco.toFixed(2)}</span>
                  <span className={styles.priceCurrent}>R$ {produto.precoPromocional.toFixed(2)}</span>
                </>
              ) : (
                <span className={styles.priceCurrent}>R$ {produto.preco.toFixed(2)}</span>
              )}
            </div>

            <div className={styles.actions}>
              <a
                href={`https://wa.me/5521972279173?text=Olá!%20Gostaria%20de%20comprar%20o%20*${produto.nome}*%20por%20R$%20${precoFinal.toFixed(2)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                <ShoppingCart size={18} />
                Comprar pelo WhatsApp
              </a>
              <Link href="/" className={styles.continueButton}>
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>

        {/* 🔥 PRODUTOS RECOMENDADOS - MESMA CATEGORIA */}
        {produtosRecomendados.length > 0 && (
          <section className={styles.recommendedSection}>
            <div className={styles.recommendedHeader}>
              <h2 className={styles.recommendedTitle}>
                Produtos <span className={styles.titleHighlight}>Relacionados</span>
              </h2>
              <Link href={`/?categoria=${produto.categoriaId}`} className={styles.viewAllLink}>
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className={styles.recommendedGrid}>
              {produtosRecomendados.map((p) => (
                <Link href={`/produto/${p.id}`} key={p.id} className={styles.recommendedCard}>
                  <div className={styles.recommendedImage}>
                    <Image
                      src={`/imagens/produtos/${p.imagem.split('/').pop()?.replace(/\.[^.]+$/, '')}.webp`}
                      alt={p.nome}
                      width={150}
                      height={150}
                      className={styles.recommendedImg}
                    />
                  </div>
                  <div className={styles.recommendedInfo}>
                    <h3 className={styles.recommendedName}>{p.nome}</h3>
                    <div className={styles.recommendedPrice}>
                      {p.precoPromocional ? (
                        <>
                          <span className={styles.recommendedOldPrice}>R$ {p.preco.toFixed(2)}</span>
                          <span className={styles.recommendedCurrentPrice}>R$ {p.precoPromocional.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className={styles.recommendedCurrentPrice}>R$ {p.preco.toFixed(2)}</span>
                      )}
                    </div>
                    {p.destaque && (
                      <span className={styles.recommendedBadge}>⭐ Destaque</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 🔥 VOCÊ TAMBÉM PODE GOSTAR */}
        {produtosRelacionados.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              Você também pode <span className={styles.titleHighlight}>gostar</span>
            </h2>
            <div className={styles.relatedGrid}>
              {produtosRelacionados.map((p) => (
                <Link href={`/produto/${p.id}`} key={p.id} className={styles.relatedCard}>
                  <div className={styles.relatedImage}>
                    <Image
                      src={`/imagens/produtos/${p.imagem.split('/').pop()?.replace(/\.[^.]+$/, '')}.webp`}
                      alt={p.nome}
                      width={120}
                      height={120}
                      className={styles.relatedImg}
                    />
                  </div>
                  <div className={styles.relatedInfo}>
                    <h4 className={styles.relatedName}>{p.nome}</h4>
                    <span className={styles.relatedPrice}>R$ {p.preco.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      
      <Footer />
    </main>
  )
}