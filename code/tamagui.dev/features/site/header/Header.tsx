import { LogoWords, TamaguiLogo, ThemeTint, useTint } from '@tamagui/logo'
import { ExternalLink, Figma, LogIn, Menu } from '@tamagui/lucide-icons'
import { createShallowSetState, isTouchable } from '@tamagui/web'
import { usePathname } from 'one'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import {
  type PopoverProps,
  Adapt,
  AnimatePresence,
  Button,
  Circle,
  debounce,
  isClient,
  Paragraph,
  Popover,
  Separator,
  Sheet,
  SizableText,
  styled,
  TooltipGroup,
  useComposedRefs,
  View,
  XGroup,
  XStack,
  YStack,
} from 'tamagui'
import { Link } from '~/components/Link'
import { bannerHeight } from '~/components/PromoBanner'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { SeasonTogglePopover } from '~/features/site/seasons/SeasonTogglePopover'
import { ThemeToggle } from '~/features/site/theme/ThemeToggle'
import { DocsMenuContents } from '../../docs/DocsMenuContents'
import { useDocsMenu } from '../../docs/useDocsMenu'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { useUser } from '../../user/useUser'
import { accountModal } from '../purchase/NewAccountModal'
import { PromoCardTheme } from './PromoCards'
import { SearchButton } from './SearchButton'
import { UpgradePopover } from './UpgradePopover'
import { UserAvatar } from './UserAvatar'
import type { HeaderProps } from './types'

export function Header(props: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  if (isClient) {
    React.useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 30)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <>
      <XStack
        // @ts-ignore
        pos="fixed"
        t={0}
        l={0}
        r={0}
        ai="center"
        pe="none"
        jc="center"
        zi={50000}
        className="all ease-out s1"
        $gtSm={{
          px: '$1',
        }}
      >
        <XStack pe="auto" width="100%" maw={1200} pos="relative">
          <XStack
            className={`ease-out all ms300`}
            py="$1.5"
            y={bannerHeight}
            ov="hidden"
            contain="paint"
            width="100%"
            bc="transparent"
            br="$10"
            $sm={{
              br: 0,
              bw: 0,
              y: -1 + (isScrolled ? 0 : bannerHeight),
              py: '$2',
            }}
            {...(isScrolled && {
              $gtSm: {
                y: 6,
              },
            })}
            {...(props.hasBanner && {
              $gtSm: {
                y: isScrolled ? 6 : 35,
              },
            })}
          >
            <YStack
              pos="absolute"
              inset={0}
              className={'ease-out all ms100'}
              style={{
                ...(isScrolled && {
                  backdropFilter: `blur(16px)`,
                  WebkitBackdropFilter: `blur(16px)`,
                }),
              }}
            />
            <YStack
              o={isScrolled ? 0.6 : 0}
              className={`ease-out all ms300`}
              fullscreen
              bg="$color2"
              $theme-dark={{
                bg: '$color7',
              }}
            />
            <YStack mx="auto" px="$4" w="100%">
              <ThemeTint>
                <HeaderContents floating {...props} />
              </ThemeTint>
            </YStack>
          </XStack>
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className={`ease-in-out all ms200`}
            zi={-1}
            br="$10"
            fullscreen
            {...(isScrolled && {
              $gtSm: {
                py: '$2',
                y: 5,
                elevation: '$10',
              },
            })}
          />
        </XStack>
      </XStack>
      <YStack height={54} w="100%" />
    </>
  )
}

const tooltipDelay = { open: 0, close: 150 }

export const HeaderContents = React.memo((props: HeaderProps) => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const tint = useTint()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      pos="relative"
      py={props.minimal ? '$4' : props.floating ? 0 : '$2'}
      zi={50000}
    >
      <XStack ai="center" gap="$4">
        <Link href="/">
          <SeasonTogglePopover>
            <YStack
              px="$2"
              cur="pointer"
              o={1}
              {...(isHome && {
                onPress(e) {
                  e.preventDefault()
                  e.stopPropagation()
                  tint.setNextTint()
                },
              })}
            >
              <TamaguiLogo downscale={2} />
            </YStack>
          </SeasonTogglePopover>
        </Link>

        <TooltipGroup delay={tooltipDelay}>
          <XGroup mah={32} bc="transparent" ai="center" size="$4">
            <XGroup.Item>
              <ThemeToggle borderWidth={0} chromeless />
            </XGroup.Item>
          </XGroup>
        </TooltipGroup>

        <SearchButton size="$2" br="$10" elevation="$0.5" />

        <Link target="_blank" href="https://github.com/tamagui/tamagui">
          <XStack group containerType="normal">
            <XStack ai="center" gap="$2" p="$2" opacity={0.9} hoverStyle={{ opacity: 1 }}>
              <GithubIcon width={22} />
              <>
                <SizableText
                  $xl={{ display: 'none' }}
                  size="$3"
                  color="$color12"
                  o={0.5}
                  $group-hover={{
                    o: 0.8,
                  }}
                >
                  GitHub
                </SizableText>
              </>
            </XStack>
          </XStack>
        </Link>

        <UpgradePopover />
      </XStack>

      <View flex={1} />

      <XStack
        position="absolute"
        $md={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <Link href="/" aria-label="Homepage">
          <XStack
            cursor={isHome ? 'default' : 'pointer'}
            pointerEvents="auto"
            als="center"
          >
            <LogoWords animated />
          </XStack>
        </Link>
      </XStack>

      <XStack h={40} jc="flex-end" pointerEvents="auto" tag="nav">
        <XStack ai="center" gap="$2">
          <HeaderLinksPopover>
            <HeaderLink id="core" href="/docs/intro/introduction">
              Core
            </HeaderLink>

            <HeaderLink id="compiler" href="/docs/intro/compiler-install">
              Compiler
            </HeaderLink>

            <HeaderLink id="ui" href="/ui/intro">
              UI
            </HeaderLink>

            <HeaderLink id="theme" href="/theme">
              Theme
            </HeaderLink>

            <HeaderMenuButton />
          </HeaderLinksPopover>
        </XStack>
      </XStack>
    </XStack>
  )
})

const HeaderMenuButton = () => {
  const { open, setOpen } = useDocsMenu()
  const [state, setState] = React.useState({
    via: undefined as 'hover' | 'press' | undefined,
    viaAt: Date.now(),
  })
  const userSwr = useUser()
  const isPressOpened = state.via === 'press' && open

  return (
    <Popover.Trigger>
      <SlidingPopoverTarget id="menu">
        <Button
          size="$3"
          my={10}
          bg={isPressOpened ? '$color5' : 'rgba(0,0,0,0.02)'}
          noTextWrap
          br="$10"
          bw={2}
          px="$2"
          onPress={() => {
            if (!open && userSwr.data?.user) {
              accountModal.show = true
              return
            }
            if (isTouchable) {
              setOpen(!open)
              return
            }
            if (open && state.via === 'hover') {
              setState({ ...state, via: 'press', viaAt: Date.now() })
              return
            }
            if (open) {
              setOpen(false)
              return
            }
            // hover handles this
          }}
          aria-label="Open the main menu"
          hoverStyle={{
            bg: isPressOpened ? '$color5' : 'transparent',
            // @ts-ignore
            bc: 'color-mix(in srgb, var(--color10) 30%, transparent 60%)',
          }}
        >
          <Circle size={34} ai="center" jc="center">
            {userSwr.data?.userDetails ? <UserAvatar /> : <Menu size={16} />}
          </Circle>
        </Button>
      </SlidingPopoverTarget>
    </Popover.Trigger>
  )
}

let isOnMenu = false
const isOnLink = new Set<string>()

export const HeaderLinksPopover = (props: PopoverProps) => {
  const popoverRef = React.useRef<Popover>(null)
  const [active, setActive] = React.useState<ID | ''>('')

  const close = () => {
    setActive('')
    popoverRef.current?.close()
  }

  const val = React.useMemo(() => {
    return {
      setActive(id: ID, layout: LayoutRectangle) {
        popoverRef.current?.anchorTo(layout)
        setActive(id)
      },
      close,
    }
  }, [])

  const check = React.useRef<any>()

  const checkForClose = () => {
    check.current = setInterval(() => {
      if (!isOnMenu && !isOnLink.size) {
        close()
      }
    }, 500)
  }

  const cancelCheckForClose = () => {
    clearInterval(check.current)
  }

  return (
    <Popover
      disableRTL
      hoverable={{
        delay: 0,
        restMs: 0,
        move: false,
      }}
      stayInFrame={{
        padding: 20,
      }}
      open={!!active}
      onOpenChange={(val, event) => {
        if (!val) {
          setActive('')
        }
      }}
      ref={popoverRef}
      {...props}
    >
      <SlidingPopoverContext.Provider value={val}>
        <XStack onMouseEnter={cancelCheckForClose} onMouseLeave={checkForClose}>
          {props.children}
        </XStack>
        <HeaderLinksPopoverContent active={active} />
      </SlidingPopoverContext.Provider>

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
    </Popover>
  )
}

type ID = 'core' | 'compiler' | 'ui' | 'theme' | 'menu'

export const HeaderLink = (props: {
  id: ID
  children: string
  href: string
}) => {
  return (
    <SlidingPopoverTarget id={props.id}>
      <Link asChild href={props.href as any}>
        <HeadAnchor
          $sm={{
            display: 'none',
          }}
        >
          {props.children}
        </HeadAnchor>
      </Link>
    </SlidingPopoverTarget>
  )
}

const SlidingPopoverContext = React.createContext({
  setActive(id: ID, layout: LayoutRectangle) {},
  close() {},
})

export const SlidingPopoverTarget = YStack.styleable<{ id: ID }>(
  ({ id, ...props }, ref) => {
    const context = React.useContext(SlidingPopoverContext)
    const [layout, setLayout_] = React.useState<LayoutRectangle>()
    const setLayout = createShallowSetState<LayoutRectangle>(setLayout_ as any)
    const triggerRef = React.useRef<HTMLElement>(null)
    const combinedRef = useComposedRefs(ref)
    const [hovered, setHovered] = React.useState(false)

    React.useEffect(() => {
      if (!hovered) return

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
    }, [hovered])

    return (
      <YStack
        onMouseEnter={() => {
          if (layout) {
            isOnLink.add(id)
            context.setActive(id, layout)
          }
          setHovered(true)
        }}
        onMouseLeave={() => {
          isOnLink.delete(id)
          setHovered(false)
        }}
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

const order = ['', 'core', 'compiler', 'ui', 'theme', 'menu']

const HeaderLinksPopoverContent = React.memo((props: { active: ID | '' }) => {
  const [active, setActive] = React.useState<ID>(
    props.active === '' ? 'menu' : props.active
  )
  if (active !== props.active && props.active !== '') {
    setActive(props.active)
  }

  const context = React.useContext(SlidingPopoverContext)
  const last = React.useRef(active)

  const curI = order.indexOf(active)
  const lastI = order.indexOf(last.current)
  const going = curI > lastI ? 1 : -1

  React.useEffect(() => {
    last.current = active
  }, [active])

  const heights = {
    core: 1400,
    compiler: 117,
    ui: 1400,
    theme: 140,
    menu: 390,
  }

  return (
    <Popover.Content
      onMouseEnter={() => {
        isOnMenu = true
      }}
      onMouseLeave={() => {
        isOnMenu = false
      }}
      enableAnimationForPositionChange
      animation="medium"
      bg="$background08"
      backdropFilter="blur(40px)"
      maxHeight="90vh"
      maxWidth={360}
      elevation="$8"
      padding={0}
      br="$6"
      borderWidth={0}
      opacity={1}
      y={0}
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

      <YStack
        onPressOut={() => {
          context.close()
        }}
        width={290}
        transition="all ease-in 200ms"
        mih={`calc(min(${heights[active]}px, 80vh))`}
        ov="hidden"
        flex={1}
        br="$6"
      >
        <AnimatePresence custom={{ going }} initial={false}>
          <HeaderMenuContents key={active} id={active} />
        </AnimatePresence>
      </YStack>
    </Popover.Content>
  )
})

const HeaderMenuContents = (props: { id: ID }) => {
  const content = (() => {
    if (props.id === 'menu') {
      return <HeaderMenuMoreContents />
    }
    if (props.id === 'theme') {
      return (
        <YStack>
          <PromoCardTheme />
        </YStack>
      )
    }
    return <DocsMenuContents inMenu section={props.id} />
  })()

  return (
    <Frame>
      <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <YStack miw={230} p="$3">
          {content}
        </YStack>
      </Popover.ScrollView>
    </Frame>
  )
}

const HeaderMenuMoreContents = () => {
  const userSwr = useUser()

  return (
    <YStack gap="$2" aria-label="Home menu contents">
      <XStack fw="wrap" f={1} gap="$2" w="100%" $gtSm={{ dsp: 'none' }}>
        <Link asChild href="/docs/intro/introduction">
          <HeadAnchor grid half>
            Core
          </HeadAnchor>
        </Link>

        <Link asChild href="/docs/intro/compiler-install">
          <HeadAnchor grid half>
            Compile
          </HeadAnchor>
        </Link>

        <Link asChild href="/ui/intro">
          <HeadAnchor grid half>
            UI
          </HeadAnchor>
        </Link>

        <Link asChild href="/theme">
          <HeadAnchor grid half>
            Theme
          </HeadAnchor>
        </Link>
      </XStack>

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
        <HeadAnchor
          grid
          onPress={() => {
            accountModal.show = true
          }}
        >
          <XStack ai="center" jc="center">
            Account
            <YStack flex={10} />
            <YStack dsp={'inline-block' as any} y={-2} my={-3} als="flex-end">
              <UserAvatar size={22} />
            </YStack>
          </XStack>
        </HeadAnchor>
      )}

      <Separator bc="$color02" o={0.25} my="$2" />

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
              <YStack ml={3} dsp={'inline-block' as any} x={6} y={-1} my={-10} o={0.8}>
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

      <Link asChild href="/community">
        <HeadAnchor grid tag="a">
          Community
        </HeadAnchor>
      </Link>

      <Separator bc="$color02" o={0.25} my="$2" />

      <Link asChild href="https://github.com/tamagui/tamagui">
        <HeadAnchor target="_blank" grid>
          Github{' '}
          <YStack dsp={'inline-block' as any} y={10} my={-20} o={0.8}>
            <GithubIcon width={14} />
          </YStack>
        </HeadAnchor>
      </Link>

      <Link
        asChild
        href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1"
      >
        <HeadAnchor target="_blank" grid>
          Figma{' '}
          <YStack dsp={'inline-block' as any} y={2} my={-20} o={0.8}>
            <Figma size={14} />
          </YStack>
        </HeadAnchor>
      </Link>

      <Link asChild href="/blog">
        <HeadAnchor grid>Blog</HeadAnchor>
      </Link>

      <Link asChild href="https://github.com/sponsors/natew">
        <HeadAnchor grid target="_blank">
          Sponsor
          <YStack dsp={'inline-block' as any} y={0} my={-20} ml={12} o={0.8}>
            <ExternalLink size={10} o={0.5} />
          </YStack>
        </HeadAnchor>
      </Link>
    </YStack>
  )
}

const HeadAnchor = styled(Paragraph, {
  tag: 'a',
  fontFamily: '$mono',
  px: '$4',
  py: '$4',
  cursor: 'pointer',
  fontSize: 16,
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

const Frame = styled(YStack, {
  animation: 'medium',
  br: '$5',
  ov: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  x: 0,
  opacity: 1,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 50 : -50,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 50 : -50,
          opacity: 0,
        },
      }),
    },
  } as const,
})
