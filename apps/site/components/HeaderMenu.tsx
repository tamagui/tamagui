import { Menu } from '@tamagui/lucide-icons'
import * as React from 'react'
import {
  Adapt,
  Button,
  Popover,
  Sheet,
  SizableText,
  Spacer,
  XStack,
  YStack,
  isTouchable,
} from 'tamagui'

import { DocsMenuContents } from './DocsMenuContents'
import { HeaderLinks } from './HeaderLinks'
import { useDocsMenu } from './useDocsMenu'
import { ThemeTintAlt } from '@tamagui/logo'
import { Avatar } from 'tamagui'
import { useUser } from '../hooks/useUser'
import { getDefaultAvatarImage } from '../lib/avatar'

export const HeaderMenu = React.memo(function HeaderMenu() {
  const { open, setOpen } = useDocsMenu()
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now()
  })
  const userSwr = useUser()

  return (
    <ThemeTintAlt>
      <Popover
        keepChildrenMounted
        hoverable={{
          delay: 50,
          restMs: 40,
          move: false
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
          <Button
            size="$3"
            ml="$2"
            bc="transparent"
            noTextWrap
            br="$10"
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
            theme={open ? 'alt1' : undefined}
            aria-label="Open the main menu"
          >
            {userSwr.data?.userDetails ? (
              <Avatar circular size="$2">
                <Avatar.Image
                  source={{
                    width: 28,
                    height: 28,
                    uri:
                      userSwr.data.userDetails?.avatar_url ||
                      getDefaultAvatarImage(
                        userSwr.data?.userDetails?.full_name ||
                          userSwr.data?.session?.user?.email ||
                          'User'
                      ),
                  }}
                />
              </Avatar>
            ) : (
              <Menu size={16} />
            )}
            <SizableText ff="$silkscreen">Menu</SizableText>
          </Button>
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
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay zIndex={100} />
          </Sheet>
        </Adapt>

        <HeaderMenuContent />
      </Popover>
    </ThemeTintAlt>
  )
})

const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  return (
    <Popover.Content
      mt={-5}
      bw={1}
      boc="$borderColor"
      enterStyle={{ x: -10, o: 0 }}
      exitStyle={{ x: 10, o: 0 }}
      x={0}
      y={0}
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
      elevation="$12"
      zIndex={100000000}
      trapFocus
      br="$6"
    >
      <Popover.Arrow size="$4" borderWidth={1} boc="$borderColor" />

      <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <YStack aria-label="Home menu contents" miw={230} p="$3" ai="flex-end">
          <XStack fw="wrap" f={1} gap="$2">
            <HeaderLinks forceShowAllLinks />
          </XStack>

          <Spacer size="$3" />

          <DocsMenuContents />
        </YStack>
      </Popover.ScrollView>
    </Popover.Content>
  )
})
