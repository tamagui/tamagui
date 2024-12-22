import type { ExtraSteps } from './steps/types'

import chalk from 'chalk'

import simpleWeb from './steps/simple-web'
import expoRouter from './steps/expo-router'
import starterFree from './steps/starter-free'
import remix from './steps/remix'
import takeoutSteps from './steps/takeout'

export const templates: Array<{
  title: string
  value: string
  type: 'free' | 'premium' | 'included-in-monorepo'
  hidden: boolean
  packageManager: 'yarn' | 'npm' | 'pnpm'
  repo: { url: string; sshFallback: string; dir: string[]; branch: string }
  extraSteps?: ExtraSteps
}> = [
  {
    title: `Free - Expo + Next in a production ready monorepo`,
    value: 'starter-free',
    type: 'free',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url:
        process.env.STARTER_FREE_REPO_SOURCE ||
        `https://github.com/tamagui/starter-free.git`,
      sshFallback: `git@github.com:tamagui/starter-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: starterFree,
  },

  {
    title: `${chalk.bold.underline(
      `🥡 ${chalk.magenta('Take')}${chalk.red('out')}`
    )} - Supported stack with more to start: https://tamagui.dev/takeout`,
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

  {
    title: `Expo Router (beta) - Expo Router starter with Tamagui set up`,
    value: 'expo-router',
    type: 'included-in-monorepo',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url: process.env.TAMAGUI_REPO_SOURCE || `https://github.com/tamagui/tamagui.git`,
      sshFallback: `git@github.com:tamagui/tamagui.git`,
      dir: [`code`, `starters`, `expo-router`],
      branch: 'master',
    },
    extraSteps: expoRouter,
  },
  {
    title: `Learn - Vite + Webpack, Tamagui config from scratch`,
    value: 'simple-web',
    type: 'included-in-monorepo',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url: process.env.TAMAGUI_REPO_SOURCE || `https://github.com/tamagui/tamagui.git`,
      sshFallback: `git@github.com:tamagui/tamagui.git`,
      dir: [`code`, `starters`, `simple-web`],
      branch: 'master',
    },
    extraSteps: simpleWeb,
  },
  {
    title: `Remix - Remix + Vite starter with Tamagui set up`,
    value: 'remix',
    type: 'included-in-monorepo',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url: process.env.TAMAGUI_REPO_SOURCE || `https://github.com/tamagui/tamagui.git`,
      sshFallback: `git@github.com:tamagui/tamagui.git`,
      dir: [`code`, `starters`, `remix`],
      branch: 'master',
    },
    extraSteps: remix,
  },
]
