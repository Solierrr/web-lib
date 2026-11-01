import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { GalleryContext, localize, type GalleryContextValue } from './context.js'
import { galleryLanguageNames, galleryStrings } from './strings.js'
import { detectLocale, detectTheme, isGalleryLocale, saveLocale, saveTheme } from './preferences.js'
import { galleryLocales, type GalleryItem, type GalleryLocale, type GallerySection, type GalleryTheme, type LocalizedText } from './types.js'

function fold(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export interface GalleryShellProps {
  /** Nome do preview, mostrado no cabeçalho. */
  title: LocalizedText
  /** Nome do repositório no GitHub (sem a organização). */
  repository: string
  organization?: string
  version?: string
  commit?: string
  /** Endereço do portal que lista todos os previews. */
  portalUrl?: string
  sections: GallerySection[]
  selectedId: string
  onSelect: (id: string) => void
  /** Idioma inicial quando a pessoa ainda não escolheu nenhum. */
  defaultLocale?: GalleryLocale
  onLocaleChange?: (locale: GalleryLocale) => void
  children: ReactNode
}

export function GalleryShell({
  title,
  repository,
  organization = 'Solierrr',
  version,
  commit,
  portalUrl = 'https://docs.solarianetwork.site',
  sections,
  selectedId,
  onSelect,
  defaultLocale = 'pt-BR',
  onLocaleChange,
  children,
}: GalleryShellProps) {
  const [locale, setLocaleState] = useState<GalleryLocale>(() => detectLocale(defaultLocale))
  const [theme, setThemeState] = useState<GalleryTheme>(() => detectTheme())
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const strings = galleryStrings[locale]

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.galleryTheme = theme
  }, [theme])

  const setLocale = useCallback(
    (next: GalleryLocale) => {
      setLocaleState(next)
      saveLocale(next)
      onLocaleChange?.(next)
    },
    [onLocaleChange],
  )

  const setTheme = useCallback((next: GalleryTheme) => {
    setThemeState(next)
    saveTheme(next)
  }, [])

  const context = useMemo<GalleryContextValue>(() => ({ locale, strings, text: (value) => localize(value, locale) }), [locale, strings])

  const needle = fold(query.trim())
  const visible = useMemo(() => {
    if (!needle) return sections
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item: GalleryItem) => fold(`${localize(item.label, locale)} ${item.description ? localize(item.description, locale) : ''}`).includes(needle)),
      }))
      .filter((section) => section.items.length > 0)
  }, [needle, sections, locale])

  const portalHref = `${portalUrl.replace(/\/+$/, '')}/${locale}/previews`
  const repositoryHref = `https://github.com/${organization}/${repository}`

  return (
    <GalleryContext.Provider value={context}>
      <div className="gx-shell">
        <header className="gx-header">
          <button
            type="button"
            className="gx-menu-button"
            aria-expanded={menuOpen}
            aria-controls="gx-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {strings.menu}
          </button>
          <h1 className="gx-title">{localize(title, locale)}</h1>
          <div className="gx-controls">
            <a className="gx-link" href={portalHref}>
              {strings.previews}
            </a>
            <label className="gx-field">
              <span className="gx-visually-hidden">{strings.language}</span>
              <select value={locale} onChange={(event) => isGalleryLocale(event.target.value) && setLocale(event.target.value)}>
                {galleryLocales.map((code) => (
                  <option key={code} value={code}>
                    {galleryLanguageNames[code]}
                  </option>
                ))}
              </select>
            </label>
            <label className="gx-field">
              <span className="gx-visually-hidden">{strings.theme}</span>
              <select value={theme} onChange={(event) => setTheme(event.target.value as GalleryTheme)}>
                <option value="system">{strings.themeSystem}</option>
                <option value="light">{strings.themeLight}</option>
                <option value="dark">{strings.themeDark}</option>
              </select>
            </label>
          </div>
        </header>

        <div className="gx-body">
          <nav id="gx-navigation" className="gx-nav" data-open={menuOpen} aria-label={strings.navigation}>
            <input
              type="search"
              className="gx-search"
              value={query}
              placeholder={strings.search}
              aria-label={strings.search}
              onChange={(event) => setQuery(event.target.value)}
            />
            {visible.length === 0 && <p className="gx-empty">{strings.noResults}</p>}
            {visible.map((section) => (
              <section key={section.id} className="gx-section">
                <h2 className="gx-section-title">{localize(section.title, locale)}</h2>
                <ul className="gx-list">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="gx-item"
                        aria-current={item.id === selectedId ? 'page' : undefined}
                        onClick={() => {
                          onSelect(item.id)
                          setMenuOpen(false)
                        }}
                      >
                        {item.icon}
                        <span className="gx-item-text">
                          <span className="gx-item-label">{localize(item.label, locale)}</span>
                          {item.description && <span className="gx-item-description">{localize(item.description, locale)}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          <main className="gx-main">{children}</main>
        </div>

        <footer className="gx-footer">
          <a className="gx-link" href={repositoryHref}>
            {strings.repository}: {organization}/{repository}
          </a>
          {version && (
            <span>
              {strings.version}: {version}
            </span>
          )}
          {commit && (
            <span>
              {strings.commit}: {commit.slice(0, 7)}
            </span>
          )}
        </footer>
      </div>
    </GalleryContext.Provider>
  )
}
