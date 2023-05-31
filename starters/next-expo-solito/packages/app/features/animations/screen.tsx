import { Paragraph, Sheet, YStack, useToastController } from '@my/ui'
import { Button as RNButton, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useLink } from 'solito/link'
import { Play } from '@tamagui/lucide-icons'
import { Button, Square, useControllableState, useEvent } from 'tamagui'
export function AnimationScreen() {
  const linkProps = useLink({
    href: '/user/nate',
  })

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack maw={600}>
        <Paragraph ta="center">Heres an example reanimated (v2) animation.</Paragraph>
        <AnimatedStyleUpdateExample />
        <AnimationsDemo />
      </YStack>
    </YStack>
  )
}
export function AnimationsDemo(props) {
  const [positionI, setPositionI] = useControllableState({
    strategy: 'most-recent-wins',
    prop: props.position,
    defaultProp: 0,
  })
  const position = positions[positionI]
  const onPress = useEvent(() => {
    setPositionI((x) => {
      return (x + 1) % positions.length
    })
  })

  return (
    <>
      <Square
        animation={props.animation || 'bouncy'}
        onPress={onPress}
        size={104}
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$9"
        backgroundColor="$color9"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      ></Square>
      <Button
        position="absolute"
        bottom={20}
        left={20}
        icon={Play}
        theme={props.tint}
        size="$5"
        circular
        onPress={onPress}
      />
    </>
  )
}

export const positions = [
  {
    x: 0,
    y: 0,
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
    hoverStyle: {
      scale: 0.6,
    },
    pressStyle: {
      scale: 0.4,
    },
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
    hoverStyle: {
      scale: 1.1,
    },
    pressStyle: {
      scale: 0.9,
    },
  },
]

export default function AnimatedStyleUpdateExample(props) {
  const randomWidth = useSharedValue(10)

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  }

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    }
  })

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Animated.View
        style={[{ width: 100, height: 80, backgroundColor: 'black', margin: 30 }, style]}
      />
      <RNButton
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350
        }}
      />
    </View>
  )
}
function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToastController()

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
