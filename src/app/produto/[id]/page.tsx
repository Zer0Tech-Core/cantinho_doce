// src/app/produto/[id]/page.tsx
import { notFound } from 'next/navigation'
import { PRODUTOS } from '@/data'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import UnifiedHeader from '@/components/UnifiedHeader'
import Footer from '@/components/Footer'
import { ArrowLeft, Package, Star, Tag, ShoppingCart } from 'lucide-react'
import styles from './produtoId.module.css'

interface PageProps {
  params: {
    id: string
  }
}

// 🔥 GERANDO METADADOS DINÂMICOS PARA PREVIEW NO WHATSAPP
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const produto = PRODUTOS.getProdutoPorId(params.id)
  
  if (!produto) {
    return {
      title: 'Produto não encontrado - Cantinho Doce'
    }
  }

  // 🔥 CONSTRÓI A URL DA IMAGEM
  const nomeArquivo = produto.imagem.split('/').pop() || produto.imagem
  const nomeSemExtensao = nomeArquivo.replace(/\.[^.]+$/, '')
  const imagemUrl = `https://cantinho-docecg.vercel.app/imagens/produtos/${nomeSemExtensao}.webp`
  const precoFinal = produto.precoPromocional || produto.preco

  return {
    title: `${produto.nome} - Cantinho Doce 🍪`,
    description: produto.descricao,
    openGraph: {
      title: `${produto.nome} - Cantinho Doce 🍪`,
      description: `${produto.descricao} | Peso: ${produto.peso} | Preço: R$ ${precoFinal.toFixed(2)}`,
      images: [
        {
          url: imagemUrl,
          width: 800,
          height: 800,
          alt: produto.nome,
        }
      ],
      type: 'website',
      url: `https://cantinho-docecg.vercel.app/produto/${produto.id}`,
      siteName: 'Cantinho Doce',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${produto.nome} - Cantinho Doce 🍪`,
      description: produto.descricao,
      images: [imagemUrl],
    },
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const produto = PRODUTOS.getProdutoPorId(params.id)
  
  if (!produto) {
    notFound()
  }

  const precoFinal = produto.precoPromocional || produto.preco
  const temImagem = produto.imagem && produto.imagem !== ''

  // 🔥 CONSTRÓI A URL DA IMAGEM
  const getImagemPath = () => {
    if (!temImagem) return null
    const nomeArquivo = produto.imagem.split('/').pop() || produto.imagem
    const nomeSemExtensao = nomeArquivo.replace(/\.[^.]+$/, '')
    return `/imagens/produtos/${nomeSemExtensao}.webp`
  }

  const imagemPath = getImagemPath()

  return (
    <main>
      <UnifiedHeader showCategories={false} />
      
      <div className={styles.pageContainer}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={18} />
          Voltar para loja
        </Link>

        <div className={styles.productContainer}>
          {/* Imagem */}
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
              <div className={styles.imageFallback}>
                <span>🍪</span>
              </div>
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

          {/* Informações */}
          <div className={styles.infoContainer}>
            <h1 className={styles.productName}>{produto.nome}</h1>
            {produto.categoriaNome && (
              <span className={styles.categoriaTag}>{produto.categoriaNome}</span>
            )}
            
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
      </div>
      
      <Footer />
    </main>
  )
}