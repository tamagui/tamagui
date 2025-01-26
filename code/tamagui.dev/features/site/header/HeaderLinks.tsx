import { createShallowSetState, useComposedRefs } from '@tamagui/core'
import { ThemeTintAlt } from '@tamagui/logo'
import { ExternalLink, Figma, LogIn, Paintbrush } from '@tamagui/lucide-icons'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import type { PopoverProps } from 'tamagui'
import {
  AnimatePresence,
  H2,
  Paragraph,
  Popover,
  Separator,
  SizableText,
  Theme,
  XStack,
  YStack,
  debounce,
  styled,
} from 'tamagui'
import type { Href } from 'one'
import { Link } from '~/components/Link'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { BentoIcon } from '~/features/icons/BentoIcon'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { TakeoutIcon } from '~/features/icons/TakeoutIcon'
import { useUser } from '~/features/user/useUser'
import { UserAvatar } from './UserAvatar'
import type { HeaderProps } from './types'

const HeadAnchor = styled(Paragraph, {
  tag: 'a',
  fontFamily: '$silkscreen',
  px: '$3',
  py: '$3',
  cursor: 'pointer',
  size: '$4',
  color: '$color11',
  tabIndex: -1,
  letterSpacing: -1,

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

  const primaryLinks = (
    <>
      <Link asChild href="/docs/intro/introduction">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Core
        </HeadAnchor>
      </Link>

      <Link asChild href="/docs/intro/compiler-install">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Compile
        </HeadAnchor>
      </Link>

      <Link asChild href="/ui/intro">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          UI
        </HeadAnchor>
      </Link>

      <Link asChild href="/theme">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Theme
        </HeadAnchor>
      </Link>
    </>
  )

  return (
    <>
      {forceShowAllLinks ? (
        <>
          {primaryLinks}
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      ) : (
        primaryLinks
      )}
      {/* {forceShowAllLinks ? (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            {primaryLinks}
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      ) : (
        primaryLinks
      )} */}

      {forceShowAllLinks && (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            <Link asChild href="/takeout">
              <HeadAnchor grid half tag="a">
                <XStack ai="center">
                  Takeout{' '}
                  <YStack dsp={'inline-block' as any} x={6} my={-20} o={0.8}>
                    <TakeoutIcon scale={0.65} />
                  </YStack>
                </XStack>
                <SizableText size="$2" theme="alt2">
                  Starter Kit
                </SizableText>
              </HeadAnchor>
            </Link>

            <Link asChild href="/bento">
              <HeadAnchor grid half tag="a">
                <XStack ai="center">
                  Bento{' '}
                  <YStack
                    ml={3}
                    dsp={'inline-block' as any}
                    x={6}
                    y={-1}
                    my={-10}
                    o={0.8}
                  >
                    <BentoIcon scale={0.65} />
                  </YStack>
                </XStack>
                <SizableText size="$2" theme="alt2">
                  Copy-paste UI
                </SizableText>
              </HeadAnchor>
            </Link>
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      )}

      {forceShowAllLinks && (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            <Link asChild href="/community">
              <HeadAnchor grid tag="a">
                Community
              </HeadAnchor>
            </Link>
            {/* <Link asChild href="/studio">
              <HeadAnchor
                grid
                half
                tag="a"
                $md={{
                  display: forceShowAllLinks ? 'flex' : 'none',
                }}
              >
                Studio
              </HeadAnchor>
            </Link> */}
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      )}

      {!forceShowAllLinks && (
        <SlidingPopover>
          <Popover.Trigger asChild="except-style">
            <XStack
              br="$10"
              px="$1"
              height={40}
              ai="center"
              bw={1}
              bc="transparent"
              hoverStyle={{
                bc: '$color02',
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
                    <YStack>
                      <BentoIcon scale={0.8} />
                    </YStack>
                  }
                />
              </SlidingPopoverTrigger>
            </XStack>
          </Popover.Trigger>

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

      {showExtra && (
        <Link asChild href="/studio">
          <HeadAnchor grid={forceShowAllLinks}>Studio</HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color02" o={0.25} my="$2" />
          {!userSwr.data?.userDetails && (
            <Link asChild href="/login">
              <HeadAnchor grid>
                Login
                <YStack dsp={'inline-block' as any} y={2} x={10} als="flex-end">
                  <LogIn color="$color10" size={14} />
                </YStack>
              </HeadAnchor>
            </Link>
          )}
          {userSwr.data?.userDetails && (
            <Link asChild href="/login">
              <HeadAnchor grid>
                <XStack ai="center" jc="center">
                  Account
                  <YStack flex={10} />
                  <YStack dsp={'inline-block' as any} y={-2} my={-3} als="flex-end">
                    <UserAvatar size={22} />
                  </YStack>
                </XStack>
              </HeadAnchor>
            </Link>
          )}
        </>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color02" o={0.25} my="$2" />

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

            {forceShowAllLinks && (
              <Link asChild href="https://github.com/sponsors/natew">
                <HeadAnchor half target="_blank" grid={forceShowAllLinks}>
                  Sponsor
                  <YStack dsp={'inline-block' as any} y={0} my={-20} ml={12} o={0.8}>
                    <ExternalLink size={10} o={0.5} />
                  </YStack>
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
  href: Href
  icon: React.ReactNode
  name: string
  description: string
  excludeRoutes?: string[]
}) => {
  // disabling for now it clutters things
  return (
    <Link asChild href={href}>
      <HeadAnchor
        grid={forceShowAllLinks}
        fontSize={24}
        mx={-2}
        $sm={{
          display: 'none',
        }}
      >
        {icon}
      </HeadAnchor>
    </Link>
  )

  // const pathname = usePathname()
  // const isDisabledRoute =
  //   excludeRoutes?.includes('*') || excludeRoutes?.includes(pathname)
  // const [disabled, setDisabled] = React.useState(isDisabledRoute)
  // const [open, setOpen] = React.useState(false)
  // const [hasOpenedOnce, setHasOpenedOnce] = React.useState(false)

  // if (disabled && open) {
  //   setOpen(false)
  // }

  // const openIt = () => {
  //   if (getMedia().xs) return
  //   setOpen(true)
  //   setHasOpenedOnce(true)
  // }

  // // open just a touch delayed to show the animation
  // React.useEffect(() => {
  //   if (open || disabled || hasOpenedOnce) return

  //   const tm = setTimeout(openIt, 0)

  //   return () => {
  //     clearTimeout(tm)
  //   }
  // }, [open, disabled])

  // // remember if you closed it
  // React.useEffect(() => {
  //   const key = 'tkt-cta-times-close2'
  //   const timesClosed = +(localStorage.getItem(key) || 0)
  //   if (timesClosed > 3) {
  //     setDisabled(true)
  //   }
  //   localStorage.setItem(key, `${timesClosed + 1}`)
  // }, [])

  // return (
  //   <Popover
  //     open={open}
  //     onOpenChange={(open) => {
  //       if (open) {
  //         openIt()
  //       } else {
  //         setOpen(false)
  //       }
  //     }}
  //     offset={12}
  //   >
  //     <Popover.Trigger asChild>
  //       <Link asChild href={href}>
  //         <HeadAnchor
  //           grid={forceShowAllLinks}
  //           fontSize={24}
  //           $sm={{
  //             display: 'none',
  //           }}
  //         >
  //           {icon}
  //         </HeadAnchor>
  //       </Link>
  //     </Popover.Trigger>

  //     <Popover.Content
  //       unstyled
  //       animation={[
  //         'bouncy',
  //         {
  //           opacity: {
  //             overshootClamping: true,
  //           },
  //         },
  //       ]}
  //       enterStyle={{ y: -10, opacity: 0 }}
  //       exitStyle={{ y: -10, opacity: 0 }}
  //     >
  //       <Popover.Arrow size="$3" />
  //       <XStack
  //         tag="a"
  //         cur="pointer"
  //         bg="$background"
  //         jc="center"
  //         ai="center"
  //         py="$2"
  //         px="$3"
  //         br="$8"
  //         hoverStyle={{
  //           bg: '$backgroundHover',
  //         }}
  //         elevation="$0.25"
  //       >
  //         <SizableText ff="$silkscreen">{name} </SizableText>
  //         <Text ff="$body" fontSize="$3" color="$color10" $sm={{ dsp: 'none' }} ml={6}>
  //           {description}
  //         </Text>
  //       </XStack>
  //     </Popover.Content>
  //   </Popover>
  // )
}

const StudioIcon = () => (
  <YStack h={24} w={24} mx={-4} y={-0.5}>
    <Paintbrush />
  </YStack>
)

const SlidingPopoverContext = React.createContext({
  setActive(id: string, layout: LayoutRectangle) {},
  setInactive(id: string) {},
  close() {},
})

const SlidingPopover = (props: PopoverProps) => {
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

const SlidingPopoverTrigger = YStack.styleable<{ id: string }>(
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
