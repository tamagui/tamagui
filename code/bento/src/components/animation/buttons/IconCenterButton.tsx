import { Check } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { LayoutRectangle } from 'react-native'
import { Button, Stack } from 'tamagui'

/** ------ EXAMPLE ------ */
export function IconCenterButton() {
  const [move, setMove] = useState(false)
  const [buttonWidth, setWidth] = useState(100)
  const [iconDim, setIconDim] = useState<LayoutRectangle>()

  const iconScale = 1.8

  return (
    <Button
      size="$4"
      onPress={() => {
        setMove(!move)
      }}
      overflow="hidden"
      {...(move && {
        theme: 'green',
      })}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <Stack
        animation="quick"
        x={move ? buttonWidth / 2 - iconDim!.width * iconScale : 0}
        scale={move ? iconScale : 1}
        onLayout={(e) => setIconDim(e.nativeEvent.layout)}
      >
        <Button.Icon>
          <Check />
        </Button.Icon>
      </Stack>
      <Button.Text animation="medium" x={move ? buttonWidth : 0} opacity={move ? 0 : 1}>
        Accept Terms
      </Button.Text>
    </Button>
  )
}

IconCenterButton.fileName = 'IconCenterButton'
