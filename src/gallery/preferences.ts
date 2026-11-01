import { galleryLocales, type GalleryLocale, type GalleryTheme } from './types.js'

const localeKey = 'gallery.locale'
const themeKey = 'gallery.theme'
const themes: readonly GalleryTheme[] = ['system', 'light', 'dark']

// O armazenamento pode falhar (janela privada, dados bloqueados): a galeria funciona sem ele
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // sem armazenamento, a preferência vale só nesta visita
  }
}

export function isGalleryLocale(value: unknown): value is GalleryLocale {
  return typeof value === 'string' && (galleryLocales as readonly string[]).includes(value)
}

export function detectLocale(fallback: GalleryLocale = 'pt-BR'): GalleryLocale {
  const saved = read(localeKey)
  if (isGalleryLocale(saved)) return saved
  const browser = typeof navigator === 'undefined' ? [] : (navigator.languages?.length ? navigator.languages : [navigator.language])
  for (const language of browser) {
    const exact = galleryLocales.find((locale) => locale.toLowerCase() === language.toLowerCase())
    if (exact) return exact
    const base = galleryLocales.find((locale) => locale.slice(0, 2) === language.slice(0, 2).toLowerCase())
    if (base) return base
  }
  return fallback
}

export function saveLocale(locale: GalleryLocale) {
  write(localeKey, locale)
}

export function detectTheme(): GalleryTheme {
  const saved = read(themeKey)
  return themes.find((theme) => theme === saved) ?? 'system'
}

export function saveTheme(theme: GalleryTheme) {
  write(themeKey, theme)
}
