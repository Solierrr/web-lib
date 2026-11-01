import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// Dois projetos: os testes unitários (jsdom) e os testes das histórias (navegador), como no web-app.
// `npm test` roda só o unitário; `npm run test:storybook` roda as histórias (precisa do Chromium do Playwright).
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./src/test.setup.ts'],
          include: ['src/components/**/*.test.{ts,tsx}', 'src/gallery/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [tailwindcss(), storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright({}), instances: [{ browser: 'chromium' }] },
        },
      },
    ],
  },
})
