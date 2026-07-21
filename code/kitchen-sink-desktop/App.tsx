import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Platform } from 'react-native'
import {
  Button,
  H1,
  Paragraph,
  ScrollView,
  TamaguiProvider,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { ComponentPlayground } from './src/ComponentPlayground'
import { DesktopInteractions } from './src/DesktopInteractions'
import { PortalPlayground } from './src/PortalPlayground'
import config from './tamagui.config'

type Playground = 'portals' | 'components' | 'desktop'

const playgrounds: Array<{ id: Playground; label: string; count: string }> = [
  { id: 'portals', label: 'Portal lab', count: '1 live · 9 gaps' },
  { id: 'components', label: 'Components', count: 'live state' },
  { id: 'desktop', label: 'Desktop events', count: '4 probes' },
]

export default function App() {
  const [playground, setPlayground] = useState<Playground>('portals')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Theme name={theme}>
        <YStack flex={1} bg="$background">
          <YStack
            position="absolute"
            inset={0}
            pointerEvents="none"
            opacity={0.55}
            overflow="hidden"
          >
            <YStack
              position="absolute"
              width={460}
              height={460}
              rounded={460}
              bg="$purple4"
              t={-260}
              r={-90}
            />
            <YStack
              position="absolute"
              width={360}
              height={360}
              rounded={360}
              bg="$orange3"
              b={-250}
              l={-140}
            />
          </YStack>

          <ScrollView contentContainerStyle={{ p: 28 }}>
            <YStack width="100%" maxW={1240} self="center" gap="$7" pb="$12">
              <XStack items="center" justify="space-between" gap="$4" flexWrap="wrap">
                <XStack items="center" gap="$3">
                  <BrandMark />
                  <YStack>
                    <Text fontFamily="$heading" fontWeight="900" fontSize="$6">
                      TAMAGUI
                    </Text>
                    <Text color="$color9" fontSize="$2" fontWeight="700">
                      NATIVE DESKTOP
                    </Text>
                  </YStack>
                </XStack>

                <XStack items="center" gap="$2">
                  <YStack
                    px="$3"
                    py="$2"
                    rounded="$10"
                    bg="$green3"
                    borderWidth={1}
                    borderColor="$green7"
                  >
                    <Text color="$green11" fontSize="$2" fontWeight="800">
                      ● PORTAL HOST READY
                    </Text>
                  </YStack>
                  <Button
                    size="$3"
                    circular
                    aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}
                    onPress={() =>
                      setTheme((value) => (value === 'light' ? 'dark' : 'light'))
                    }
                  >
                    {theme === 'light' ? '◐' : '◑'}
                  </Button>
                </XStack>
              </XStack>

              <YStack gap="$4" maxW={900}>
                <XStack gap="$2" items="center" flexWrap="wrap">
                  <Text
                    px="$3"
                    py="$1.5"
                    rounded="$10"
                    bg="$yellow5"
                    color="$yellow12"
                    fontSize="$2"
                    fontWeight="900"
                  >
                    {Platform.OS.toUpperCase()}
                  </Text>
                  <Text color="$color9" fontSize="$3" fontWeight="700">
                    Pointer · keyboard · focus · layering
                  </Text>
                </XStack>
                <H1
                  fontFamily="$heading"
                  color="$color12"
                  fontSize={54}
                  lineHeight={58}
                  letterSpacing={-2.5}
                >
                  A proper test bench for Tamagui on desktop.
                </H1>
                <Paragraph color="$color10" fontSize="$5" lineHeight="$7" maxW={820}>
                  Open, stack, dismiss, tab through, and right-click every surface. Each
                  specimen explains the desktop behavior it is meant to expose.
                </Paragraph>
              </YStack>

              <XStack
                gap="$2"
                p="$1.5"
                rounded="$6"
                bg="$color3"
                borderWidth={1}
                borderColor="$borderColor"
                self="flex-start"
                flexWrap="wrap"
              >
                {playgrounds.map((item) => {
                  const active = item.id === playground
                  return (
                    <Button
                      key={item.id}
                      size="$4"
                      chromeless={!active}
                      bg={active ? '$background' : 'transparent'}
                      borderWidth={active ? 1 : 0}
                      borderColor="$borderColor"
                      onPress={() => setPlayground(item.id)}
                      hoverStyle={{ bg: active ? '$backgroundHover' : '$color5' }}
                      pressStyle={{ scale: 0.98 }}
                      testID={`playground-${item.id}`}
                    >
                      <XStack gap="$2" items="center">
                        <Text fontWeight="800">{item.label}</Text>
                        <Text color="$color9" fontSize="$2">
                          {item.count}
                        </Text>
                      </XStack>
                    </Button>
                  )
                })}
              </XStack>

              {playground === 'portals' && <PortalPlayground />}
              {playground === 'components' && <ComponentPlayground />}
              {playground === 'desktop' && <DesktopInteractions />}
            </YStack>
          </ScrollView>

          <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
        </YStack>
      </Theme>
    </TamaguiProvider>
  )
}

function BrandMark() {
  return (
    <YStack
      width={44}
      height={44}
      rounded="$4"
      bg="$color12"
      items="center"
      justify="center"
      rotate="-5deg"
      shadowColor="$shadowColor"
      shadowOpacity={0.24}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 6 }}
    >
      <XStack gap={3} rotate="5deg">
        <YStack gap={3}>
          <YStack width={9} height={9} bg="$yellow8" rounded={2} />
          <YStack width={9} height={9} bg="$pink8" rounded={2} />
        </YStack>
        <YStack gap={3} mt={6}>
          <YStack width={9} height={9} bg="$orange8" rounded={2} />
          <YStack width={9} height={9} bg="$purple8" rounded={2} />
        </YStack>
      </XStack>
    </YStack>
  )
}
