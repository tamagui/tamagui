import { ArrowLeft, X } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import type React from 'react'
import { memo, useEffect } from 'react'
import { Button, H4, PortalHost, ScrollView, Spacer, XStack, YStack } from 'tamagui'
import { SidePaneStore } from '../state/SidePaneStore'

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
      flex={1}
      // space for floating menu:
      mb="$14"
    >
      <XStack p="$8" pb="$4">
        <H4 size="$10">{title}</H4>
        <Spacer flex={1} />
        {controls}
      </XStack>

      <YStack flex={1}>
        <ScrollView horizontal={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} flex={1}>
            <YStack p="$6" flex={1}>
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
        z={1000}
        fullscreen
        className="blur-behind transition ease-in 200ms"
        pointerEvents={visible ? 'auto' : 'none'}
        opacity={visible ? 1 : 0}
        data-tauri-drag-region
      />
      <XStack
        fullscreen
        transition="quick"
        l="15%"
        bg="$background"
        borderColor="$borderColor"
        borderLeftWidth={1}
        z={10000}
        elevation="$8"
        x={20}
        opacity={0}
        pointerEvents="none"
        {...(visible && {
          opacity: 1,
          x: 1,
          pointerEvents: 'auto',
        })}
      >
        <Button
          l="$-4"
          t="$4"
          elevation="$2"
          borderWidth={2}
          borderColor="$borderColor"
          size="$4"
          z={1000}
          circular
          icon={sidePane.panes.length > 1 ? ArrowLeft : X}
          position="absolute"
          onPress={() => {
            sidePane.pop()
          }}
        />

        <PortalHost name="studio-side-pane" />
      </XStack>
    </>
  )
})
