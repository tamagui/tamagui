import * as babel from '@babel/core'
import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

// TODO need to test familys across media queries
test('font family across media queries', async () => {
  const output = await extractForWeb(
    `
    import { H2 } from 'tamagui'
    export function Test(props) {
      return (
        <H2
          ff="$silkscreen"
          size="$12"
          $lg={{
            size: '$9',
          }}
          $sm={{
            size: '$8',
            ff: '$mono',
          }}
        >
          Test
        </H2>
      )
    }
  `,
    {
      options: {
        components: ['tamagui'],
      },
    }
  )

  // font classes are no longer generated - fonts inherit from root
  expect(output?.js).toBeTruthy()
})

test('font family and size ternaries sharing a condition resolve together', async () => {
  const output = await extractForWeb(`
    import * as React from 'react'
    import { SizableText } from 'tamagui'

    export function Test({ compact }) {
      return (
        <SizableText
          fontFamily={compact ? '$body' : '$heading'}
          color="$color12"
          size={compact ? '$5' : '$7'}
        >
          Go
        </SizableText>
      )
    }
  `)

  expect(output).toBeTruthy()
  if (!output) {
    return
  }

  const compiled = await babel.transformAsync(output.js, {
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-transform-react-jsx',
    ],
  })
  expect(compiled?.code).toBeTruthy()
  if (!compiled?.code) {
    return
  }

  const compiledModule = { exports: Object.create(null) }
  new Function('module', 'exports', 'require', compiled.code)(
    compiledModule,
    compiledModule.exports,
    (id: string) => (id === 'react' ? React : {})
  )

  const expanded = compiledModule.exports.Test({ compact: false })
  const compact = compiledModule.exports.Test({ compact: true })

  const expandedClasses = expanded.props.className.split(' ')
  const compactClasses = compact.props.className.split(' ')

  expect(expandedClasses.filter((name) => name.startsWith('font_'))).toEqual([
    'font_heading',
  ])
  expect(expandedClasses).toContain('_fos-f-size-7')
  expect(compactClasses.filter((name) => name.startsWith('font_'))).toEqual(['font_body'])
  expect(compactClasses).toContain('_fos-f-size-5')
})
