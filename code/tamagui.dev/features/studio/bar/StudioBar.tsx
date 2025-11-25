import { LogoIcon } from '@tamagui/logo'
import { Moon, Sun, X } from '@tamagui/lucide-icons'
import { memo } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  PortalHost,
  SizableText,
  Switch,
  XStack,
  YStack,
} from 'tamagui'

import { topBarHeight } from '~/features/studio/constants'
import { useRootStore } from '../state/useGlobalState'
import { BarTabs } from './Tabs'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { usePathname, useRouter } from 'one'

export const StudioBar = memo(function Header() {
  const themeBuilderStore = useThemeBuilderStore()

  return (
    <XStack
      height={topBarHeight}
      z={100_000}
      justify="space-between"
      data-tauri-drag-region
      position={'fixed' as any}
      self="center"
      elevation="$2"
      items="center"
      px="$5"
      rounded="$10"
      overflow="hidden"
      gap="$3"
      {...(themeBuilderStore.isCentered
        ? {
            mx: 'auto',
            left: 0,
            right: 0,
            b: '$2.5',
          }
        : {
            right: '$2',
            top: '$2',
          })}
      maxW={192}
      className="all ease-in-out ms300"
    >
      <YStack rounded="$10" fullscreen className="blur-medium" />
      <YStack
        rounded="$10"
        fullscreen
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
      />
      <XStack mr="$2">
        <LogoIcon downscale={2.5} />
      </XStack>

      <PortalHost name="studio-header" />
    </XStack>
  )
})

export const ThemeSwitch = memo(() => {
  const rootStore = useRootStore()
  const themeBuilderStore = useThemeBuilderStore()

  const tip = themeBuilderStore.themeSwitchTip
  const tipOpen = themeBuilderStore.themeSwitchOpen && !!themeBuilderStore.themeSwitchTip
  const isLight = rootStore.theme === 'light'

  return (
    <Popover open={tipOpen} stayInFrame={{ padding: 10 }} size="$3">
      <Popover.Trigger>
        <XStack mx="$2" items="center">
          <Switch
            checked={isLight}
            size="$2"
            y={0.5}
            onCheckedChange={(light) => {
              if (themeBuilderStore.schemes.dark && themeBuilderStore.schemes.light) {
                rootStore.theme = light ? 'light' : 'dark'
                themeBuilderStore.themeSwitchOpen = false
              }
            }}
          >
            <XStack fullscreen z={100} x={2} y={0.5}>
              {isLight && (
                <Button
                  tag="span"
                
                  disabled
                  chromeless
                  size="$1"
                  scaleIcon={1}
                  opacity={0.44}
                  x={-1.5}
                  y={-1.5}
                  icon={<Moon color='$color' />}
                />
              )}
            </XStack>

            <XStack position="absolute" t={0} r={0} z={100} x={1} y={0}>
              {!isLight && (
                <Button
                  tag="span"
            
                  disabled
                  chromeless
                  size="$1"
                  scaleIcon={1}
                  opacity={0.25}
                  x={-1.5}
                  y={-1.5}
                  icon={<Sun color='$color' />}
                />
              )}
            </XStack>

            <Switch.Thumb animation="quickest">
              <YStack items="center">
                {isLight && (
                  <Button
                    tag="span"
                    disabled
                    chromeless
                    size="$1"
                    scaleIcon={1.2}
                    opacity={0.8}
                    y={-0.75}
                    icon={<Sun color='$background' />}
                  />
                )}
                {!isLight && (
                  <Button
                    tag="span"
                    disabled
                    chromeless
                    size="$1"
                    scaleIcon={1.2}
                    opacity={0.5}
                    y={-0.75}
                    icon={<Moon color='$background' />}
                  />
                )}
              </YStack>
            </Switch.Thumb>
          </Switch>
        </XStack>
      </Popover.Trigger>

      <Popover.Content
        theme="yellow"
        trapFocus={false}
        borderWidth={2}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quickest',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow size="$5" borderWidth={2} borderColor="$borderColor" />

        <Paragraph size="$2">{tip}</Paragraph>
        <Button
          size="$1"
          circular
          position="absolute"
          t="$-2"
          r="$-2"
          icon={X}
          onPress={() => {
            themeBuilderStore.themeSwitchOpen = false
          }}
        ></Button>
      </Popover.Content>
    </Popover>
  )
})

const StudioTabs = memo(function StudioTabs() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <BarTabs
      currentTab={pathname.split('/').pop() as string}
      onTabChange={(val) => router.push(val)}
      tabs={[
        {
          component: (
            <SizableText size="$2" fontWeight="500">
              Theme Studio
            </SizableText>
          ),
          value: 'builder',
          hasChanges: false,
        },
        {
          component: (
            <SizableText size="$2" fontWeight="500">
              Config
            </SizableText>
          ),
          value: 'config',
          hasChanges: false,
        },

        {
          component: (
            <SizableText size="$2" fontWeight="500">
              Themes
            </SizableText>
          ),
          value: 'themes',
          hasChanges: false,
        },
      ]}
    />
  )
})
