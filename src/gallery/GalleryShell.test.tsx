import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { GalleryShell } from './GalleryShell.js'
import { useGallery } from './context.js'
import type { GallerySection } from './types.js'

const sections: GallerySection[] = [
  {
    id: 'models',
    title: { 'pt-BR': 'Modelos', 'en-US': 'Templates', 'es-ES': 'Plantillas' },
    items: [
      { id: 'invoice', label: { 'pt-BR': 'Fatura', 'en-US': 'Invoice', 'es-ES': 'Factura' }, description: 'Cobrança mensal' },
      { id: 'report', label: { 'pt-BR': 'Relatório', 'en-US': 'Report', 'es-ES': 'Informe' } },
    ],
  },
]

function Probe() {
  const { locale, text } = useGallery()
  return <p data-testid="probe">{`${locale}:${text({ 'pt-BR': 'olá', 'en-US': 'hello', 'es-ES': 'hola' })}`}</p>
}

function renderShell(overrides: { onSelect?: (id: string) => void; selectedId?: string } = {}) {
  return render(
    <GalleryShell
      title="Email preview"
      repository="api-email"
      version="1.2.3"
      commit="abcdef1234567"
      sections={sections}
      selectedId={overrides.selectedId ?? 'invoice'}
      onSelect={overrides.onSelect ?? (() => undefined)}
    >
      <Probe />
    </GalleryShell>,
  )
}

describe('GalleryShell', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['pt-BR'])
    delete document.documentElement.dataset.galleryTheme
  })

  it('shows the content, the sections and the footer data', () => {
    renderShell()
    expect(screen.getByRole('heading', { level: 1, name: 'Email preview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Modelos' })).toBeInTheDocument()
    expect(screen.getByTestId('probe')).toHaveTextContent('pt-BR:olá')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link')).toHaveAttribute('href', 'https://github.com/Solierrr/api-email')
    expect(footer).toHaveTextContent('1.2.3')
    expect(footer).toHaveTextContent('abcdef1')
    expect(footer).not.toHaveTextContent('abcdef12')
  })

  it('marks the selected item and reports a click', () => {
    const onSelect = vi.fn()
    renderShell({ onSelect })
    expect(screen.getByRole('button', { name: /Fatura/ })).toHaveAttribute('aria-current', 'page')
    fireEvent.click(screen.getByRole('button', { name: 'Relatório' }))
    expect(onSelect).toHaveBeenCalledWith('report')
  })

  it('filters by label and description ignoring case and accents', () => {
    renderShell()
    const search = screen.getByRole('searchbox', { name: 'Buscar' })
    fireEvent.change(search, { target: { value: 'RELATORIO' } })
    expect(screen.queryByRole('button', { name: /Fatura/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Relatório' })).toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'cobranca' } })
    expect(screen.getByRole('button', { name: /Fatura/ })).toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'zzz' } })
    expect(screen.getByText('Nada encontrado.')).toBeInTheDocument()
  })

  it('switches the language, remembers it and points the portal link to it', () => {
    renderShell()
    fireEvent.change(screen.getByRole('combobox', { name: 'Idioma' }), { target: { value: 'es-ES' } })
    expect(document.documentElement.lang).toBe('es-ES')
    expect(screen.getByTestId('probe')).toHaveTextContent('es-ES:hola')
    expect(screen.getByRole('heading', { name: 'Plantillas' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Previews' })).toHaveAttribute('href', 'https://docs.solarianetwork.site/es-ES/previews')
    expect(window.localStorage.getItem('gallery.locale')).toBe('es-ES')
  })

  it('starts in the saved language', () => {
    window.localStorage.setItem('gallery.locale', 'en-US')
    renderShell()
    expect(screen.getByTestId('probe')).toHaveTextContent('en-US:hello')
  })

  it('applies and remembers the theme', () => {
    renderShell()
    expect(document.documentElement.dataset.galleryTheme).toBe('system')
    fireEvent.change(screen.getByRole('combobox', { name: 'Tema' }), { target: { value: 'dark' } })
    expect(document.documentElement.dataset.galleryTheme).toBe('dark')
    expect(window.localStorage.getItem('gallery.theme')).toBe('dark')
  })

  it('opens and closes the menu on small screens', () => {
    renderShell()
    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Navegação' })).toHaveAttribute('data-open', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Relatório' }))
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
