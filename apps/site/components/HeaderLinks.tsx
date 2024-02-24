import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
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
  Theme,
  XStack,
  YStack,
  getMedia,
  styled,
} from 'tamagui'

import { ExternalLink, Figma } from '@tamagui/lucide-icons'
import type { LayoutRectangle } from 'react-native'
import { BentoIcon } from './BentoIcon'
import { GithubIcon } from './GithubIcon'
import type { HeaderProps } from './HeaderProps'
import { NextLink } from './NextLink'
import { TakeoutIcon } from './TakeoutIcon'
import { LinearGradient } from 'tamagui/linear-gradient'

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
      <NextLink passHref prefetch={false} href="/docs/intro/introduction">
        <HeadAnchor
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      {forceShowAllLinks && (
        <NextLink passHref prefetch={false} href="/community">
          <HeadAnchor grid>Community</HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink legacyBehavior={false} prefetch={false} href="/takeout">
          <HeadAnchor grid tag="span">
            Starter Kit{' '}
            <YStack dsp={'inline-block' as any} y={7} my={-20} o={0.8}>
              <TakeoutIcon scale={0.6} />
            </YStack>
          </HeadAnchor>
        </NextLink>
      )}

      {!forceShowAllLinks && (
        <SlidingPopover>
          <SlidingPopoverContent />

          <SlidingPopoverTrigger id="takeout">
            <TakeoutHeaderLink {...props} />
          </SlidingPopoverTrigger>

          {process.env.NEXT_PUBLIC_IS_TAMAGUI_DEV && (
            <SlidingPopoverTrigger id="bento">
              <BentoHeaderLink {...props} />
            </SlidingPopoverTrigger>
          )}

          <SlidingPopoverTrigger id="studio">
            <NextLink passHref prefetch={false} href="/studio">
              <HeadAnchor
                grid={forceShowAllLinks}
                $md={{
                  display: forceShowAllLinks ? 'flex' : 'none',
                }}
              >
                <StudioIcon />
              </HeadAnchor>
            </NextLink>
          </SlidingPopoverTrigger>
        </SlidingPopover>
      )}

      {forceShowAllLinks && (
        <NextLink passHref prefetch={false} href="/studio">
          <HeadAnchor
            grid
            $md={{
              display: forceShowAllLinks ? 'flex' : 'none',
            }}
          >
            Studio
          </HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink passHref prefetch={false} href="/studio">
          <HeadAnchor grid={forceShowAllLinks}>Studio</HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink prefetch={false} href="https://github.com/sponsors/natew">
          <HeadAnchor target="_blank" grid={forceShowAllLinks}>
            Sponsor
            <YStack dsp={'inline-block' as any} y={0} my={-20} ml={12} o={0.8}>
              <ExternalLink size={10} o={0.5} />
            </YStack>
          </HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color025" o={0.25} my="$2" />

          <XStack fw="wrap" f={1} gap="$2" w="100%">
            {forceShowAllLinks && (
              <NextLink href="https://github.com/tamagui/tamagui">
                <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                  Github{' '}
                  <YStack dsp={'inline-block' as any} y={10} my={-20} o={0.8}>
                    <GithubIcon width={14} />
                  </YStack>
                </HeadAnchor>
              </NextLink>
            )}

            {forceShowAllLinks && (
              <NextLink href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1">
                <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                  Figma{' '}
                  <YStack dsp={'inline-block' as any} y={2} my={-20} o={0.8}>
                    <Figma size={14} />
                  </YStack>
                </HeadAnchor>
              </NextLink>
            )}

            <NextLink passHref prefetch={false} href="/blog">
              <HeadAnchor half grid={forceShowAllLinks}>
                Blog
              </HeadAnchor>
            </NextLink>

            {userSwr.data?.userDetails && (
              <NextLink passHref prefetch={false} href="/account">
                <HeadAnchor half grid={forceShowAllLinks}>
                  Account
                </HeadAnchor>
              </NextLink>
            )}

            {!userSwr.data?.userDetails && (
              <NextLink passHref prefetch={false} href="/login">
                <HeadAnchor half grid={forceShowAllLinks}>
                  Login
                </HeadAnchor>
              </NextLink>
            )}
          </XStack>
        </>
      )}
    </>
  )
}

const TakeoutHeaderLink = ({ forceShowAllLinks }: HeaderProps) => {
  const router = useRouter()
  const isDisabledRoute = router.asPath === '/' || router.asPath === '/takeout'
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
    <NextLink legacyBehavior={false} prefetch={false} href="/takeout">
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
            <TakeoutIcon />
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
            ai="center"
            py="$2"
            px="$3"
            br="$4"
            hoverStyle={{
              bg: '$backgroundHover',
            }}
            elevation="$0.25"
          >
            <SizableText ff="$silkscreen">Takeout </SizableText>
            <Text
              ff="$body"
              fontSize="$3"
              color="$color10"
              $sm={{ dsp: 'none' }}
              y={0.98}
              ml={6}
            >
              starter kit
            </Text>
          </XStack>
        </Popover.Content>
      </Popover>
    </NextLink>
  )
}

const BentoHeaderLink = ({ forceShowAllLinks }: HeaderProps) => {
  return (
    <NextLink legacyBehavior={false} prefetch={false} href="/bento">
      <HeadAnchor
        grid={forceShowAllLinks}
        tag="span"
        aria-label="Bento: Components + Screens"
        fontSize={24}
        y={2}
        $sm={{
          display: 'none',
        }}
      >
        <BentoIcon />
      </HeadAnchor>
    </NextLink>
  )
}

const StudioIcon = () => (
  <YStack h={24} w={24} mx={-5}>
    <svg viewBox="0 0 475 475">
      <g>
        <path
          d="M241.939394,437 C340.537296,437 399.620047,394.333333 400,317.380952 C399.620047,257.952381 364.284382,216.238095 278.414918,197.761905 L246.498834,190.904762 C209.643357,183.095238 193.115385,172.238095 194.065268,153.571429 C194.255245,136.428571 208.503497,123.857143 241.179487,123.857143 C275.375291,123.857143 291.52331,138.904762 293.613054,164.238095 L394.680653,164.238095 C394.300699,87.6666667 335.407925,37 241.179487,37 C148.660839,37 83.3088578,86.9047619 83.8787879,161.190476 C83.6888112,222.142857 125.863636,256.047619 194.825175,270.904762 L233.58042,279.285714 C276.895105,288.809524 291.713287,299.666667 292.09324,317.380952 C291.713287,336.619048 274.235431,350.142857 240.41958,350.142857 C199.954545,350.142857 176.017483,331.095238 174.307692,295.285714 L74,295.285714 C74.3799534,393.190476 140.491841,437 241.939394,437 Z"
          fill="var(--color)"
          transform="translate(237.000000, 237.000000) rotate(-28.000000) translate(-237.000000, -237.000000) "
        ></path>
      </g>
    </svg>
  </YStack>
)

const SlidingPopoverContext = React.createContext({
  id: '',
  setActive(id: string, layout: LayoutRectangle) {},
  setInactive(id: string) {},
})

const SlidingPopover = (props: PopoverProps) => {
  const popoverRef = React.useRef<Popover>(null)
  const [active, setActive] = React.useState('')
  const [layouts, setLayouts] = React.useState({} as Record<string, LayoutRectangle>)

  const val = React.useMemo(() => {
    return {
      id: active,
      setActive(id: string, layout: LayoutRectangle) {
        setLayouts((prev) => ({ ...prev, [id]: layout }))
        setActive(id)
        popoverRef.current?.anchorTo(layout)
      },
      setInactive(id: string) {
        setActive((cur) => {
          if (cur === id) {
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

const order = ['', 'takeout', 'bento', 'studio']

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
      <YStack
        fullscreen
        br="$4"
        style={{
          background: `linear-gradient(transparent, rgba(255,255,255,0.15))`,
          mixBlendMode: 'color-dodge',
        }}
      />
      <YStack w={280} h={240}>
        <AnimatePresence custom={{ going }} initial={false}>
          {context.id === 'takeout' && (
            <Frame key="takeout">
              <TooltipLabelLarge
                icon={<TakeoutIcon x={-4} y={-4} />}
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
                subtitle="A suite of nicely design copy-paste components and screens."
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

      <YStack pos="absolute" b={6} r={6} scale={2.25} rotate="-10deg">
        {icon}
      </YStack>
    </YStack>
  )
}
