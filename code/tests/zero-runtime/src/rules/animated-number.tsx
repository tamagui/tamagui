import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useAnimatedNumber, useAnimatedNumberStyle, View } from 'tamagui'

/**
 * The one opt-in runtime a zero graph may keep. The hooks are imported from the
 * public `tamagui` barrel; zero mode rewrites them to the animated-number leaf,
 * so the barrel never enters the client graph.
 *
 * The animated style is applied to a literal host element, which is the only
 * shape the design allows: applying it to a Tamagui component as a dynamic
 * style prop is a rule 3 error.
 */
function AnimatedNumberFixture() {
  const offset = useAnimatedNumber(0)
  const style = useAnimatedNumberStyle(offset, (value) => ({
    transform: `translateX(${value}px)`,
  }))

  React.useEffect(() => {
    offset.setValue(120, { type: 'timing', duration: 60 }, () => {
      document.title = 'animated-number settled'
    })
  }, [offset])

  return (
    <View data-testid="zero-root" padding={24}>
      <div data-testid="animated-box" style={style}>
        animated
      </div>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<AnimatedNumberFixture />)
