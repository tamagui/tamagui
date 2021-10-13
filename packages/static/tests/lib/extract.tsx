import * as babel from '@babel/core'

export async function extractBabel(code: string) {
  return await babel.transformAsync(code, {
    configFile: 'babel.config.test.js',
    filename: 'test.tsx',
  })
}
