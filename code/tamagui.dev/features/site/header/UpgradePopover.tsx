import * as React from 'react'
import {
  type PopoverProps,
  Adapt,
  H2,
  H5,
  Paragraph,
  Popover,
  Sheet,
  XStack,
  YStack,
} from 'tamagui'
import { purchaseModal } from '../purchase/NewPurchaseModal'
import { PromoCards } from './PromoCards'

export const UpgradePopover = (props: PopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now(),
  })

  return (
    <Popover
      disableRTL
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
      <Popover.Anchor asChild>
        <XStack
          br="$10"
          px="$4"
          animation="quick"
          cur="pointer"
          height={44}
          ai="center"
          bw={1}
          bc="transparent"
          hoverStyle={{
            bc: '$color02',
          }}
          pressStyle={{
            bg: '$background02',
            bc: '$color04',
          }}
          onPress={() => {
            purchaseModal.show = true
            setOpen(false)
            // hover handles this
          }}
        >
          <H2 ff="$mono" f={1} fow="600" size="$5">
            Start
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
        <Popover.Arrow bg="$background08" size="$3.5" />

        <YStack mah="80vh" p="$3" width={280} ov="hidden" br="$6">
          <Popover.ScrollView>
            <YStack gap="$2">
              <H5 ta="center">Tamagui Start</H5>
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
                  purchaseModal.show = true
                  setOpen(false)
                }}
              >
                Start is how we fund the OSS development of Tamagui.
              </Paragraph>
            </YStack>
          </Popover.ScrollView>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
