import { ChevronLeft, ChevronRight, Lock, Monitor } from '@tamagui/feather-icons'
import { memo, useEffect, useState } from 'react'
import { Circle, Image, Paragraph, Spacer, Theme, VisuallyHidden, XStack, YStack } from 'tamagui'

import favicon from '../public/favicon.svg'
import { ContainerLarge } from './Container'
import { HomeH2 } from './HomeH2'
import { IconStack } from './IconStack'

export const HeroResponsive = memo(() => {
  const [isDragging, setIsDragging] = useState(false)
  const [width, setWidth] = useState(70)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      console.log(e.pageX)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <ContainerLarge>
      <YStack>
        <Header />

        <Spacer size="$6" />

        <XStack f={1} w={`${width}%`} space>
          <Safari />

          <YStack
            jc="center"
            f={1}
            cursor="ew-resize"
            onPress={() => {
              setIsDragging(true)
            }}
            onPressOut={() => {
              setIsDragging(false)
            }}
          >
            <YStack
              bc="$color"
              opacity={0.35}
              hoverStyle={{ opacity: 0.4 }}
              br="$8"
              w={8}
              height={34}
            />
          </YStack>
        </XStack>
      </YStack>
    </ContainerLarge>
  )
})

const Header = memo(() => {
  return (
    <XStack f={1} ov="hidden">
      <XStack $sm={{ display: 'none' }}>
        <IconStack theme="purple_alt2" p="$4">
          <Monitor />
        </IconStack>
        <Spacer size="$6" />
      </XStack>

      <YStack f={1} mt={-10} space="$2">
        <HomeH2 als="flex-start">Responsive, everywhere</HomeH2>
        <Paragraph maxWidth={580} size="$5" theme="alt2">
          React Native Web apps resize slowly as every component runs expensive JS on the main
          thread.
        </Paragraph>

        <Paragraph maxWidth={580} size="$5" theme="alt2">
          Tamagui compiles inline responsive styles into CSS Media Queries on the web, or hoists to
          StyleSheet.create on native for dramatically easier, faster, and lighter responsive
          styling.
        </Paragraph>
      </YStack>
    </XStack>
  )
})

const height = 400

const Safari = memo(() => {
  return (
    <YStack f={1} ov="hidden" elevation="$1" br="$3" boc="$borderColor" borderWidth={1}>
      <YStack
        px="$4"
        jc="center"
        btrr="$2"
        btlr="$2"
        borderBottomWidth={0}
        h={50}
        bc="$backgroundHover"
      >
        <XStack pos="relative" ai="center" space="$4">
          <XStack space="$2">
            <Circle bc="$red10" size={10} />
            <Circle bc="$yellow10" size={10} />
            <Circle bc="$green10" size={10} />
          </XStack>

          <XStack space="$1">
            <ChevronLeft size={20} color="var(--colorPress)" />
            <ChevronRight size={20} color="var(--colorPress)" />
          </XStack>

          <XStack fullscreen ai="center">
            <XStack f={1} />
            {/* @ts-ignore */}
            <XStack
              h={30}
              f={2}
              br="$1"
              borderWidth={1}
              boc="$borderColor"
              bc="$backgroundPress"
              ai="center"
              px="$2"
              jc="center"
              space
            >
              <Lock color="var(--colorPress)" size={12} />
              <Paragraph theme="alt1" size="$2">
                tamagui.dev
              </Paragraph>
            </XStack>
            <XStack f={1} />
          </XStack>
        </XStack>
      </YStack>

      <XStack bbw={1} boc="$borderColor">
        <Tab btlr={0}>Tamagui - React Native & Web UI kits</Tab>
        <Tab active>Tamagui - React Native & Web UI kits</Tab>
        <Tab btrr={0}>Tamagui - React Native & Web UI kits</Tab>
      </XStack>

      <YStack bc="$backgroundHover" h={height}>
        <BrowserPane />
      </YStack>
    </YStack>
  )
})

const Tab = memo(({ active, children, ...props }: any) => {
  return (
    <Theme name={active ? null : 'alt3'}>
      <XStack
        btw={1}
        boc={active ? 'transparent' : '$borderColor'}
        blw={1}
        brw={1}
        btlr={active ? 0 : 4}
        btrr={active ? 0 : 4}
        bc="$backgroundHover"
        ov="hidden"
        f={1}
        py="$1"
        px="$2"
        ai="center"
        {...props}
      >
        <Image width={16} height={16} src={favicon} />
        <Spacer size="$2" />
        <Paragraph cursor="default" size="$3" ellipse>
          {children}
        </Paragraph>
      </XStack>
    </Theme>
  )
})

const BrowserPane = memo(() => {
  return (
    <YStack>
      <iframe width="100%" height={height} src="/responsive-demo" />
    </YStack>
  )
})
