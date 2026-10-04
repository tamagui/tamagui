import { Folder } from '../../icons'
import { Button, View, YStack } from 'tamagui'

/** ------ EXAMPLE ------ */
export function RoundedButtons() {
  const colorThemes = [
    'blue',
    'red',
    'green',
    'purple',
    'pink',
    'yellow',
    'orange',
  ] as const

  const variantButtons = [
    { theme: undefined, inverse: false },
    { disabled: true, opacity: 0.5, inverse: false },
    { inverse: true },
    { variant: 'outlined', inverse: false },
    { variant: 'quiet', inverse: false },
  ] as const

  const sizeButtons = [
    { size: '3' },
    {}, // default size
    { size: '6' },
  ] as const

  return (
    <YStack gap="4" flexDirection="@md/window:row">
      <View flexWrap="wrap" flexDirection="max-sm:row" gap="4">
        {colorThemes.map((theme) => (
          <Button key={theme} theme={theme} circular>
            <Button.Icon>
              <Folder />
            </Button.Icon>
          </Button>
        ))}
      </View>

      <View flexWrap="wrap" flexDirection="max-sm:row" gap="4">
        {variantButtons.map(({ inverse, ...props }, index) => (
          <Button key={index} theme={inverse ? 'accent' : undefined} {...props} circular>
            <Button.Icon>
              <Folder />
            </Button.Icon>
          </Button>
        ))}
      </View>

      <View flexWrap="wrap" flexDirection="max-sm:row" gap="4">
        {sizeButtons.map((props, index) => (
          <Button key={index} {...props} circular>
            <Button.Icon>
              <Folder />
            </Button.Icon>
          </Button>
        ))}
      </View>
    </YStack>
  )
}

RoundedButtons.fileName = 'RoundedButtons'
