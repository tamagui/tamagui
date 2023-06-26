import { join } from 'path'

import chalk from 'chalk'

import { IS_TEST } from './constants'
import { makeRainbowChalk } from './helpers/rainbowChalk'
import nextExpoSolito from './steps/next-expo-solito'
import simpleWeb from './steps/simple-web'
import takeoutSteps from './steps/takeout'

const repoRoot = join(__dirname, '..', '..', '..')

export const templates = [
  {
    title: `Next + Expo + Solito (recommended for production) - Production-ready universal app with a monorepo.`,
    value: 'next-expo-solito',
    type: 'included-in-monorepo',
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/tamagui.git`,
      dir: ['starters', 'next-expo-solito'],
      branch: 'master',
    },
    extraSteps: nextExpoSolito,
  },

  {
    title: `Simple Web (only for learning - not recommended for production) - Client-only web app with Webpack or Vite. Useful to understand how to set up tamagui.config.ts.`,
    value: 'simple-web',
    type: 'included-in-monorepo',
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/tamagui.git`,
      dir: [`starters`, `simple-web`],
      branch: 'master',
    },
    extraSteps: simpleWeb,
  },
  {
    title: `${chalk.bold.underline(
      `🥡 Takeout Starter (${makeRainbowChalk('Premium')})`
    )} - Production-ready universal app with onboarding, authentication, account, settings, profiles, feed, adaptive universal layouts and more.`,
    value: `takeout-starter`,
    type: 'premium',
    hidden: true,
    repo: {
      url: `https://github.com/tamagui/unistack`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },
]
