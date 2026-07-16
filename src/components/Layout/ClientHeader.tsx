// src/components/ClientHeader.tsx
'use client'

import UnifiedHeader from './UnifiedHeader'
import { ClientHeaderProps } from '@/core/domain/types'

export default function ClientHeader({ showCategories = false }: ClientHeaderProps) {
  const handleCartClick = () => {
    const event = new CustomEvent('openCartDrawer')
    document.dispatchEvent(event)
  }

  return (
    <UnifiedHeader 
      showCategories={showCategories} 
      onCartClick={handleCartClick}
    />
  )
}