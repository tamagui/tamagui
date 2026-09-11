import { expectTypeOf, test } from 'vitest'

import type { TextProps } from '../types'
import { html } from './html'

test('text-backed html elements accept the regular Tamagui text prop surface', () => {
  type AnchorProps = React.ComponentProps<typeof html.a>
  expectTypeOf<TextProps['tabIndex']>().toMatchTypeOf<AnchorProps['tabIndex']>()
})
