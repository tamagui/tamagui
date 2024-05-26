import * as React from 'react'
import type { PopoverProps } from 'tamagui'
import {
  AnimatePresence,
  H2,
  Paragraph,
  Popover,
  Separator,
  SizableText,
  Text,
  XStack,
  YStack,
  debounce,
  getMedia,
  styled,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { usePathname } from 'vxs'

import { createShallowSetState, useComposedRefs } from '@tamagui/core'
import { ThemeTintAlt } from '@tamagui/logo'
import { ExternalLink, Figma, Paintbrush } from '@tamagui/lucide-icons'
import type { LayoutRectangle } from 'react-native'
import { Link } from '~/components/Link'
import { BentoIcon } from '~/features/icons/BentoIcon'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { TakeoutIcon } from '~/features/icons/TakeoutIcon'
import type { HeaderProps } from './types'

const HeadAnchor = styled(Paragraph, {
  tag: 'a',
  fontFamily: '$silkscreen',
  px: '$3',
  py: '$3',
  cursor: 'pointer',
  size: '$2',
  color: '$color11',
  tabIndex: -1,

  hoverStyle: {
    color: '$color',
    br: '$3',
  },

  pressStyle: {
    opacity: 0.25,
  },

  variants: {
    grid: {
      true: {
        fow: '200',
        ls: 1,
        textTransform: 'unset',
        w: '100%',
        f: 1,
        p: '$2',
        px: '$4',

        hoverStyle: {
          backgroundColor:
            'color-mix(in srgb, var(--color8) 10%, transparent 50%)' as any,
        },
      },
    },

    half: {
      true: {
        maxWidth: '48.5%',
        overflow: 'hidden',
      },
    },
  } as const,
})

export const HeaderLinks = (props: HeaderProps) => {
  const { showExtra, forceShowAllLinks, isHeader } = props
  const userSwr = useUser()
  // there is user context and supabase setup in the current page
  return (
    <>
      <Link asChild href="/docs/intro/introduction">
        <HeadAnchor
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </Link>

      <Link asChild href="/ui/intro/1.0.0">
        <HeadAnchor
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          UI
        </HeadAnchor>
      </Link>

      {forceShowAllLinks && (
        <Link asChild href="/community">
          <HeadAnchor grid>Community</HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <Link asChild href="/takeout">
          <HeadAnchor grid tag="span">
            Takeout{' '}
            <YStack dsp={'inline-block' as any} y={7} my={-20} o={0.8}>
              <TakeoutIcon scale={0.75} />
            </YStack>
          </HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <Link asChild href="/bento">
          <HeadAnchor grid tag="span">
            Bento{' '}
            <YStack ml={3} dsp={'inline-block' as any} y={3} my={-10} o={0.8}>
              <BentoIcon scale={0.75} />
            </YStack>
          </HeadAnchor>
        </Link>
      )}

      {!forceShowAllLinks && (
        <SlidingPopover>
          <SlidingPopoverContent />

          <XStack
            gap="$4"
            br="$10"
            px="$4"
            height={44}
            ai="center"
            bw={1}
            bc="transparent"
            hoverStyle={{
              bc: '$color025',
            }}
          >
            <SlidingPopoverTrigger id="takeout">
              <CTAHeaderLink
                {...props}
                excludeRoutes={['/', '/bento', '/takeout']}
                href="/takeout"
                name="Takeout"
                description="starter kit"
                icon={<TakeoutIcon scale={0.8} />}
              />
            </SlidingPopoverTrigger>

            <SlidingPopoverTrigger id="bento">
              <CTAHeaderLink
                {...props}
                excludeRoutes={['*']}
                href="/bento"
                name="Bento"
                description="starter kit"
                icon={
                  <YStack y={1}>
                    <BentoIcon scale={0.8} />
                  </YStack>
                }
              />
            </SlidingPopoverTrigger>
          </XStack>

          {/* <SlidingPopoverTrigger id="studio">
            <Link  href="/studio">
              <HeadAnchor
                grid={forceShowAllLinks}
                $md={{
                  display: forceShowAllLinks ? 'flex' : 'none',
                }}
              >
                <StudioIcon />
              </HeadAnchor>
            </Link>
          </SlidingPopoverTrigger> */}
        </SlidingPopover>
      )}

      {forceShowAllLinks && (
        <Link asChild href="/studio">
          <HeadAnchor
            grid
            $md={{
              display: forceShowAllLinks ? 'flex' : 'none',
            }}
          >
            Studio
          </HeadAnchor>
        </Link>
      )}

      {showExtra && (
        <Link asChild href="/studio">
          <HeadAnchor grid={forceShowAllLinks}>Studio</HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <Link asChild href="https://github.com/sponsors/natew">
          <HeadAnchor target="_blank" grid={forceShowAllLinks}>
            Sponsor
            <YStack dsp={'inline-block' as any} y={0} my={-20} ml={12} o={0.8}>
              <ExternalLink size={10} o={0.5} />
            </YStack>
          </HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color025" o={0.25} my="$2" />

          <XStack fw="wrap" f={1} gap="$2" w="100%">
            {forceShowAllLinks && (
              <Link asChild href="https://github.com/tamagui/tamagui">
                <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                  Github{' '}
                  <YStack dsp={'inline-block' as any} y={10} my={-20} o={0.8}>
                    <GithubIcon width={14} />
                  </YStack>
                </HeadAnchor>
              </Link>
            )}

            {forceShowAllLinks && (
              <Link
                asChild
                href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1"
              >
                <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                  Figma{' '}
                  <YStack dsp={'inline-block' as any} y={2} my={-20} o={0.8}>
                    <Figma size={14} />
                  </YStack>
                </HeadAnchor>
              </Link>
            )}

            <Link asChild href="/blog">
              <HeadAnchor half grid={forceShowAllLinks}>
                Blog
              </HeadAnchor>
            </Link>

            {userSwr.data?.userDetails && (
              <Link asChild href="/account">
                <HeadAnchor half grid={forceShowAllLinks}>
                  Account
                </HeadAnchor>
              </Link>
            )}

            {!userSwr.data?.userDetails && (
              <Link asChild href="/login">
                <HeadAnchor half grid={forceShowAllLinks}>
                  Login
                </HeadAnchor>
              </Link>
            )}
          </XStack>
        </>
      )}
    </>
  )
}

const CTAHeaderLink = ({
  href,
  icon,
  name,
  excludeRoutes,
  description,
  forceShowAllLinks,
}: HeaderProps & {
  href: string
  icon: React.ReactNode
  name: string
  description: string
  excludeRoutes?: string[]
}) => {
  const pathname = usePathname()
  const isDisabledRoute =
    excludeRoutes?.includes('*') || excludeRoutes?.includes(pathname)
  const [disabled, setDisabled] = React.useState(isDisabledRoute)
  const [open, setOpen] = React.useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = React.useState(false)

  if (disabled && open) {
    setOpen(false)
  }

  const openIt = () => {
    if (getMedia().xs) return
    setOpen(true)
    setHasOpenedOnce(true)
  }

  // open just a touch delayed to show the animation
  React.useEffect(() => {
    if (open || disabled || hasOpenedOnce) return

    const tm = setTimeout(openIt, 0)

    return () => {
      clearTimeout(tm)
    }
  }, [open, disabled])

  // remember if you closed it
  React.useEffect(() => {
    const key = 'tkt-cta-times-close2'
    const timesClosed = +(localStorage.getItem(key) || 0)
    if (timesClosed > 3) {
      setDisabled(true)
    }
    localStorage.setItem(key, `${timesClosed + 1}`)
  }, [])

  return (
    <Link href={href}>
      <Popover
        open={open}
        onOpenChange={(open) => {
          if (open) {
            openIt()
          } else {
            setOpen(false)
          }
        }}
        offset={12}
      >
        <Popover.Trigger asChild>
          <HeadAnchor
            grid={forceShowAllLinks}
            tag="span"
            fontSize={24}
            $sm={{
              display: 'none',
            }}
          >
            {icon}
          </HeadAnchor>
        </Popover.Trigger>

        <Popover.Content
          unstyled
          animation={[
            'bouncy',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
        >
          <Popover.Arrow size="$3" />
          <XStack
            tag="a"
            cur="pointer"
            bg="$background"
            jc="center"
            ai="center"
            py="$2"
            px="$3"
            br="$8"
            hoverStyle={{
              bg: '$backgroundHover',
            }}
            elevation="$0.25"
          >
            <SizableText ff="$silkscreen">{name} </SizableText>
            <Text ff="$body" fontSize="$3" color="$color10" $sm={{ dsp: 'none' }} ml={6}>
              {description}
            </Text>
          </XStack>
        </Popover.Content>
      </Popover>
    </Link>
  )
}

const StudioIcon = () => (
  <YStack h={24} w={24} mx={-4} y={-0.5}>
    <Paintbrush />
  </YStack>
)

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
    const [layout, setLayout_] = React.useState<LayoutRectangle>()
    const setLayout = createShallowSetState<LayoutRectangle>(setLayout_)
    const triggerRef = React.useRef<HTMLElement>(null)
    const combinedRef = useComposedRefs(ref)

    React.useEffect(() => {
      const handleMove = debounce(() => {
        const layout = triggerRef.current?.getBoundingClientRect()
        if (layout) {
          setLayout(layout)
        }
      }, 16)
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
        onMouseLeave={() => {
          context.setInactive(id)
        }}
        onPress={() => {
          setTimeout(() => {
            context.close()
          }, 400)
        }}
        onLayout={(e) => {
          globalThis['didonl']
          console.warn('ON LAYOUT HERE')
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
const offsets = [0, 3, -1, 2]

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
      theme="surface4"
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
      <ThemeTintAlt offset={offsets[curI]}>
        <YStack
          fullscreen
          br="$4"
          zi={0}
          style={{
            background: `linear-gradient(transparent, var(--color05))`,
            mixBlendMode: 'color',
          }}
        />
      </ThemeTintAlt>
      <YStack w={280} h={240} br="$4" ov="hidden">
        <AnimatePresence custom={{ going }} initial={false}>
          {context.id === 'takeout' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<TakeoutIcon />}
                title="Takeout"
                subtitle="A paid starter kit with Supabase, user and auth, icons, fonts, and&nbsp;more."
              />
            </Frame>
          )}
          {context.id === 'bento' && (
            <Frame key="bento">
              <TooltipLabelLarge
                icon={<BentoIcon />}
                title="Bento"
                subtitle="A suite of nicely designed copy-paste components and screens."
              />
            </Frame>
          )}
          {context.id === 'studio' && (
            <Frame key="takeout">
              <TooltipLabelLarge
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
