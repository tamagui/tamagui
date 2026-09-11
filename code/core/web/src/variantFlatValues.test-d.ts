import { describe, test } from 'vitest'

import { styled } from './styled'
import { View } from './views/View'

describe('variant props take conditional flat forms', () => {
  const Frame = styled(View, {
    variants: {
      density: {
        compact: { height: 20 },
        roomy: { height: 40 },
      },
    } as const,
  })

  type DensityProp = React.ComponentProps<typeof Frame>['density']

  test('keyed variant props accept plain keys, clause strings, and flat objects', () => {
    const plain: DensityProp = 'compact'
    const clauseString: DensityProp = 'compact sm:roomy'
    const clauseObject: DensityProp = { default: 'compact', sm: 'roomy' }
    void plain
    void clauseString
    void clauseObject
  })
})
