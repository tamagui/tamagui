#!/usr/bin/env node

import { getVariableValue } from '@tamagui/core-node'
import esbuild from 'esbuild'
import fs, { ensureDir } from 'fs-extra'

import { ResolvedOptions } from './types.js'
import { loadTamagui } from './utils.js'

export async function generateTamaguiConfig(options: ResolvedOptions) {
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
  for (const key in components) {
    const component = components[key]
    for (const _ in component.nameToInfo) {
      delete component.nameToInfo[_].staticConfig['validStyles']
    }
  }

  // set to array
  for (const key in nameToPaths) {
    // @ts-ignore
    nameToPaths[key] = [...nameToPaths[key]]
  }

  // cleanup other stuff
  // @ts-ignore
  delete config.tamaguiConfig['Provider']
  // @ts-ignore
  delete config.tamaguiConfig['fontsParsed']
  // @ts-ignore
  delete config.tamaguiConfig['getCSS']
  // @ts-ignore
  delete config.tamaguiConfig['tokensParsed']
  // @ts-ignore
  delete config.tamaguiConfig['themeConfig']

  await fs.writeJSON(options.paths.conf, config, {
    spaces: 2,
  })
}

async function getTamaguiConfig(options: ResolvedOptions) {
  return loadTamagui(options.tamaguiOptions)
}

export async function watchTamaguiConfig(options: ResolvedOptions) {
  if (!options.tamaguiOptions.config) return
  await generateTamaguiConfig(options)
  await esbuild.build({
    entryPoints: [options.tamaguiOptions.config],
    sourcemap: false,
    // dont output just use esbuild as a watcher
    write: false,
    watch: {
      onRebuild(err, result) {
        generateTamaguiConfig(options)
      },
    },
  })
}
