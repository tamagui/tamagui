import { MoonStar, Sun } from '../../icons'
import { useEffect, useId, useState } from 'react'
import type { SizeTokens } from 'tamagui'
import { AnimatePresence, getVariableValue, View, YStack } from 'tamagui'
import { Switch } from './common/switchParts'

import { getSize } from '@tamagui/get-token'
import { useUserScheme } from '@vxrn/color-scheme'

export function ThemeSwitch({ size = '8' }: { size?: SizeTokens }) {
  const uniqueId = useId()
  const [checked, setChecked] = useState(false)

  // do not use this code. only use in showcase
  const userScheme = useUserScheme()

  useEffect(() => {
    setChecked(userScheme.value === 'dark')
  }, [userScheme.value])

  const thumbSize = getVariableValue(getSize(size))

  const larger = thumbSize >= 64

  const iconSize = thumbSize * 0.4

  return (
    <Switch
      id={uniqueId + 'switch'}
      checked={checked}
      onCheckedChange={(checked) => {
        userScheme.set(checked ? 'dark' : 'light')
      }}
      size={size}
      backgroundColor="background"
      justify="center"
      items="center"
      cursor="pointer"
      borderWidth={2}
      borderColor="transparent"
      position="relative"
    >
      {/* switch background */}
      {larger ? <SwitchBackground checked={checked} /> : null}
      <Switch.Thumb transition="medium" bg="transparent">
        <View
          boxShadow="18px 0 18px shadow-color"
          m="1"
          flex={1}
          overflow="hidden"
          rounded="10"
          items="center"
          justify="center"
          bg="color-4"
          transition="200ms"
        >
          <AnimatePresence mode="wait" custom={{ direction: -1 }}>
            <YStack
              position="absolute"
              key="Sun"
              transition="medium"
              inset={0}
              items="center"
              justify="center"
              opacity={checked ? 0 : 1}
              transform={[
                { scale: !checked ? 1 : 0 },
                { translateY: !checked ? 0 : thumbSize },
              ]}
            >
              <Sun size={iconSize} fill={'white'} color="white" />
            </YStack>

            <YStack
              position="absolute"
              transition="medium"
              key="moon"
              inset={0}
              items="center"
              justify="center"
              transform={[
                { scale: checked ? 1 : 0 },
                { translateY: checked ? 0 : -thumbSize },
                { rotate: checked ? '0deg' : '-90deg' },
              ]}
            >
              <MoonStar color={'white'} fill={'white'} size={iconSize} />
            </YStack>
          </AnimatePresence>
        </View>
      </Switch.Thumb>
    </Switch>
  )
}

const SwitchBackground = ({ checked }: { checked: boolean }) => {
  return (
    <View
      key="background"
      width="50%"
      r={checked ? '50%' : 0}
      height="100%"
      justify="center"
      items="center"
      transition="200ms"
      position="absolute"
      t={0}
      b={0}
    >
      <View
        t={'20%'}
        transition="200ms"
        l={checked ? '55%' : 0}
        position="absolute"
        bg="color-6"
        width={checked ? 4 : 30}
        height={checked ? 4 : 5}
        rounded="10"
      />
      <View
        t={checked ? '33%' : '45%'}
        l="28%"
        transition="200ms"
        position="absolute"
        bg="color-6"
        width={checked ? 3 : 22}
        height={checked ? 3 : 5}
        rounded="10"
      />
      <View
        t={'70%'}
        l={checked ? '30%' : 0}
        transition="200ms"
        position="absolute"
        bg="color-6"
        width={checked ? 4 : 15}
        height={checked ? 4 : 5}
        rounded="10"
      />

      {checked ? (
        <>
          <View
            b={'35%'}
            r="35%"
            position="absolute"
            bg="color-6"
            width={4}
            height={4}
            rounded="10"
            transition="200ms"
          />
          <View
            t={'50%'}
            r="10%"
            position="absolute"
            bg="color-6"
            width={3}
            height={3}
            rounded="10"
            transition="200ms"
          />
        </>
      ) : null}
    </View>
  )
}

ThemeSwitch.fileName = 'ThemeSwitch'

ThemeSwitch.title = 'Theme Switch'
