import * as babel from '@babel/core'

async function run() {
  const output = await extractBabel(`
      import { Separator } from 'tamagui'
      export function Test() {
        return (
          <Separator />
        )
      }
    `)

  console.log(output?.code)
}

run()

async function extractBabel(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel.config.test.js',
    filename: 'test.tsx',
  })
}
