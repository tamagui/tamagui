// debug-verbose
// import './wdyr'

import { MenuSquare } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { View } from 'react-native'
import { AnimatePresence, Button, Sheet, Square, Stack, Text, styled } from 'tamagui'

export const Sandbox = () => {
  const [open, setOpen] = useState(true)

  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        {/* <AnimatedNumbers /> */}

        <MenuSquare bg="$background" />

        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          animation="lazy"
          dismissOnOverlayPress={false}
          dismissOnSnapToBottom={false}
        >
          <Sheet.Overlay
            animation="lazy"
            backgroundColor="transparent"
            height="100%"
            style={{ backdropFilter: 'blur(6px)' }}
          />
          <Sheet.Frame
            backgroundColor="#fff"
            flex={1}
            justifyContent="flex-end"
            padding="$4"
          >
            <Square size={100} bc="red" />
          </Sheet.Frame>
        </Sheet>
      </>
    </View>
  )
}

const AnimatedNumbers = () => {
  const [numbers, setNumbers] = useState(10_000)

  return (
    <>
      <Button onPress={() => setNumbers(Math.round(Math.random() * 10_000))}>Next</Button>

      <Stack importantForAccessibility="auto" />

      <AnimatePresence enterVariant="fromTop" exitVariant="toBottom">
        {`${numbers}`.split('').map((num, i) => {
          return <AnimatedNumber key={`${num}${i}`}>{num}2</AnimatedNumber>
        })}
      </AnimatePresence>
    </>
  )
}

const AnimatedNumber = styled(Text, {
  fontSize: 20,
  color: '$color',

  variants: {
    fromTop: {
      true: {
        y: -10,
        o: 0,
      },
    },

    toBottom: {
      true: {
        y: 10,
        o: 0,
      },
    },
  } as const,
})
