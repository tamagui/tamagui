import { useState } from 'react'
import { View, styled } from '@tamagui/web'

const AnimatedBox = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: '$background',
  // non-animatable props that should stay as className
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  flexDirection: 'column',
  // animatable props
  opacity: 1,
  transition: 'quick',

  variants: {
    active: {
      true: {
        opacity: 0.5,
        backgroundColor: '$color',
      },
    },
  } as const,
})

export function DriverDisableAnimationPropsCase() {
  const [active, setActive] = useState(false)

  return (
    <View padding={20}>
      <AnimatedBox
        data-testid="animated-box"
        active={active}
        onPress={() => setActive(!active)}
      />
      <View data-testid="trigger" onPress={() => setActive(!active)}>
        Toggle
      </View>
    </View>
  )
}
