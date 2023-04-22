#!/usr/bin/env node

import { getVariableValue } from '@tamagui/core-node'
import { CLIResolvedOptions } from '@tamagui/types'
import esbuild from 'esbuild'
import fs, { ensureDir } from 'fs-extra'

import { loadTamagui } from './utils.js'

export async function generateTamaguiConfig(options: CLIResolvedOptions) {
  await ensureDir(options.paths.dotDir)
  const config = await getTamaguiConfig(options)
  const { components, nameToPaths } = config
  const { themes, tokens } = config.tamaguiConfig

  // reduce down to usable, smaller json

  // slim themes, add name
  for (const key in themes) {
    const theme = themes[key]
    // @ts-ignore
    theme.id = key
    for (const tkey in theme) {
      theme[tkey] = getVariableValue(theme[tkey])
    }
  }

  // flatten variables
  for (const key in tokens) {
    const token = tokens[key]
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      delete component.nameToInfo[_].staticConfig['validStyles']
      delete component.nameToInfo[_].staticConfig['parentStaticConfig']
    }
  }

  // set to array
  for (const key in nameToPaths) {
    // @ts-ignore
    nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const { fontsParsed, getCSS, tokensParsed, themeConfig, ...cleanedConfig } =
    config.tamaguiConfig

  await fs.writeJSON(
    options.paths.conf,
    {
      ...config,
      tamaguiConfig: cleanedConfig,
    },
    {
      spaces: 2,
    }
  )
}

async function getTamaguiConfig(options: CLIResolvedOptions) {
  return loadTamagui(options.tamaguiOptions)
}

export async function watchTamaguiConfig(options: CLIResolvedOptions) {
  if (!options.tamaguiOptions.config) return

  try {
    await generateTamaguiConfig(options)
    const context = await esbuild.context({
      entryPoints: [options.tamaguiOptions.config],
      sourcemap: false,
      // dont output just use esbuild as a watcher
      write: false,

      plugins: [
        {
          name: `on-rebuild`,
          setup({ onEnd }) {
            onEnd((res) => {
              generateTamaguiConfig(options)
            })
          },
        },
      ],
    })

    await context.watch()
  } catch (err) {
    console.warn(
      `Warning watching config error, you may need to restart on config changes: ${err}`
    )
  }
}
