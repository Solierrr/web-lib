import { createContext, useContext } from 'react'
import type { GalleryStrings } from './strings.js'
import type { GalleryLocale, LocalizedText } from './types.js'

export interface GalleryContextValue {
  locale: GalleryLocale
  text: (value: LocalizedText) => string
  strings: GalleryStrings
}

export const GalleryContext = createContext<GalleryContextValue | null>(null)

// Idioma atual e tradução de textos de conteúdo, para o que a galeria desenha dentro do shell
export function useGallery(): GalleryContextValue {
  const context = useContext(GalleryContext)
  if (!context) throw new Error('useGallery must be used inside a GalleryShell')
  return context
}

export function localize(value: LocalizedText, locale: GalleryLocale): string {
  return typeof value === 'string' ? value : value[locale]
}
