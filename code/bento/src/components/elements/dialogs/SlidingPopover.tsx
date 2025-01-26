import * as React from 'react'
import type { PopoverProps } from 'tamagui'
import {
  AnimatePresence,
  H2,
  Paragraph,
  Popover,
  View,
  XStack,
  YStack,
  isWeb,
  styled,
} from 'tamagui'

import { Crown, Moon, Waves } from '@tamagui/lucide-icons'
import type { LayoutRectangle } from 'react-native'

const order = ['', 'takeout', 'bento', 'studio']

const SlidingPopoverContext = React.createContext({
  id: '',
  setActive(id: string, layout: LayoutRectangle) {},
  setInactive(id: string) {},
  close() {},
})

const SlidingPopover = (props: PopoverProps) => {
  const popoverRef = React.useRef<Popover>(null)
  const [active, setActive] = React.useState('')

  const val = React.useMemo(() => {
    return {
      id: active,
      setActive(id: string, layout: LayoutRectangle) {
        setActive(id)
        popoverRef.current?.anchorTo(layout)
      },
      close: () => {
        setActive('')
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
    <Popover open={!!active} ref={popoverRef} {...props}>
      <Popover.Trigger />
      <SlidingPopoverContext.Provider value={val}>
        {props.children}
      </SlidingPopoverContext.Provider>
    </Popover>
  )
}

const SlidingPopoverTrigger = YStack.styleable<{ id: string }>(
  ({ id, ...props }, ref) => {
    const context = React.useContext(SlidingPopoverContext)
    const [layout, setLayout] = React.useState<LayoutRectangle>()

    return (
      <YStack
        onMouseEnter={() => {
          if (layout) {
            context.setActive(id, layout)
          }
        }}
        onMouseLeave={() => {
          context.setInactive(id)
        }}
        onPress={() => {
          if (!isWeb) {
            if (layout) {
              context.setActive(id, layout)
            }
          } else {
            setTimeout(() => {
              context.close()
            }, 400)
          }
        }}
        onLayout={(e) =>
          setLayout({
            ...e.nativeEvent.layout,
            // @ts-ignore
            x: e.nativeEvent.layout.left,
            // @ts-ignore
            y: e.nativeEvent.layout.top,
          })
        }
        ref={ref}
        {...props}
      />
    )
  }
)

const SlidingPopoverContent = () => {
  const context = React.useContext(SlidingPopoverContext)
  const last = React.useRef(context.id)

  const curI = order.indexOf(context.id)
  const lastI = order.indexOf(last.current)
  const going = curI > lastI ? 1 : -1

  React.useEffect(() => {
    last.current = context.id
  }, [context.id])

  return (
    <Popover.Content
      theme="surface3"
      enableAnimationForPositionChange
      animation="quicker"
      bg="$background"
      elevation="$8"
      padding={0}
      enterStyle={{
        y: -10,
        o: 0,
      }}
      exitStyle={{
        y: -10,
        o: 0,
      }}
    >
      <Popover.Arrow size="$4" />
      <YStack
        fullscreen
        br="$4"
        style={{
          background: `linear-gradient(transparent, rgba(255,255,255,0.15))`,
          mixBlendMode: 'color-dodge',
        }}
      />
      <YStack w={280} h={240} br="$4" ov="hidden">
        <AnimatePresence custom={{ going }} initial={false}>
          {context.id === 'takeout' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<Crown color="$color10" />}
                title="Takeout"
                subtitle="A paid starter kit with Supabase, user and auth, icons, fonts, and&nbsp;more."
              />
            </Frame>
          )}
          {context.id === 'bento' && (
            <Frame key="bento">
              <TooltipLabelLarge
                icon={<Waves color="$color10" />}
                title="Bento"
                subtitle="A suite of nicely designed copy-paste components and screens."
              />
            </Frame>
          )}
          {context.id === 'studio' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<Moon color="$color10" />}
                title="Studio"
                subtitle="Create complete theme suites with a visual step-by-step studio."
              />
            </Frame>
          )}
        </AnimatePresence>
      </YStack>
    </Popover.Content>
  )
}

const Frame = styled(YStack, {
  animation: '200ms',
  fullscreen: true,
  zIndex: 1,
  x: 0,
  opacity: 1,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 60 : -60,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 60 : -60,
          opacity: 0,
        },
      }),
    },
  } as const,
})

const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
}: { icon: any; title: string; subtitle: string }) => {
  return (
    <YStack f={1} ai="center" p="$7" br="$4" ov="hidden">
      <H2 f={1} fow="600" size="$8">
        {title}
      </H2>

      <Paragraph theme="alt1" f={1} size="$5">
        {subtitle}
      </Paragraph>

      <YStack pos="absolute" b={15} r={17} scale={2.25} rotate="-10deg">
        {icon}
      </YStack>
    </YStack>
  )
}

const TouchableArea = styled(View, {
  padding: '$3',
})

/** ---------- EXAMPLE --------- */
export const SlidingPopoverDemo = () => {
  return (
    <SlidingPopover>
      <SlidingPopoverContent />

      <XStack>
        <SlidingPopoverTrigger id="takeout">
          <TouchableArea>
            <Crown />
          </TouchableArea>
        </SlidingPopoverTrigger>

        <SlidingPopoverTrigger id="bento">
          <TouchableArea>
            <Waves />
          </TouchableArea>
        </SlidingPopoverTrigger>

        <SlidingPopoverTrigger id="studio">
          <TouchableArea>
            <Moon />
          </TouchableArea>
        </SlidingPopoverTrigger>
      </XStack>
    </SlidingPopover>
  )
}

SlidingPopoverDemo.fileName = 'SlidingPopover'
