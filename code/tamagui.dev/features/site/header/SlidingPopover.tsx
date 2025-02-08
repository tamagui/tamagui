import { ThemeTintAlt } from '@tamagui/logo'
import { Dot, Paintbrush } from '@tamagui/lucide-icons'
import { createShallowSetState } from '@tamagui/web'
import type { Href } from 'one'
import { Link } from 'one'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import {
  type PopoverProps,
  AnimatePresence,
  debounce,
  H2,
  H5,
  Paragraph,
  Popover,
  styled,
  Theme,
  useComposedRefs,
  YStack,
} from 'tamagui'
import { BentoPageFrame } from '../../bento/BentoPageFrame'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { CTAHeaderLink } from './CTAHeaderLink'

const StudioIcon = () => (
  <YStack h={24} w={24} mx={-4} y={-0.5}>
    <Paintbrush />
  </YStack>
)

const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
  href,
}: { href: string; icon: any; title: string; subtitle: string }) => {
  return (
    <Link asChild href={href as Href}>
      <YStack cur="pointer" f={1} ai="center" p="$4" br="$4" gap="$2">
        <H2 ff="$silkscreen" f={1} fow="600" size="$5" ls={1}>
          {title}
        </H2>

        <Paragraph px="$2" theme="alt1" f={1} size="$4" lh="$2">
          {subtitle}
        </Paragraph>

        <YStack pos="absolute" t={-5} r={-5} scale={1} rotate="-10deg">
          {icon}
        </YStack>
      </YStack>
    </Link>
  )
}

export const SlidingPopover = (props: PopoverProps) => {
  const popoverRef = React.useRef<Popover>(null)
  const [active, setActive] = React.useState('')

  const val = React.useMemo(() => {
    return {
      setActive(id: string, layout: LayoutRectangle) {
        popoverRef.current?.anchorTo(layout)
        setActive(id)
      },
      close: () => {
        setActive('')
        popoverRef.current?.close()
      },
      setInactive(id: string) {
        setActive((cur) => {
          if (!cur || cur === id) {
            return ''
          }
          return id
        })
      },
    }
  }, [active])

  return (
    <Popover
      disableRTL
      hoverable={{
        delay: 200,
        restMs: 340,
        move: false,
      }}
      onOpenChange={(val, event) => {
        if (!val) {
          setActive('')
        }
      }}
      ref={popoverRef}
      {...props}
    >
      <SlidingPopoverContext.Provider value={val}>
        <SlidingPopoverContent active={active} />
        {props.children}
      </SlidingPopoverContext.Provider>
    </Popover>
  )
}
const SlidingPopoverContext = React.createContext({
  setActive(id: string, layout: LayoutRectangle) {},
  setInactive(id: string) {},
  close() {},
})

export const SlidingPopoverTrigger = YStack.styleable<{ id: string }>(
  ({ id, ...props }, ref) => {
    const context = React.useContext(SlidingPopoverContext)
    const [layout, setLayout_] = React.useState<LayoutRectangle>()
    const setLayout = createShallowSetState<LayoutRectangle>(setLayout_ as any)
    const triggerRef = React.useRef<HTMLElement>(null)
    const combinedRef = useComposedRefs(ref)

    React.useEffect(() => {
      const handleMove = debounce(() => {
        const layout = triggerRef.current?.getBoundingClientRect()
        if (layout) {
          setLayout(layout)
        }
      }, 32)
      window.addEventListener('resize', handleMove)
      return () => {
        window.removeEventListener('resize', handleMove)
      }
    }, [])

    return (
      <YStack
        onMouseEnter={() => {
          if (layout) {
            context.setActive(id, layout)
          }
        }}
        // onMouseLeave={() => {
        //   context.setInactive(id)
        // }}
        onPress={() => {
          setTimeout(() => {
            context.close()
          }, 400)
        }}
        onLayout={(e) => {
          React.startTransition(() => {
            setLayout({
              ...e.nativeEvent.layout,
              // @ts-ignore
              x: e.nativeEvent.layout.left,
              // @ts-ignore
              y: e.nativeEvent.layout.top,
            })
          })
        }}
        ref={combinedRef}
        {...props}
      />
    )
  }
)
const order = ['', 'takeout', 'bento', 'studio']
const SlidingPopoverContent = React.memo(({ active }: { active: string }) => {
  const context = React.useContext(SlidingPopoverContext)
  const last = React.useRef(active)

  const curI = order.indexOf(active)
  const lastI = order.indexOf(last.current)
  const going = curI > lastI ? 1 : -1

  React.useEffect(() => {
    last.current = active
  }, [active])

  return (
    <Popover.Content
      theme={active === 'takeout' ? 'black' : 'tan'}
      enableAnimationForPositionChange
      animation={
        active
          ? 'quick'
          : [
              'slowest',
              {
                x: '100ms',
              },
            ]
      }
      bg="$background08"
      backdropFilter="blur(40px)"
      elevation="$8"
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
      {active === 'bento' ? (
        <Theme name="tan">
          <Popover.Arrow bg="$color6" size="$3.5" />
        </Theme>
      ) : (
        <Popover.Arrow bg="$background08" size="$3.5" />
      )}

      <YStack
        onPressOut={() => {
          context.close()
        }}
        width={280}
        height={600}
        ov="hidden"
        br="$6"
      >
        <AnimatePresence custom={{ going }} initial={false}>
          {active === 'takeout' && (
            <Frame key="takeout" p="$3" gap="$2">
              <H5 als="center">Start</H5>

              <Paragraph theme="alt1" lh="$2" px="$2" mb="$2">
                Start is how we fund the independent development of Tamagui and the One
                framework.
              </Paragraph>

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
                  icon={<Dot />}
                  title="Theme"
                  subtitle="A smart LLM-based bot that generates themes."
                />
              </Card>
            </Frame>
          )}
        </AnimatePresence>
      </YStack>
    </Popover.Content>
  )
})

const Card = styled(YStack, {
  maxHeight: 120,
  br: '$4',
  borderWidth: 0.5,
  borderColor: '$color2',
})

const Frame = styled(YStack, {
  animation: 'slow',
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
