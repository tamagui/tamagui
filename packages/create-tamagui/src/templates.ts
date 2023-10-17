import { join } from 'path'

import chalk from 'chalk'

import { IS_TEST } from './create-tamagui-constants'
import { makeRainbowChalk } from './helpers/rainbowChalk'
import nextExpoSolito from './steps/next-expo-solito'
import simpleWeb from './steps/simple-web'
import takeoutSteps from './steps/takeout'

const repoRoot = join(__dirname, '..', '..', '..')

export const templates = [
  {
    title: `Next Expo Solito - Prod-ready universal app with a monorepo`,
    value: 'next-expo-solito',
    type: 'free',
    hidden: false,
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/starter-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: nextExpoSolito,
  },

  {
    title: `Simple Web - For learning, client app, Webpack & Vite, custom tamagui.config`,
    value: 'simple-web',
    type: 'included-in-monorepo',
    hidden: false,
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/tamagui.git`,
      dir: [`starters`, `simple-web`],
      branch: 'master',
    },
    extraSteps: simpleWeb,
  },
  {
    title: `${chalk.bold.underline(
      `🥡 ${makeRainbowChalk('Takeout')}`
    )} - Pro, prod-ready universal app w/onboard, auth, account, settings, testing +++`,
    value: `takeout-starter`,
    type: 'premium',
    hidden: false,
    repo: {
      url: `https://github.com/tamagui/unistack`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },
]
