import dedent from 'dedent'
import { describe, expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

// kitchen-sink ThemeMutation: `<Square size={100} />` rendered nothing on
// device. Square's `styled()` literal was visible in the graph, and the config
// the host derived from it lost the dynamic `size` variant, so the prop was
// left on a bare view
describe('styled definitions visible in the graph', () => {
  test('the evaluated config beats one derived from a package source literal', async () => {
    const output = await extractForNative(dedent`
      import { WorkspaceSquare } from '@workspace/shapes'

      export function Test() {
        return <WorkspaceSquare testID="sq" size={100} backgroundColor="red" />
      }
    `)
    expect(output.code).not.toMatch(/size:\s*100/)
    expect(output.code).toContain('"alignItems":"center"')
    expect(output.code).toContain('"width":100')
    expect(output.code).toContain('"height":100')
  })

  test('the object form keeps its options when a static config follows', async () => {
    const output = await extractForNative(dedent`
      import { View, styled } from '@tamagui/core'

      const Box = styled(View, { padding: 10 }, { memo: true })

      export function Test() {
        return <Box testID="box" backgroundColor="red" />
      }
    `)
    expect(output.code).toContain('"paddingTop":10')
    expect(output.code).toContain('"backgroundColor":"red"')
    expect(output.code).not.toContain('"memo"')
  })
})
