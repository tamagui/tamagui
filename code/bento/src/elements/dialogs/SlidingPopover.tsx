import * as React from 'react'
import type { PopoverProps } from 'tamagui'
import {
  createStyledHOC,
  AnimatePresence,
  H2,
  Paragraph,
  Popover,
  View,
  XStack,
  YStack,
  isWeb,
  styled,
  useDebounce,
  useGet,
} from 'tamagui'

import { Crown, Moon, Waves } from '../../icons'
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

  const debouncedClose = useDebounce((id: string) => {
    setActive((cur) => {
      if (!cur || cur === id) {
        return ''
      }
      return cur
    })
  }, 150)

  const val = React.useMemo(() => {
    return {
      id: active,
      setActive(id: string, layout: LayoutRectangle) {
        debouncedClose.cancel()
        setActive(id)
        popoverRef.current?.anchorTo(layout)
      },
      close: () => {
        debouncedClose.cancel()
        setActive('')
      },
      setInactive(id: string) {
        debouncedClose(id)
      },
    }
  }, [active, debouncedClose])

  return (
    <Popover open={!!active} ref={popoverRef} {...props}>
      <SlidingPopoverContext.Provider value={val}>
        {props.children}
      </SlidingPopoverContext.Provider>
    </Popover>
  )
}

const SlidingPopoverTrigger = createStyledHOC(
  YStack,
  ({ id, ...props }: { id: string }, ref) => {
    const context = React.useContext(SlidingPopoverContext)
    const [layout, setLayout] = React.useState<LayoutRectangle>()
    const getLayout = useGet(layout)

    const setActiveDelayed = useDebounce(() => {
      const layout = getLayout()
      if (layout) {
        context.setActive(id, layout)
      }
    }, 100)

    const setActiveImmediate = () => {
      const layout = getLayout()
      if (layout) {
        context.setActive(id, layout)
      }
    }

    return (
      <YStack
        onMouseEnter={() => {
          if (context.id) {
            // Popover is already open, switch immediately
            setActiveImmediate()
          } else {
            // Popover is closed, use debounced activation
            setActiveDelayed()
          }
        }}
        onMouseLeave={() => {
          setActiveDelayed.cancel()
          context.setInactive(id)
        }}
        onPress={() => {
          setActiveDelayed.cancel()
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
            x: e.nativeEvent.layout.pageX,
            // @ts-ignore
            y: e.nativeEvent.layout.pageY,
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
      theme="level4"
      transition="200ms"
      bg="background"
      p={0}
      y="enter:-10px exit:-10px"
      opacity="enter:0 exit:0"
      boxShadow="0 16px 32px shadow-color"
    >
      <Popover.Arrow />
      <YStack
        position="absolute"
        inset={0}
        rounded="4"
        style={{
          background: `linear-gradient(transparent, rgba(255,255,255,0.15))`,
          mixBlendMode: 'color-dodge',
        }}
      />
      <YStack width={280} height={240} rounded="4" overflow="hidden">
        <AnimatePresence custom={{ going }} initial={false}>
          {context.id === 'takeout' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<Crown color="color-9" />}
                title="Takeout"
                subtitle="A paid starter kit with Supabase, user and auth, icons, fonts, and&nbsp;more."
              />
            </Frame>
          )}
          {context.id === 'bento' && (
            <Frame key="bento">
              <TooltipLabelLarge
                icon={<Waves color="color-9" />}
                title="Bento"
                subtitle="A suite of nicely designed copy-paste components and screens."
              />
            </Frame>
          )}
          {context.id === 'studio' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<Moon color="color-9" />}
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
  transition: '200ms',
  position: 'absolute',
  inset: 0,
  z: 1,
  x: 0,
  opacity: 1,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      number: (going) => ({
        x: `enter:${going > 0 ? 60 : -60}px exit:${going < 0 ? 60 : -60}px`,
        opacity: 'enter:0 exit:0',
        zIndex: 'exit:0',
      }),
    },
  } as const,
})

const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
}: {
  icon: any
  title: string
  subtitle: string
}) => {
  return (
    <YStack
      flex={1}
      items="center"
      p="7"
      rounded="4"
      overflow="hidden"
      position="relative"
    >
      <H2 flex={1} fontWeight="600" size="8">
        {title}
      </H2>

      <Paragraph theme="level2" flex={1} fontSize="5">
        {subtitle}
      </Paragraph>

      <YStack position="absolute" b={15} r={17} scale={2.25} rotate="-10deg">
        {icon}
      </YStack>
    </YStack>
  )
}

const TouchableArea = styled(View, {
  p: '3',
})

/** ---------- EXAMPLE --------- */
export const SlidingPopoverDemo = () => {
  return (
    <SlidingPopover>
      <SlidingPopoverContent />

      <Popover.Trigger asChild>
        <View flexDirection="row">
          <SlidingPopoverTrigger id="takeout" px="4" py="3">
            <Crown />
          </SlidingPopoverTrigger>
          <SlidingPopoverTrigger id="bento" px="4" py="3" mx="-2">
            <Waves />
          </SlidingPopoverTrigger>
          <SlidingPopoverTrigger id="studio" px="4" py="3" mx="-2">
            <Moon />
          </SlidingPopoverTrigger>
        </View>
      </Popover.Trigger>
    </SlidingPopover>
  )
}
