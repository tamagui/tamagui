import * as babel from '@babel/core'

async function run() {
  const output = await extractBabel(`
      import { YStack, styled } from 'tamagui'
      
      const XStack = styled(YStack, {
        backgroundColor: 'red',
        
        hoverStyle: {
          x: 10,
          y: 100,
        },

        variants: {},
        defaultVariants: {},
      })
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
