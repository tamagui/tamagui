import { View } from '@tamagui/core'
import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSchemeSetting } from '@vxrn/color-scheme'
import { Appearance } from 'react-native'
import { isWeb, Paragraph, YStack } from 'tamagui'

const schemeSettings = ['light', 'dark', 'system'] as const

export function ToggleThemeButton() {
  const { onPress, Icon, setting } = useToggleTheme()

  return (
    <View group ai="center" containerType="normal" gap="$1">
      <View
        p="$3"
        br="$10"
        hoverStyle={{
          bg: '$color2',
        }}
        pressStyle={{
          bg: '$color1',
        }}
        pointerEvents="auto"
        cur="pointer"
        onPress={onPress}
      >
        <Icon size={24} color="$color13" />
      </View>

      <YStack>
        <Paragraph
          animation="100ms"
          size="$1"
          mb={-20}
          color="$color10"
          o={0}
          $group-hover={{
            o: 1,
          }}
        >
          {setting[0].toUpperCase()}
          {setting.slice(1)}
        </Paragraph>
      </YStack>
    </View>
  )
}

export function useToggleTheme() {
  const [{ setting, scheme }, setSchemeSetting] = useSchemeSetting()
  const Icon = setting === 'system' ? SunMoon : setting === 'dark' ? Moon : Sun

  return {
    setting,
    scheme,
    Icon,
    onPress: () => {
      const next = schemeSettings[(schemeSettings.indexOf(setting) + 1) % 3]

      if (!isWeb) {
        Appearance.setColorScheme(next === 'system' ? scheme : next)
      }

      setSchemeSetting(next)
    },
  }
}
