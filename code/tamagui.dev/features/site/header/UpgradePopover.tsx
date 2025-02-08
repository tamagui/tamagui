import {
  Box,
  DoorClosed,
  Dot,
  Lock,
  LockKeyhole,
  MessageCircle,
  PaintBucket,
} from '@tamagui/lucide-icons'
import type { Href } from 'one'
import { Link } from 'one'
import * as React from 'react'
import {
  type PopoverProps,
  Adapt,
  H2,
  H5,
  isTouchable,
  Paragraph,
  Popover,
  styled,
  XStack,
  YStack,
} from 'tamagui'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { Sheet } from 'tamagui'
import { purchaseModal } from '../purchase/NewPurchaseModal'

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
          px="$2"
          height={44}
          ai="center"
          bw={1}
          bc="transparent"
          hoverStyle={{
            bc: '$color02',
          }}
          onPress={() => {
            purchaseModal.show = true
            setOpen(false)
            // hover handles this
          }}
        >
          <YStack cur="pointer" f={1} ai="center" px="$3" ov="hidden">
            <H2
              ff="$silkscreen"
              f={1}
              fow="600"
              size="$7"
              style={{
                fontFamily: '"PP Supply Mono"',
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 0,
              }}
            >
              {/* <Ellipsis /> */}
              Pro
            </H2>
          </YStack>
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
              <Paragraph
                bg="$color2"
                p="$4"
                br="$4"
                theme="green"
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
                Pro is how we fund the independent development of Tamagui.
              </Paragraph>
              <PromoCards />
            </YStack>
          </Popover.ScrollView>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

export const PromoCards = () => {
  return (
    <>
      <Card>
        <TooltipLabelLarge
          href="/bento"
          icon={
            <YStack y={-2}>
              <MessageCircle />
            </YStack>
          }
          title="Chat"
          subtitle="A new AI chat agent that's an expert in Tamagui."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          icon={<TakeoutIcon />}
          href="/takeout"
          title="Takeout"
          subtitle="Starter kit for making universal apps fast."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          href="/bento"
          icon={
            <YStack y={-2}>
              <BentoIcon />
            </YStack>
          }
          title="Bento"
          subtitle="OSS and paid copy-paste components and screens."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          href="/theme"
          icon={<PaintBucket />}
          title="Theme"
          subtitle="Use our AI designed to generate great theme suites."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          href="/theme"
          icon={<Box />}
          title="Assets"
          subtitle="Scripts to easily add fonts and icon packs."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          href="/theme"
          icon={<DoorClosed />}
          title="Access"
          subtitle="Early access to new features."
        />
      </Card>
    </>
  )
}

const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
  href,
}: { href: string; icon: any; title: string; subtitle: string }) => {
  return (
    <Link asChild href={href as Href}>
      <YStack cur="pointer" f={1} p="$3" br="$4" gap="$2">
        <XStack ai="center" gap="$2">
          <YStack scale={0.7}>{icon}</YStack>
          <H2 ff="$mono" f={1} fow="600" size="$5" ls={1}>
            {title}
          </H2>
        </XStack>

        <Paragraph px="$2" theme="alt1" f={1} size="$4" lh="$2">
          {subtitle}
        </Paragraph>
      </YStack>
    </Link>
  )
}

const Card = styled(YStack, {
  maxHeight: 120,
  maxWidth: 'calc(min(100%, 257px))',
  flex: 1,
  br: '$4',
  borderWidth: 0.5,
  borderColor: '$color4',
})

const Frame = styled(YStack, {
  animation: 'medium',
  br: '$5',
  ov: 'hidden',
  fullscreen: true,
  zIndex: 1,
  x: 0,
  opacity: 1,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 20 : -20,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 20 : -20,
          opacity: 0,
        },
      }),
    },
  } as const,
})
