// src/app/not-found.tsx
import Link from 'next/link'
import UnifiedHeader from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function NotFound() {
  return (
    <main>
      <UnifiedHeader showCategories={false} />
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '80px 20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '72px', marginBottom: '16px' }}>404</h1>
        <h2 style={{ fontSize: '24px', color: '#1B5E20', marginBottom: '8px' }}>
          Produto não encontrado
        </h2>
        <p style={{ color: '#495057', marginBottom: '24px' }}>
          O produto que você está procurando não existe ou foi removido.
        </p>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block', 
            background: '#2E7D32', 
            color: 'white', 
            padding: '12px 32px', 
            borderRadius: '50px', 
            textDecoration: 'none', 
            fontWeight: 600 
          }}
        >
          Voltar para loja
        </Link>
      </div>
      <Footer />
    </main>
  )
}