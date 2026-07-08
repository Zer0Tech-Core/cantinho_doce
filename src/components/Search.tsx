// src/components/Search.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, X, Mic, Loader2 } from 'lucide-react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSearch?: (value: string) => void
  isLoading?: boolean
  showClear?: boolean
  showMic?: boolean
}

export default function Search({
  value,
  onChange,
  placeholder = 'Buscar produtos...',
  className = '',
  onSearch,
  isLoading = false,
  showClear = true,
  showMic = false,
}: SearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inputRef.current) {
        inputRef.current.blur()
        if (value) {
          onChange('')
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [value, onChange])

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  // Simulação de busca por voz (apenas visual)
  const handleVoiceSearch = () => {
    if (!showMic) return
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      // Simula um resultado de voz
      onChange('biscoito')
    }, 1500)
  }

  return (
    <form 
      className={`search-wrapper ${isFocused ? 'search-focused' : ''} ${className}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="search-input-wrapper">
        <span className="search-icon">
          {isLoading ? (
            <Loader2 size={18} className="search-spinner" />
          ) : (
            <SearchIcon size={18} />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input-field"
          aria-label="Buscar produtos"
          autoComplete="off"
          spellCheck={false}
        />

        {showClear && value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}

        {showMic && !isLoading && (
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`search-mic-btn ${isRecording ? 'search-mic-recording' : ''}`}
            aria-label="Buscar por voz"
            disabled={isRecording}
          >
            <Mic size={16} />
          </button>
        )}
      </div>

      {isFocused && value && value.length > 0 && (
        <div className="search-suggestions">
          <div className="search-suggestion-item">
            <SearchIcon size={14} />
            <span>Buscar por "{value}"</span>
          </div>
          <div className="search-suggestion-divider" />
          <div className="search-suggestion-item">
            <span className="search-suggestion-hint">🔍 Pressione Enter para buscar</span>
          </div>
        </div>
      )}
    </form>
  )
}