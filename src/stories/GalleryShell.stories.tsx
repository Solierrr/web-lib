import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { GalleryShell, useGallery, type GallerySection } from '../gallery'
import '../gallery/gallery.css'

const sections: GallerySection[] = [
  {
    id: 'models',
    title: { 'pt-BR': 'Modelos', 'en-US': 'Templates', 'es-ES': 'Plantillas' },
    items: [
      { id: 'invoice', label: { 'pt-BR': 'Fatura', 'en-US': 'Invoice', 'es-ES': 'Factura' }, description: { 'pt-BR': 'Cobrança mensal', 'en-US': 'Monthly billing', 'es-ES': 'Cobro mensual' } },
      { id: 'report', label: { 'pt-BR': 'Relatório', 'en-US': 'Report', 'es-ES': 'Informe' } },
    ],
  },
]

function Content({ id }: { id: string }) {
  const { locale, text } = useGallery()
  return <p>{`${locale}: ${id} (${text({ 'pt-BR': 'conteúdo do preview', 'en-US': 'preview content', 'es-ES': 'contenido del preview' })})`}</p>
}

function Example() {
  const [selected, setSelected] = useState('invoice')
  return (
    <GalleryShell title="Preview" repository="example" version="1.0.0" commit="0123456789abcdef" sections={sections} selectedId={selected} onSelect={setSelected}>
      <Content id={selected} />
    </GalleryShell>
  )
}

const meta = {
  title: 'Gallery/GalleryShell',
  component: Example,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
