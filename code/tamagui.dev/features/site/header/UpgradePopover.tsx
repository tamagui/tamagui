import * as React from 'react'
import {
  type PopoverProps,
  Adapt,
  H2,
  H5,
  Paragraph,
  Popover,
  Sheet,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { PromoCards } from './PromoCards'
import { useSubscriptionModal } from '../purchase/useSubscriptionModal'
import { ThemeTintAlt } from '@tamagui/logo'

export const UpgradePopover = (props: PopoverProps) => {
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
      {/* <Theme name="pink"> */}
      <Popover.Anchor asChild="except-style">
        <XStack
          br="$10"
          px="$3"
          animation="medium"
          cur="pointer"
          height={36}
          ai="center"
          bw={1}
          bc="transparent"
          bg="$color5"
          shac="$shadow1"
          shadowRadius={3}
          shadowOffset={{ height: 2, width: 0 }}
          hoverStyle={{
            bc: '$color7',
            bg: '$color6',
          }}
          pressStyle={{
            bg: '$background02',
            bc: '$color2',
          }}
          onPress={() => {
            showAppropriateModal()
            setOpen(false)
          }}
        >
          <H2 ff="$mono" f={1} fow="600" size="$4">
            {isProUser ? 'Account' : 'Pro'}
          </H2>
        </XStack>
      </Popover.Anchor>
      {/* </Theme> */}

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
            <YStack gap="$3">
              <H5 pe="none" ff="$mono" size="$5" ta="center">
                Tamagui Pro
              </H5>

              <PromoCards less />

              <Paragraph
                bg="$color3"
                p="$4"
                br="$4"
                // theme="red"
                lh="$2"
                mb="$2"
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
            </YStack>
          </Popover.ScrollView>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
