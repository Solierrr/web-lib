import type { ReactNode } from 'react'

export const galleryLocales = ['pt-BR', 'en-US', 'es-ES'] as const
export type GalleryLocale = (typeof galleryLocales)[number]

// Texto de conteúdo: uma string única ou uma por idioma
export type LocalizedText = string | Record<GalleryLocale, string>

export interface GalleryItem {
  id: string
  label: LocalizedText
  description?: LocalizedText
  icon?: ReactNode
}

export interface GallerySection {
  id: string
  title: LocalizedText
  items: GalleryItem[]
}

export type GalleryTheme = 'system' | 'light' | 'dark'
