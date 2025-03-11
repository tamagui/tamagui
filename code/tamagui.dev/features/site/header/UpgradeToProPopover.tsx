import * as React from 'react'
import {
  type PopoverProps,
  Adapt,
  Button,
  H2,
  H5,
  Paragraph,
  Popover,
  Sheet,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { useSubscriptionModal } from '../purchase/useSubscriptionModal'
import { PromoCards } from './PromoCards'

export const UpgradeToProPopover = (props: PopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now(),
  })
  const { showAppropriateModal, isProUser } = useSubscriptionModal()

  return (
    <Popover
      disableRTL
      offset={20}
      hoverable={{
        delay: 200,
        restMs: 340,
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
      {...props}
    >
      <Popover.Anchor asChild="except-style">
        <XStack
          br="$10"
          px="$3"
          animation="medium"
          cur="pointer"
          height={36}
          ai="center"
          bw={1}
          bc="$black5"
          bg="$black1"
          shac="$shadow1"
          shadowRadius={3}
          shadowOffset={{ height: 4, width: 0 }}
          hoverStyle={{
            bc: '$black7',
            bg: '$black6',
          }}
          pressStyle={{
            bg: '$black2',
            bc: '$black2',
          }}
          onPress={() => {
            showAppropriateModal()
            setOpen(false)
          }}
        >
          <H2 ff="$mono" f={1} fow="600" size="$4" color="$black12">
            Pro
          </H2>
        </XStack>
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
          <Sheet.Overlay zIndex={100} bg="$shadow4" />
        </Sheet>
      </Adapt>

      <Popover.Content
        enableAnimationForPositionChange
        animation="quick"
        bg="$background08"
        backdropFilter="blur(40px)"
        shadowRadius={50}
        shadowColor="$shadow4"
        shadowOffset={{ height: 30, width: 0 }}
        padding={0}
        br="$6"
        borderWidth={0}
        enterStyle={{
          y: 3,
          opacity: 0,
        }}
        exitStyle={{
          y: 5,
          opacity: 0,
        }}
      >
        <Popover.Arrow bg="$background08" size="$4" />

        <YStack mah="80vh" p="$3" width={280} ov="hidden" br="$6">
          <Popover.ScrollView>
            <YStack gap="$2">
              {!isProUser && (
                <H5 py="$2" pe="none" ff="$mono" size="$5" ta="center">
                  Tamagui Pro
                </H5>
              )}

              {!isProUser && (
                <Paragraph
                  bg="$color3"
                  p="$4"
                  br="$4"
                  // theme="red"
                  lh="$2"
                  color="$color11"
                  bw={0.5}
                  bc="$color3"
                  cur="pointer"
                  animation="lazy"
                  hoverStyle={{
                    y: -2,
                    color: '$color12',
                  }}
                  pressStyle={{
                    animation: '100ms',
                    y: -2,
                  }}
                  onPress={() => {
                    showAppropriateModal()
                    setOpen(false)
                  }}
                >
                  Pro is how we fund the OSS development of Tamagui.
                </Paragraph>
              )}

              <PromoCards less />

              {!isProUser && (
                <Theme name="accent">
                  <Button
                    br="$10"
                    my="$3"
                    fontFamily="$mono"
                    onPress={() => {
                      showAppropriateModal()
                      setOpen(false)
                    }}
                  >
                    More info
                  </Button>
                </Theme>
              )}
            </YStack>
          </Popover.ScrollView>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
