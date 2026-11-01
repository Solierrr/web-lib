export interface StorybookThemeInput {
  /** Nome do preview, mostrado no topo do Storybook. */
  title: string
  /** Endereço do portal que lista todos os previews. */
  portalUrl?: string
}

// Valores para `create()` de `storybook/theming`, no manager (.storybook/manager.ts), com as cores e a fonte da web-lib
export function storybookTheme({ title, portalUrl = 'https://docs.solarianetwork.site' }: StorybookThemeInput) {
  return {
    base: 'light' as const,
    brandTitle: title,
    brandUrl: `${portalUrl.replace(/\/+$/, '')}/pt-BR/previews`,
    brandTarget: '_self' as const,
    colorPrimary: '#C46717',
    colorSecondary: '#C46717',
    fontBase: '"Plus Jakarta Sans", sans-serif',
    textColor: '#242628',
    appBorderRadius: 8,
    inputBorderRadius: 8,
  }
}
