// src/app/produto/[id]/page.tsx
import { notFound } from 'next/navigation'
import { PRODUTOS } from '@/data'
import Image from 'next/image'
import Link from 'next/link'
import UnifiedHeader from '@/components/UnifiedHeader'
import Footer from '@/components/Footer'
import { ArrowLeft, Package, Star, Tag, ShoppingCart } from 'lucide-react'

// 🔥 CORRETO: params é uma Promise
interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProdutoPage({ params }: PageProps) {
  // 🔥 AWAIT no params
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

  return (
    <main>
      <UnifiedHeader showCategories={false} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px 40px', minHeight: '70vh' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2E7D32', textDecoration: 'none', fontWeight: 600, fontSize: '14px', marginBottom: '32px' }}>
          <ArrowLeft size={18} />
          Voltar para loja
        </Link>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          background: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          {/* Imagem */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '1', 
            background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {temImagem && imagemPath ? (
              <Image
                src={imagemPath}
                alt={produto.nome}
                width={500}
                height={500}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
                priority
              />
            ) : (
              <div style={{ fontSize: '80px' }}>🍪</div>
            )}
            {produto.destaque && (
              <span style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                background: '#F9A825', 
                color: '#1B5E20', 
                padding: '4px 14px', 
                borderRadius: '50px', 
                fontSize: '12px', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Star size={14} /> Destaque
              </span>
            )}
            {produto.precoPromocional && (
              <span style={{ 
                position: 'absolute', 
                top: '12px', 
                left: '12px', 
                background: '#D32F2F', 
                color: 'white', 
                padding: '4px 14px', 
                borderRadius: '50px', 
                fontSize: '12px', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Tag size={14} /> 
                {Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Informações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1B5E20', margin: 0 }}>{produto.nome}</h1>
            {produto.categoriaNome && (
              <span style={{ 
                display: 'inline-block', 
                background: '#F1F8E9', 
                color: '#2E7D32', 
                padding: '4px 14px', 
                borderRadius: '50px', 
                fontSize: '12px', 
                fontWeight: 600,
                alignSelf: 'flex-start'
              }}>{produto.categoriaNome}</span>
            )}
            
            <p style={{ fontSize: '16px', color: '#495057', lineHeight: 1.7, margin: '4px 0' }}>{produto.descricao}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '4px 0' }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '14px', 
                color: '#495057', 
                background: '#F8F9FA', 
                padding: '4px 14px', 
                borderRadius: '50px'
              }}>
                <Package size={16} /> {produto.peso}
              </span>
              {produto.tags && produto.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {produto.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ 
                      fontSize: '12px', 
                      color: '#868E96', 
                      background: '#F8F9FA', 
                      padding: '2px 10px', 
                      borderRadius: '50px'
                    }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              {produto.precoPromocional ? (
                <>
                  <span style={{ fontSize: '16px', color: '#868E96', textDecoration: 'line-through' }}>R$ {produto.preco.toFixed(2)}</span>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#2E7D32' }}>R$ {produto.precoPromocional.toFixed(2)}</span>
                </>
              ) : (
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#2E7D32' }}>R$ {produto.preco.toFixed(2)}</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <a
                href={`https://wa.me/5521972279173?text=Olá!%20Gostaria%20de%20comprar%20o%20*${produto.nome}*%20por%20R$%20${precoFinal.toFixed(2)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  background: '#25D366', 
                  color: 'white', 
                  padding: '14px 32px', 
                  borderRadius: '50px', 
                  fontWeight: 700, 
                  fontSize: '16px', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.3)'
                }}
              >
                <ShoppingCart size={18} />
                Comprar pelo WhatsApp
              </a>
              <Link 
                href="/" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '12px 32px', 
                  border: '2px solid #DEE2E6', 
                  borderRadius: '50px', 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  color: '#495057', 
                  textDecoration: 'none', 
                  transition: 'all 0.2s' 
                }}
              >
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