'use client'

import { Package, Cookie, ChefHat, Wine, Candy, Cake, Nut } from 'lucide-react'

interface Categoria {
  id: string
  nome: string
  descricao: string
  icone: string
  cor: string
  destaque: boolean
}

interface CategoriesProps {
  categorias: Categoria[]
  categoriaAtiva: string
  onCategoriaChange: (id: string) => void
}

export default function Categories({ 
  categorias, 
  categoriaAtiva, 
  onCategoriaChange 
}: CategoriesProps) {
  const getIcon = (icone: string) => {
    const icons: Record<string, React.ReactNode> = {
      Cookie: <Cookie size={20} />,
      ChefHat: <ChefHat size={20} />,
      Wine: <Wine size={20} />,
      Candy: <Candy size={20} />,
      Cake: <Cake size={20} />,
      Nut: <Nut size={20} />,
    }
    return icons[icone] || <Package size={20} />
  }

  return (
    <nav className="categories">
      {categorias.map((cat) => (
        <button
          key={cat.id}
          className={`category-btn ${cat.id === categoriaAtiva ? 'active' : ''}`}
          onClick={() => onCategoriaChange(cat.id)}
          role="tab"
          aria-selected={cat.id === categoriaAtiva}
        >
          {getIcon(cat.icone)}
          {cat.nome}
          <span className="peso-info">{cat.descricao}</span>
        </button>
      ))}
    </nav>
  )
}