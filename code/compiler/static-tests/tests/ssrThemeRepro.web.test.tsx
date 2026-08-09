import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

// regression for sandbox ssr-theme failure: tokens inside extracted
// $theme-* / $group-* blocks must resolve to var(--x) references — a raw
// "$color5" in the emitted CSS is an invalid declaration browsers drop,
// so the theme style silently never applies.
test('tokens inside $theme-* blocks resolve to CSS variables', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return (
        <View
          width={100}
          height={100}
          boxShadow="0 2px 4px $shadowColor"
          $theme-light={{
            boxShadow: '0 4px 8px $color5',
          }}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  const styles = output?.styles ?? ''
  expect(styles).toContain('.t_light')
  expect(styles).toContain('var(--color5)')
  expect(styles).not.toContain('$color5')
})

// nested media-like keys inside a theme block can't extract in one pass —
// the whole prop must stay on the runtime path (kept as an inline JSX attr)
test('nested media inside $theme-* deopts to runtime', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return (
        <View
          width={100}
          $theme-dark={{
            $sm: { backgroundColor: 'red' },
          }}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js ?? '').toContain('$theme-dark')
})
