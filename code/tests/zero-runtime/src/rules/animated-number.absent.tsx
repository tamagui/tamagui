import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

/**
 * The measurement counterpart of `animated-number.tsx`: the identical module
 * with the four hooks and their animated styles removed, and nothing else
 * changed. The gzip difference between the two zero builds is therefore what an
 * app actually pays for importing the animated-number leaf, with no other
 * variable moving.
 */
function AnimatedNumberAbsentFixture() {
  const [reaction] = React.useState({ count: 0, value: 0 })

  return (
    <View data-testid="zero-root" padding={24}>
      <div data-testid="animated-box">animated</div>
      <div data-testid="animated-pair">pair</div>
      <div data-testid="reaction-count">{reaction.count}</div>
      <div data-testid="reaction-value">{reaction.value}</div>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<AnimatedNumberAbsentFixture />)
