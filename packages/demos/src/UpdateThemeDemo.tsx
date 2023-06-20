import * as Config from '@tamagui/config'
import { addTheme, updateTheme } from '@tamagui/theme'
import React, { useState } from 'react'
import {
  Adapt,
  Button,
  Popover,
  Square,
  Theme,
  XStack,
  YStack,
  getVariableValue,
  useForceUpdate,
  useIsomorphicLayoutEffect,
} from 'tamagui'

const colors = Config.config.tokens.color
const colorKeys = Object.keys(colors)

export function UpdateThemeDemo() {
  const [theme, setTheme] = useState<any>()
  const update = useForceUpdate()

  useIsomorphicLayoutEffect(() => {
    addTheme({
      name: 'custom',
      insertCSS: true,
      theme: {
        color: 'red',
        color2: 'blue',
      },
    })
    setTheme('custom')
  }, [])

  return (
    <YStack alignItems="center" space>
      <XStack gap={'$5'}>
        <Theme name={theme ?? null}>
          <Square borderRadius="$8" size={100} backgroundColor="$color" />
        </Theme>
      </XStack>

      <Button
        onPress={() => {
          const randomColor = getVariableValue(
            colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]]
          )
          updateTheme({
            name: 'custom',
            theme: {
              color: randomColor,
            },
          })
          update()
        }}
      >
        Set to random color
      </Button>

      <Popover size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>Set a specific Color</Button>
        </Popover.Trigger>

        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay />
          </Popover.Sheet>
        </Adapt>

        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ x: 0, y: -10, opacity: 0 }}
          exitStyle={{ x: 0, y: -10, opacity: 0 }}
          x={0}
          y={0}
          opacity={1}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          elevate
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
          <Popover.ScrollView>
            <XStack flexWrap="wrap" gap={'$1.5'} flexBasis={10}>
              {Object.values(colors).map((color) => (
                <Popover.Close key={color.key} asChild>
                  <Button
                    size={'$3'}
                    backgroundColor={color.val}
                    onPress={() => {
                      updateTheme({
                        name: 'custom',
                        theme: {
                          color: color.val,
                        },
                      })
                      update()
                    }}
                  />
                </Popover.Close>
              ))}
            </XStack>
          </Popover.ScrollView>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
