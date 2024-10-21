import { Menu } from '@tamagui/lucide-icons'
import * as React from 'react'
import {
  Adapt,
  Button,
  Circle,
  Popover,
  Sheet,
  XStack,
  YStack,
  isTouchable,
} from 'tamagui'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { OneBall } from '../brand/Logo'
import { DocsMenuContents } from '../docs/DocsMenuContents'
import { ScrollView } from './ScrollView'
import { useIsScrolled } from './useIsScrolled'
import { SocialLinksRow } from './SocialLinksRow'
import { View } from 'tamagui'
import { Link } from 'one'

export const HeaderMenu = React.memo(function HeaderMenu() {
  const { open, setOpen } = useDocsMenu()
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now(),
  })
  const isPressOpened = state.via === 'press' && open
  const isScrolled = useIsScrolled()

  return (
    <>
      <Popover
        disableRTL
        // Note: turning this on seems to break the HomeGlow (shockingly, maybe a React bug)
        // keepChildrenMounted
        hoverable={{
          delay: 50,
          restMs: 40,
          move: false,
        }}
        open={open}
        onOpenChange={(next, via) => {
          if (open && state.via === 'press' && via === 'hover') {
            return
          }
          setState({ ...state, via, viaAt: Date.now() })
          setOpen(next)
        }}
        size="$5"
        stayInFrame={{ padding: 20 }}
      >
        <Popover.Anchor asChild>
          <YStack
            zi={120_000}
            pe="auto"
            pos={'fixed' as any}
            t={42}
            r={20}
            $gtMd={{ dsp: !isScrolled ? 'none' : 'flex' }}
          >
            <Button
              size="$3"
              bg={isPressOpened ? '$color5' : 'transparent'}
              noTextWrap
              br="$10"
              bw={2}
              px="$2"
              onPress={() => {
                if (isTouchable) {
                  setOpen(!open)
                  return
                }
                if (open && state.via === 'hover') {
                  setState({ ...state, via: 'press', viaAt: Date.now() })
                  return
                }
                if (open) {
                  setOpen(false)
                  return
                }
                // hover handles this
              }}
              aria-label="Open the main menu"
              hoverStyle={{
                bg: isPressOpened ? '$color5' : 'transparent',
              }}
            >
              <Circle
                animation="medium"
                o={isScrolled ? 0 : 1}
                size={34}
                ai="center"
                jc="center"
              >
                <Menu color="$color11" size={20} />
              </Circle>

              <YStack
                pos="absolute"
                fullscreen
                animation="medium"
                o={isScrolled ? 1 : 0}
                x={8}
                y={0}
              >
                <OneBall />
              </YStack>
            </Button>
          </YStack>
        </Popover.Anchor>

        <Adapt platform="touch" when="sm">
          <Sheet
            zIndex={100000000}
            modal
            dismissOnSnapToBottom
            animation="bouncy"
            animationConfig={{
              type: 'spring',
              damping: 25,
              mass: 1.2,
              stiffness: 200,
            }}
          >
            <Sheet.Frame bg="$color5">
              <Sheet.ScrollView showsVerticalScrollIndicator={false} zi={1000}>
                <XStack group="card" containerType="normal" mt="$3" mb="$-2" px="$2">
                  <Link
                    style={{ marginBottom: -6, marginTop: 12, marginLeft: 26 }}
                    href="/"
                  >
                    <OneBall />
                  </Link>
                  <View flex={1} />
                  <SocialLinksRow />
                </XStack>

                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay zIndex={100} bg={'$background075'} />
          </Sheet>
        </Adapt>

        <HeaderMenuContent open={open} />
      </Popover>
    </>
  )
})

const HeaderMenuContent = React.memo(function HeaderMenuContent({
  open,
}: { open: boolean }) {
  return (
    <Popover.Content
      mt={-5}
      bw={0}
      bg="$color5"
      enterStyle={{ x: -10, o: 0 }}
      exitStyle={{ x: 10, o: 0 }}
      x={0}
      y={4}
      o={1}
      animation={[
        'quicker',
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      animateOnly={['transform', 'opacity']}
      p={0}
      maxHeight="80vh"
      maxWidth={360}
      minWidth={280}
      elevation="$10"
      shadowColor="#000"
      shadowOpacity={0.2}
      zIndex={100000000}
      trapFocus
      br="$6"
      {...{
        style: {
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <Popover.Arrow bg="$color5" size="$4" borderWidth={0} o={0.84} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, width: '100%' }}>
        <YStack aria-label="Home menu contents" w="100%" p="$4" ai="flex-end">
          <DocsMenuContents inMenu />
        </YStack>
      </ScrollView>
    </Popover.Content>
  )
})
