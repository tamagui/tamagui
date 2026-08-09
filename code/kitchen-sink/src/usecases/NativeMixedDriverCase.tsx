import React from 'react'
import { Button, Configuration, Paragraph, YStack } from 'tamagui'

import { animationsNative } from '../tamagui.config'

export function NativeMixedDriverCase() {
  const [expanded, setExpanded] = React.useState(false)
  const [renderCount, setRenderCount] = React.useState(0)

  return (
    <Configuration animationDriver={animationsNative}>
      <YStack padding="$4" gap="$4" items="center">
        <Button
          id="native-mixed-driver-toggle"
          testID="native-mixed-driver-toggle"
          onPress={() => setExpanded((value) => !value)}
        >
          Toggle
        </Button>

        <YStack
          id="native-mixed-driver-node"
          testID="native-mixed-driver-node"
          width={120}
          height={expanded ? 160 : 40}
          opacity={expanded ? 0 : 1}
          backgroundColor="$blue10"
          transition="300ms"
        />

        <Paragraph id="native-mixed-driver-status" testID="native-mixed-driver-status">
          {expanded ? 'expanded-target' : 'collapsed-target'}
        </Paragraph>

        <Button
          id="native-pseudo-only-rerender"
          onPress={() => setRenderCount((count) => count + 1)}
        >
          Incidental render
        </Button>
        <YStack
          id="native-pseudo-only-node"
          width={80}
          height={80}
          backgroundColor="$green10"
          transition="300ms"
          hoverStyle={{ opacity: 0.2 }}
        />
        <Paragraph id="native-pseudo-only-render-count">{renderCount}</Paragraph>
      </YStack>
    </Configuration>
  )
}
