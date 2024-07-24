import { ArrowLeft, X } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import React, { memo, useEffect } from 'react'
import { Button, H4, PortalHost, ScrollView, Spacer, XStack, YStack } from 'tamagui'
import { SidePaneStore } from '../state/SidePaneStore'
// import { init, redo, sidePaneController, undo } from '../actions'

export const SidePane = ({
  title,
  children,
  controls,
}: {
  title?: string
  children: React.ReactNode
  controls?: React.ReactNode
}) => {
  return (
    <YStack
      f={1}
      // space for floating menu:
      mb="$14"
    >
      <XStack p="$8" pb="$4">
        <H4 size="$10">{title}</H4>
        <Spacer f={1} />
        {controls}
      </XStack>

      <YStack f={1}>
        <ScrollView horizontal={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} f={1}>
            <YStack p="$6" f={1}>
              {children}
            </YStack>
          </ScrollView>
        </ScrollView>
      </YStack>
    </YStack>
  )
}

export const SidePaneHost = memo(() => {
  const match = false //useMatch('/config')

  const sidePane = useStore(SidePaneStore)
  const visible = Boolean(!!match && sidePane.current)

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        sidePane.pop()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <>
      {/* backdrop */}
      <XStack
        zi={1000}
        fullscreen
        className="blur-behind transition ease-in 200ms"
        pe={visible ? 'auto' : 'none'}
        o={visible ? 1 : 0}
        data-tauri-drag-region
      />
      <XStack
        fullscreen
        animation="quick"
        left="15%"
        bg="$background"
        bc="$borderColor"
        blw={1}
        zIndex={10000}
        elevation="$8"
        x={20}
        o={0}
        pe="none"
        {...(visible && {
          o: 1,
          x: 1,
          pe: 'auto',
        })}
      >
        <Button
          l="$-4"
          t="$4"
          elevate
          borderWidth={2}
          borderColor="$borderColor"
          size="$4"
          zi={1000}
          circular
          icon={sidePane.panes.length > 1 ? ArrowLeft : X}
          pos="absolute"
          onPress={() => {
            sidePane.pop()
          }}
        />

        <PortalHost name="studio-side-pane" />
      </XStack>
    </>
  )
})
