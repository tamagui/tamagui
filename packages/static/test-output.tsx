import * as babel from '@babel/core'

async function run() {
  const output = await extractBabel(`
      import { YStack, styled } from 'tamagui'
      
      const Me = styled(YStack, {
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: '$borderColor',
        borderRadius: '$4',
        shadowColor: 'red',
        shadowRadius: 100,
        
        hoverStyle: {
          backgroundColor: 'green'
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
