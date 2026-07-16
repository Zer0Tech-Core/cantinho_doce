// src/components/HomePage/ProductCard.tsx (com WhatsApp Share)
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Share2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { gerarMensagemWhatsApp } from '@/utils/whatsapp'
import styles from './HomePage.module.css'
import { ProductCardProps } from '@/core/domain/types'

export function ProductCard({ produto, showCategory = true }: ProductCardProps) {
  const { adicionarItem } = useCart()
  const toast = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const result = adicionarItem(produto.id, 1)
    
    if (result.success) {
      toast.sucesso(`🛒 ${produto.nome} adicionado!`)
    } else {
      toast.erro(result.message || 'Erro ao adicionar')
    }
  }

  // 🔥 COMPARTILHAR VIA WHATSAPP
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const resultado = gerarMensagemWhatsApp(
      [{
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        peso: produto.peso,
        preco: produto.preco,
        precoPromocional: produto.precoPromocional,
        quantidade: 1,
        tags: produto.tags,
        imagem: ''
      }],
      {} as any,
      'Cantinho Doce',
      '5521972279173'
    )

    window.open(resultado.url, '_blank')
  }

  return (
    <Link href={`/produto/${produto.id}`} className={styles.productCard}>
      <div className={styles.productImage}>
        {produto.imagem ? (
          <Image 
            src={produto.imagem} 
            alt={produto.nome}
            width={200}
            height={200}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: 48 }}>🍪</span>
        )}
        {/* 🔥 BOTÃO DE COMPARTILHAR */}
        <button 
          className={styles.shareBtn}
          onClick={handleShare}
          aria-label="Compartilhar no WhatsApp"
        >
          <Share2 size={16} />
        </button>
      </div>
      <div className={styles.productInfo}>
        {showCategory && (
          <span style={{ fontSize: 11, color: '#6C757D', fontWeight: 500 }}>
            {produto.categoriaNome}
          </span>
        )}
        <h4 className={styles.productName}>{produto.nome}</h4>
        <div className={styles.productWeight}>{produto.peso}</div>
        <div className={styles.productPrice}>
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </div>
        <button 
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
        >
          Adicionar
        </button>
      </div>
    </Link>
  )
}