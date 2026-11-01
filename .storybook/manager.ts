import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { storybookTheme } from '../src/gallery/storybookTheme'

addons.setConfig({ theme: create(storybookTheme({ title: 'Web Lib' })) })
