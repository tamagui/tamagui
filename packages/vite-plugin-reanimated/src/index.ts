// add babel only for files that have a reanimated import

import { transform } from '@babel/core'
import type { Plugin } from 'vite'

export interface BabelPluginOptions {
  apply?: 'serve' | 'build'
  shouldTransform?: (code: string, id: string) => boolean
}

export default function babelReanimatedVitePlugin({
  shouldTransform = filterReanimated,
  apply,
}: BabelPluginOptions = {}): Plugin {
  return {
    name: 'reanimated-babel-plugin',
    apply,
    enforce: 'pre',
    async transform(code, id) {
      if (!shouldTransform(code, id)) return
      const { code: output, map } = await transform(code, {
        filename: id,
        babelrc: false,
        plugins: ['react-native-reanimated/plugin'],
        presets: ['@babel/preset-typescript'],
      })
      return {
        code: output ?? '',
        map,
      }
    },
  }
}

// very rough heuristics to avoid parsing most files - just if any file mentioned reanimated include it, even in filename
function filterReanimated(code: string, id: string) {
  if (id.includes('node_modules/')) {
    return false
  }
  if (id.includes('reanimated')) {
    return true
  }
  if (code.includes('reanimated') || code.includes(`'worklet'`)) {
    return true
  }
  return false
}
