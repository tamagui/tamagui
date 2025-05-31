import * as babel from '@babel/core'

async function run() {
  const output = await extractForNative(`
      import { Text, styled } from 'tamagui'
      
      const XStack = styled(Text, {
        fontFamily: '$heading',
        
        hoverStyle: {
          fontFamily: '$heading'
        },

        variants: {},
        defaultVariants: {},
      })

      const XStack2 = styled(XStack, {
        fontFamily: '$heading',
        
        hoverStyle: {
          fontFamily: '$heading'
        },
      })
    `)

  console.log(output?.code)
}

run()

async function extractForNative(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel-config-test.js',
    filename: 'test.tsx',
  })
}
