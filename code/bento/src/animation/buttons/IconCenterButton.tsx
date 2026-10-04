import { Check } from '../../icons'
import { useState } from 'react'
import type { LayoutRectangle } from 'react-native'
import { Button, View, isWeb } from 'tamagui'

/** ------ EXAMPLE ------ */
export function IconCenterButton() {
  const [move, setMove] = useState(false)
  const [buttonWidth, setWidth] = useState(100)
  const [iconDim, setIconDim] = useState<LayoutRectangle>()

  const iconScale = 1.8

  return (
    <View onLayout={(e: any) => setWidth(e.nativeEvent.layout.width)}>
      <Button
        size="md"
        onPress={() => {
          setMove(!move)
        }}
        overflow="hidden"
        {...(move && {
          theme: 'green',
        })}
      >
        <View
          transition="quick"
          x={
            move
              ? buttonWidth / 2 -
                (iconDim!.width * iconScale) / 2 -
                (isWeb ? 0 : iconDim!.x)
              : 0
          }
          scale={move ? iconScale : 1}
          onLayout={(e) => setIconDim(e.nativeEvent.layout)}
        >
          <Button.Icon>
            <Check />
          </Button.Icon>
        </View>
        <Button.Text
          transition="medium"
          x={move ? buttonWidth : 0}
          opacity={move ? 0 : 1}
        >
          Accept Terms
        </Button.Text>
      </Button>
    </View>
  )
}

IconCenterButton.fileName = 'IconCenterButton'
