import * as React from 'react'
import type { PopoverProps } from 'tamagui'
import {
  createStyledHOC,
  AnimatePresence,
  Popover,
  Text,
  View,
  YStack,
  isWeb,
  styled,
  useDebounce,
  useGet,
} from 'tamagui'

import {
  BellRing,
  ChartLine,
  Globe2,
  Handshake,
  HelpCircle,
  Mail,
  Rocket,
  ShieldCheck,
  Smile,
} from '../../icons'
import { tone } from '../../tone'
import type { LayoutRectangle } from 'react-native'

const order = ['', 'products', 'resources', 'company']

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

const menus = {
  products: [
    { icon: ChartLine, title: 'Analytics', description: 'See how people use your app' },
    { icon: BellRing, title: 'Alerts', description: 'Hear about problems first' },
    {
      icon: ShieldCheck,
      title: 'Security',
      description: 'Audit logs and single sign-on',
    },
  ],
  resources: [
    { icon: Rocket, title: 'Guides', description: 'Ship your first project in a day' },
    {
      icon: HelpCircle,
      title: 'Help center',
      description: 'Answers to common questions',
    },
    { icon: Globe2, title: 'Community', description: 'Meet other builders' },
  ],
  company: [
    { icon: Smile, title: 'About', description: 'Who we are and how we work' },
    { icon: Handshake, title: 'Partners', description: 'Build and sell with us' },
    { icon: Mail, title: 'Contact', description: 'Talk to a person' },
  ],
}

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
      transition="200ms"
      bg={tone.surface}
      borderWidth={1}
      borderColor={tone.border}
      rounded="6"
      p={0}
      y="enter:-10px exit:-10px"
      opacity="enter:0 exit:0"
      boxShadow="0 12px 32px shadow-color"
    >
      <YStack width={300} height={220} overflow="hidden">
        <AnimatePresence custom={{ going }} initial={false}>
          {context.id ? (
            <Frame key={context.id}>
              {menus[context.id as keyof typeof menus].map((item) => (
                <MenuItem key={item.title} {...item} />
              ))}
            </Frame>
          ) : null}
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
  p: '2',
  gap: '1',

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

function MenuItem({
  icon: Icon,
  title,
  description,
}: (typeof menus)['products'][number]) {
  return (
    <View
      flexDirection="row"
      items="center"
      gap="3"
      p="2"
      rounded="4"
      cursor="pointer"
      tabIndex={0}
      bg={`transparent ${tone.rowHover}`}
    >
      <View
        width={36}
        height={36}
        rounded="3"
        items="center"
        justify="center"
        borderWidth={1}
        borderColor={tone.border}
      >
        <Icon size={18} color="color-11" />
      </View>
      <View flex={1} gap="0.5">
        <Text fontFamily="body" fontSize="sm" fontWeight="500" color="color-12">
          {title}
        </Text>
        <Text fontFamily="body" fontSize="xs" color={tone.muted}>
          {description}
        </Text>
      </View>
    </View>
  )
}

const MenuTrigger = styled(SlidingPopoverTrigger, {
  px: '3',
  py: '2',
  rounded: '4',
  cursor: 'pointer',
  bg: `transparent ${tone.rowHover}`,
})

/** ---------- EXAMPLE --------- */
export const SlidingPopoverDemo = () => {
  return (
    <SlidingPopover>
      <SlidingPopoverContent />

      <Popover.Trigger asChild>
        <View flexDirection="row" gap="1">
          {(['products', 'resources', 'company'] as const).map((id) => (
            <MenuTrigger key={id} id={id}>
              <Text fontFamily="body" fontSize="sm" fontWeight="500" color="color-11">
                {id[0].toUpperCase() + id.slice(1)}
              </Text>
            </MenuTrigger>
          ))}
        </View>
      </Popover.Trigger>
    </SlidingPopover>
  )
}
