import { ThemeTintAlt } from '@tamagui/logo'
import { Paintbrush } from '@tamagui/lucide-icons'
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
      <YStack cur="pointer" f={1} ai="center" p="$7" br="$4" ov="hidden">
        <H2 ff="$silkscreen" f={1} fow="600" size="$7">
          {title}
        </H2>

        <Paragraph theme="alt1" f={1} size="$5">
          {subtitle}
        </Paragraph>

        <YStack pos="absolute" b={15} r={17} scale={2.25} rotate="-10deg">
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
        delay: 50,
        restMs: 40,
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
      theme={active === 'takeout' ? 'gray' : 'tan'}
      enableAnimationForPositionChange
      animation={
        active
          ? 'quicker'
          : [
              'quicker',
              {
                x: '100ms',
              },
            ]
      }
      bg={active === 'takeout' ? '$color7' : '$background'}
      elevation="$8"
      padding={0}
      br="$6"
      enterStyle={{
        y: -10,
        o: 0,
      }}
      exitStyle={{
        y: -10,
        o: 0,
      }}
    >
      {active === 'bento' ? (
        <Theme name="tan">
          <Popover.Arrow bg="$color6" size="$4" />
        </Theme>
      ) : (
        <Popover.Arrow bg="$color4" size="$4" />
      )}

      <YStack
        onPressOut={() => {
          context.close()
        }}
        w={280}
        h={200}
        ov="hidden"
        br="$6"
      >
        <AnimatePresence custom={{ going }} initial={false}>
          {active === 'takeout' && (
            <Frame key="takeout">
              <ThemeTintAlt>
                <YStack
                  fullscreen
                  br="$6"
                  zi={0}
                  style={{
                    background: `linear-gradient(45deg, transparent, var(--color3))`,
                    mixBlendMode: 'color',
                  }}
                />
              </ThemeTintAlt>
              <ThemeTintAlt offset={-1}>
                <YStack
                  fullscreen
                  br="$6"
                  zi={0}
                  style={{
                    background: `linear-gradient(-125deg, transparent, var(--color3))`,
                    mixBlendMode: 'color',
                  }}
                />
              </ThemeTintAlt>
              <TooltipLabelLarge
                icon={<TakeoutIcon />}
                href="/takeout"
                title="Takeout"
                subtitle="Starter kit for making universal apps fast."
              />
            </Frame>
          )}

          {active === 'bento' && (
            <Frame key="bento">
              <BentoPageFrame simpler>
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
              </BentoPageFrame>
            </Frame>
          )}

          {active === 'studio' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                href="/studio"
                icon={<StudioIcon />}
                title="Studio"
                subtitle="Create complete theme suites with a visual step-by-step studio."
              />
            </Frame>
          )}
        </AnimatePresence>
      </YStack>
    </Popover.Content>
  )
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
