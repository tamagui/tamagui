import { join } from 'path'

import chalk from 'chalk'

import { IS_TEST } from './create-tamagui-constants'
import { makeRainbowChalk } from './helpers/rainbowChalk'
import simpleWeb from './steps/simple-web'
import starterFree from './steps/starter-free'
import takeoutSteps from './steps/takeout'

const repoRoot = join(__dirname, '..', '..', '..')

// for local dev/test only
const starterFreeRoot = join(__dirname, '..', '..', '..', '..', 'starter-free')

export const templates = [
  {
    title: `Next Expo Solito - Prod-ready universal app with a monorepo`,
    value: 'starter-free',
    type: 'free',
    hidden: false,
    repo: {
      url: IS_TEST
        ? `file://${starterFreeRoot}`
        : `https://github.com/tamagui/starter-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: starterFree,
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
      url: `https://github.com/tamagui/takeout`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },
]
