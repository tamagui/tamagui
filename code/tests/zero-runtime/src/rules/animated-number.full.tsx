import { useAnimatedNumberReaction, useAnimatedNumbersStyle } from '@tamagui/core'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useAnimatedNumber, useAnimatedNumberStyle, View } from 'tamagui'
import '../../tamagui.config'

/**
 * The full-driver half of the three-artifact animation measurement: the same
 * module as `animated-number.tsx`, built as ordinary compiled Tamagui.
 *
 * The config import is what makes the driver reachable, and it is the one line
 * that differs. `useAnimationDriver` resolves the driver off parsed config at
 * runtime, so nothing statically imports `createAnimations` until the config
 * does; a full-runtime entry that never imports its config ships no driver at
 * all and would measure nothing.
 */
function AnimatedNumberFullFixture() {
  const offset = useAnimatedNumber(0)
  const scale = useAnimatedNumber(1)
  const [reaction, setReaction] = React.useState({ count: 0, value: 0 })

  const style = useAnimatedNumberStyle(offset, (value) => ({
    transform: `translateX(${value}px)`,
  }))

  const pairStyle = useAnimatedNumbersStyle([offset, scale], (x, s) => ({
    transform: `translateX(${x}px) scale(${s})`,
  }))

  useAnimatedNumberReaction({ value: offset }, (value) => {
    setReaction((previous) => ({ count: previous.count + 1, value }))
  })

  React.useEffect(() => {
    scale.setValue(2, { type: 'timing', duration: 60 })
    offset.setValue(120, { type: 'timing', duration: 60 }, () => {
      document.title = 'animated-number settled'
    })
  }, [offset, scale])

  return (
    <View data-testid="zero-root" padding={24}>
      <div data-testid="animated-box" style={style}>
        animated
      </div>
      <div data-testid="animated-pair" style={pairStyle}>
        pair
      </div>
      <div data-testid="reaction-count">{reaction.count}</div>
      <div data-testid="reaction-value">{reaction.value}</div>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<AnimatedNumberFullFixture />)
