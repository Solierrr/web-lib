import type { Preview } from '@storybook/react-vite'
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { uiTranslations } from '../src/locales'
import '../src/style.css'

i18n.use(initReactI18next).init({ lng: 'pt-BR', resources: uiTranslations, interpolation: { escapeValue: false } })

const preview: Preview = {
  // Os componentes de navegação (Hyperlink, Switcher) usam o roteador; as histórias rodam dentro de um MemoryRouter
  decorators: [(Story) => <I18nextProvider i18n={i18n}><MemoryRouter><Story /></MemoryRouter></I18nextProvider>],
  tags: ['autodocs'],
  parameters: {
    // Os testes de acessibilidade das histórias apontam as violações sem reprovar enquanto os componentes são ajustados
    a11y: { test: 'todo' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
