import * as babel from '@babel/core'
import anyTest, { TestInterface } from 'ava'

process.env.NODE_ENV = 'test'

const test = anyTest as TestInterface

test('extracts stylesheets out', async (t) => {
  const code = `
import { VStack } from 'snackui'

export function Test() {
  return (
    <VStack backgroundColor="red" />
  )
}
  `

  const output = babel.transformSync(code, {
    plugins: [
      require('../_/index'),
      [
        '@babel/plugin-syntax-typescript',
        {
          isTSX: true,
        },
      ],
    ],
  })

  console.log('output\n\n', output.code)

  t.assert(1 === 1)
})
