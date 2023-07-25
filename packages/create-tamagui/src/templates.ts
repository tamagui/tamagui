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
    title: `Next + Expo + Solito - Production-ready universal app with a monorepo.`,
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
    title: `Simple Web - Learning only, not prod-ready. Client web app, Webpack + Vite. Helps understand tamagui.config.ts.`,
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
    )} - Prod-ready universal app - onboarding, auth, account, settings, profiles, feed, adaptive layouts & more.`,
    value: `takeout-starter`,
    type: 'premium',
    repo: {
      url: `https://github.com/tamagui/unistack`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },
]
