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
import { sendEvent } from '../../analytics/sendEvent'
import { useSubscriptionModal } from '../purchase/useSubscriptionModal'
import { PromoCards } from './PromoCards'

export const UpgradeToProPopover = (props: PopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now(),
  })
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro

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
          rounded="$10"
          px="$3"
          cursor="pointer"
          height={36}
          items="center"
          borderWidth={1}
          borderColor="$black5"
          bg="$black1"
          shadowColor="$shadow1"
          shadowRadius={3}
          shadowOffset={{ height: 4, width: 0 }}
          hoverStyle={{
            borderColor: '$black6',
            bg: '$black3',
          }}
          pressStyle={{
            bg: '$black2',
            borderColor: '$black2',
          }}
          onPress={() => {
            sendEvent(`Pro: Modal Open`)
            showAppropriateModal()
            setOpen(false)
          }}
        >
          <H2 fontFamily="$mono" flex={1} fontWeight="600" size="$4" color="$black12">
            Pro
          </H2>
        </XStack>
      </Popover.Anchor>

      <Adapt platform="touch" when="maxMd">
        <Sheet zIndex={100000000} modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay z={100} bg="$shadow4" />
        </Sheet>
      </Adapt>

      <Popover.Content
        animatePosition
        transition="quick"
        bg="$background08"
        backdropFilter="blur(40px)"
        shadowRadius={50}
        shadowColor="$shadow4"
        shadowOffset={{ height: 30, width: 0 }}
        p={0}
        rounded="$6"
        borderWidth={0}
        z={10000}
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

        <YStack maxH="90vh" p="$3" width={280} overflow="hidden" rounded="$6">
          <Popover.ScrollView>
            <YStack gap="$2">
              {!isProUser && (
                <H5
                  py="$2"
                  pointerEvents="none"
                  fontFamily="$mono"
                  size="$5"
                  text="center"
                >
                  Tamagui Pro
                </H5>
              )}

              <PromoCards less />

              {!isProUser && (
                <Theme name="accent">
                  <Button
                    rounded="$10"
                    my="$3"
                    onPress={() => {
                      showAppropriateModal()
                      setOpen(false)
                    }}
                  >
                    <Button.Text fontFamily="$mono">More info</Button.Text>
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
