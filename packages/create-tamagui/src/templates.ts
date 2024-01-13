import { existsSync } from 'fs'
import { join } from 'path'

import chalk from 'chalk'

import { IS_TEST } from './create-tamagui-constants'
import { makeRainbowChalk } from './helpers/rainbowChalk'
import simpleWeb from './steps/simple-web'
import expoRouter from './steps/expo-router'
import starterFree from './steps/starter-free'
import takeoutSteps from './steps/takeout'

const repoRoot = join(__dirname, '..', '..', '..')

// for local dev/test only
const starterFreeRoot = join(__dirname, '..', '..', '..', '..', 'starter-free')
const starterExists = existsSync(starterFreeRoot)

export const templates = [
  {
    title: `Free - Expo + Next in a production ready monorepo`,
    value: 'starter-free',
    type: 'free',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url:
        IS_TEST && starterExists
          ? `file://${starterFreeRoot}`
          : `https://github.com/tamagui/starter-free.git`,
      sshFallback: `git@github.com:tamagui/starter-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: starterFree,
  },

  {
    title: `Learning - Vite + Webpack, Tamagui config from scratch`,
    value: 'simple-web',
    type: 'included-in-monorepo',
    hidden: false,
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/tamagui.git`,
      sshFallback: `git@github.com:tamagui/tamagui.git`,
      dir: [`starters`, `simple-web`],
      branch: 'master',
    },
    extraSteps: simpleWeb,
  },

  {
    title: `Expo Router (beta) - The base Expo router starter + Tamagui`,
    value: 'expo-router',
    type: 'included-in-monorepo',
    hidden: false,
    repo: {
      url: IS_TEST ? `file://${repoRoot}` : `https://github.com/tamagui/tamagui.git`,
      sshFallback: `git@github.com:tamagui/tamagui.git`,
      dir: [`starters`, `expo-router`],
      branch: 'master',
    },
    extraSteps: expoRouter,
  },

  {
    title: `${chalk.bold.underline(
      `🥡 ${makeRainbowChalk('Takeout')}`
    )} - Paid stack to ship apps w/users fast: https://tamagui.dev/takeout`,
    value: `takeout-starter`,
    type: 'premium',
    packageManager: 'yarn',
    hidden: false,
    repo: {
      url: `https://github.com/tamagui/takeout`,
      sshFallback: `git@github.com:tamagui/takeout.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },
] as const
