'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductImageProps } from '@/core/domain/types'
import styles from './ProductImage.module.css'

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
    <div className={styles.container}>
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={name}
        width={width}
        height={height}
        className={`${styles.image} ${isLoading ? styles.loading : styles.loaded} ${className}`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className={styles.skeleton} />
      )}
    </div>
  )
}