// src/components/ProductImage.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductImageProps } from '@/core/domain/types'

const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

export default function ProductImage({ 
  src, 
  name, 
  priority = false,
  width = 300,
  height = 300,
  className = ''
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // 🔥 Extrai o nome do arquivo e monta o caminho WebP
  const getImagePath = () => {
    const fileName = src.split('/').pop() || src
    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '')
    return `/imagens/produtos/${nameWithoutExt}.webp`
  }

  const getFallbackPath = () => {
    if (src.startsWith('/')) return src
    return `/imagens/produtos/${src}`
  }

  const imageSrc = getImagePath()
  const fallbackSrc = getFallbackPath()

  return (
    <div className="product-image-container">
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={name}
        width={width}
        height={height}
        className={`product-image ${isLoading ? 'loading' : 'loaded'} ${className}`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        onLoad={() => setIsLoading(false)}  // 🔥 Mudança: onLoadingComplete → onLoad
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className="product-image-skeleton" />
      )}
    </div>
  )
}