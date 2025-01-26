import { Folder } from '@tamagui/lucide-icons'
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
    { theme: 'active' },
    { disabled: true, opacity: 0.5 },
    { themeInverse: true },
    { variant: 'outlined' },
    { chromeless: true },
  ] as const

  const sizeButtons = [
    { size: '$3' },
    {}, // default size
    { size: '$6' },
  ] as const

  return (
    <YStack gap="$4" $group-window-gtSm={{ flexDirection: 'row' }}>
      <View
        flexWrap="wrap"
        $xs={{
          flexDirection: 'row',
        }}
        gap="$4"
      >
        {colorThemes.map((theme) => (
          <Button key={theme} theme={theme} circular>
            <Button.Icon>
              <Folder />
            </Button.Icon>
          </Button>
        ))}
      </View>

      <View
        flexWrap="wrap"
        $xs={{
          flexDirection: 'row',
        }}
        gap="$4"
      >
        {variantButtons.map((props, index) => (
          <Button key={index} {...props} circular>
            <Button.Icon>
              <Folder />
            </Button.Icon>
          </Button>
        ))}
      </View>

      <View
        flexWrap="wrap"
        $xs={{
          flexDirection: 'row',
        }}
        gap="$4"
      >
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
