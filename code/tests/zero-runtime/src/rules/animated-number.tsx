import { useAnimatedNumberReaction, useAnimatedNumbersStyle } from '@tamagui/core'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useAnimatedNumber, useAnimatedNumberStyle, View } from 'tamagui'

/**
 * The one opt-in runtime a zero graph may keep, exercising all four public
 * hooks. They are imported from the public `tamagui` and `@tamagui/core`
 * barrels, since both are rewritten to the animated-number leaf and neither
 * barrel may enter the client graph.
 *
 * The animated styles are applied to literal host elements, which is the only
 * shape the design allows: applying one to a Tamagui component as a dynamic
 * style prop is a rule 3 error.
 */
function AnimatedNumberFixture() {
  const offset = useAnimatedNumber(0)
  const scale = useAnimatedNumber(1)
  const [reaction, setReaction] = React.useState({ count: 0, value: 0 })

  const style = useAnimatedNumberStyle(offset, (value) => ({
    transform: `translateX(${value}px)`,
  }))

  // offset already has a style host, so this hook subscribes to its live value
  // and hosts scale itself. one call covers both branches of the linked render.
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

createRoot(document.getElementById('root')!).render(<AnimatedNumberFixture />)
