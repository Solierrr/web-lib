import type { GalleryLocale } from './types.js'

export interface GalleryStrings {
  menu: string
  search: string
  noResults: string
  language: string
  theme: string
  themeSystem: string
  themeLight: string
  themeDark: string
  previews: string
  repository: string
  version: string
  commit: string
  navigation: string
}

export const galleryStrings: Record<GalleryLocale, GalleryStrings> = {
  'pt-BR': {
    menu: 'Menu',
    search: 'Buscar',
    noResults: 'Nada encontrado.',
    language: 'Idioma',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    previews: 'Previews',
    repository: 'Repositório',
    version: 'Versão',
    commit: 'Commit',
    navigation: 'Navegação',
  },
  'en-US': {
    menu: 'Menu',
    search: 'Search',
    noResults: 'Nothing found.',
    language: 'Language',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    previews: 'Previews',
    repository: 'Repository',
    version: 'Version',
    commit: 'Commit',
    navigation: 'Navigation',
  },
  'es-ES': {
    menu: 'Menú',
    search: 'Buscar',
    noResults: 'No se encontró nada.',
    language: 'Idioma',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    previews: 'Previews',
    repository: 'Repositorio',
    version: 'Versión',
    commit: 'Commit',
    navigation: 'Navegación',
  },
}

export const galleryLanguageNames: Record<GalleryLocale, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
  'es-ES': 'Español',
}
