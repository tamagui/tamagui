import { LogoWords, TamaguiLogo, ThemeTint, useTint } from '@tamagui/logo'
import { ExternalLink, Figma, LogIn, Menu, Check } from '@tamagui/lucide-icons'
import { isTouchable, useGet, useMedia } from '@tamagui/web'
import { useFocusEffect, usePathname, useRouter } from 'one'
import * as React from 'react'
import { useWindowDimensions, type LayoutRectangle } from 'react-native'
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
  useDebounce,
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
import { UpgradeToProPopover } from './UpgradeToProPopover'
import { UserAvatar } from './UserAvatar'
import type { HeaderProps } from './types'
import { useLoginLink } from '../../auth/useLoginLink'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { useBentoStore } from '../../bento/BentoStore'
import { useBentoTheme } from '../../bento/useBentoTheme'

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
        position="fixed"
        t={0}
        l={0}
        r={0}
        items="center"
        pointerEvents="none"
        justify="center"
        z={50000}
        className="all ease-out s1"
        $gtSm={{
          px: '$1',
        }}
      >
        <XStack pointerEvents="auto" width="100%" maxW={1200} position="relative">
          <XStack
            className={`ease-out all ms300`}
            py="$1.5"
            y={bannerHeight}
            overflow="hidden"
            contain="paint"
            width="100%"
            bg="transparent"
            rounded="$10"
            $sm={{
              rounded: 0,
              borderWidth: 0,
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
              position="absolute"
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
              opacity={isScrolled ? 0.6 : 0}
              className={`ease-out all ms300`}
              fullscreen
              bg="$color2"
              $theme-dark={{
                bg: '$color7',
              }}
            />
            <YStack mx="auto" px="$4" width="100%">
              <ThemeTint>
                <HeaderContents floating {...props} />
              </ThemeTint>
            </YStack>
          </XStack>
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className={`ease-in-out all ms200`}
            z={-1}
            rounded="$10"
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
      <YStack height={54} width="100%" />
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
      items="center"
      position="relative"
      tag="header"
      py={props.minimal ? '$4' : props.floating ? 0 : '$2'}
      z={50000}
    >
      <XStack items="center" gap="$4">
        <TooltipGroup delay={tooltipDelay}>
          <XGroup maxH={32} bg="transparent" items="center" size="$4">
            <XGroup.Item>
              <ThemeToggle borderWidth={0} chromeless />
            </XGroup.Item>
          </XGroup>
        </TooltipGroup>

        <SearchButton size="$2" rounded="$10" elevation="$0.5" />

        <Link target="_blank" href="https://github.com/tamagui/tamagui">
          <XStack group containerType="normal">
            <XStack
              items="center"
              gap="$2"
              p="$2"
              opacity={0.9}
              hoverStyle={{ opacity: 1 }}
            >
              <GithubIcon width={22} />
              <>
                <SizableText
                  $xl={{ display: 'none' }}
                  size="$3"
                  color="$color12"
                  opacity={0.5}
                  $group-hover={{
                    opacity: 0.8,
                  }}
                >
                  GitHub
                </SizableText>
              </>
            </XStack>
          </XStack>
        </Link>

        <UpgradeToProPopover />
      </XStack>

      <View flex={1} />

      <XStack
        position="absolute"
        $md={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        z={-1}
        justify="center"
        fullscreen
        pointerEvents="none"
        items="center"
      >
        <Link href="/" aria-label="Homepage">
          <XStack
            cursor={isHome ? 'default' : 'pointer'}
            pointerEvents="auto"
            self="center"
            gap="$3"
            ml="$-5"
            items="center"
          >
            <SeasonTogglePopover>
              <YStack
                cursor="pointer"
                opacity={1}
                {...(isHome && {
                  onPress(e) {
                    e.preventDefault()
                    e.stopPropagation()
                    tint.setNextTint()
                  },
                })}
              >
                <TamaguiLogo downscale={2.6} />
              </YStack>
            </SeasonTogglePopover>
            <LogoWords animated />
          </XStack>
        </Link>
      </XStack>

      <XStack height={40} justify="flex-end" pointerEvents="auto" tag="nav">
        <XStack items="center" gap="$2">
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
  const context = React.useContext(SlidingPopoverContext)
  const userSwr = useUser()
  const haveUser = !!userSwr.data?.user

  return (
    <Popover.Trigger>
      <SlidingPopoverTarget id="menu">
        <Button
          size="$3"
          my={10}
          bg="transparent"
          rounded="$10"
          borderWidth={2}
          px="$2"
          onPress={(e) => {
            if (isTouchable) {
              setOpen(!open)
              // Ensure the active state is set for the menu to open properly on mobile
              // On mobile, we just need to set the active state, not the layout
              // The Sheet doesn't need positioning data
              context.setActive('menu')
              return
            }
            if (isOnLink) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
            if (open) {
              setOpen(false)
              return
            }
          }}
          aria-label="Open the main menu"
          hoverStyle={{
            borderColor: 'color-mix(in srgb, var(--color10) 30%, transparent 60%)' as any,
          }}
        >
          <Circle size={34} items="center" justify="center">
            {haveUser ? <UserAvatar /> : <Menu size={16} />}
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

  const check = React.useRef<any>(undefined)

  const checkForClose = () => {
    if (isTouchable) return
    check.current = setInterval(() => {
      if (!isOnMenu && !isOnLink.size) {
        close()
      }
    }, 500)
  }

  const cancelCheckForClose = () => {
    if (isTouchable) return
    clearInterval(check.current)
  }

  return (
    <Popover
      disableRTL
      hoverable={{
        delay: 0,
        restMs: 0,
        move: false,
        enabled: !isTouchable,
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
          transition="bouncy"
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
          <Sheet.Overlay z={100} bg="$shadow4" />
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
  setActive(id: ID, layout?: LayoutRectangle) {},
  close() {},
})

export const SlidingPopoverTarget = YStack.styleable<{ id: ID }>(
  ({ id, ...props }, ref) => {
    const context = React.useContext(SlidingPopoverContext)
    const [layout, setLayout] = React.useState<LayoutRectangle | undefined>()
    const triggerRef = React.useRef<HTMLElement>(null)
    const combinedRef = useComposedRefs(ref)
    const [hovered, setHovered] = React.useState(false)
    const getLayout = useGet(layout)

    React.useEffect(() => {
      if (!hovered) return

      const handleMove = debounce(() => {
        const layout = triggerRef.current?.getBoundingClientRect()
        if (layout) {
          setLayout(layout as any)
        }
      }, 32)
      window.addEventListener('resize', handleMove)
      return () => {
        window.removeEventListener('resize', handleMove)
      }
    }, [hovered])

    const setActive = () => {
      const layout = getLayout()
      if (layout) {
        isOnLink.add(id)
        context.setActive(id, layout)
      }
      setHovered(true)
    }

    const setActiveDebounced = useDebounce(setActive, 100)

    return (
      <YStack
        onMouseEnter={setActiveDebounced}
        onMouseLeave={() => {
          setActiveDebounced.cancel()
          isOnLink.delete(id)
          setHovered(false)
        }}
        onPress={() => {
          if (isTouchable) return
          setActiveDebounced.cancel()
          setTimeout(() => {
            context.close()
          }, 400)
        }}
        onLayout={(e) => {
          React.startTransition(() => {
            setLayout({
              ...e.nativeEvent.layout,
              // @ts-ignore
              x: e.nativeEvent.layout.pageX,
              // @ts-ignore
              y: e.nativeEvent.layout.pageY,
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
  const { data } = useUser()
  const [active, setActive] = React.useState<ID>(
    props.active === '' ? 'menu' : props.active
  )

  // Fix: Move setState to useEffect to avoid React #185 error (setState during render)
  React.useEffect(() => {
    if (props.active !== '' && active !== props.active) {
      setActive(props.active)
    }
  }, [props.active])

  const pathname = usePathname()

  const context = React.useContext(SlidingPopoverContext)
  const pointerFine = !isTouchable
  const isOnlyShowingMenu = useMedia().maxMd

  useFocusEffect(() => {
    context.close()
  }, [pathname])

  const last = React.useRef(active)

  const curI = order.indexOf(active)
  const lastI = order.indexOf(last.current)
  const going = curI > lastI ? 1 : -1

  React.useEffect(() => {
    last.current = active
  }, [active])

  const { height } = useWindowDimensions()
  const maxHeight = height - 50

  const heights = {
    core: Math.min(maxHeight, 1300),
    compiler: 117,
    ui: Math.min(maxHeight, 1300),
    theme: data?.user ? 300 : 240,
    menu: Math.min(maxHeight, isOnlyShowingMenu ? 1000 : 390),
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
      transition="medium"
      bg="$color3"
      backdropFilter="blur(40px)"
      maxH="90vh"
      maxW={360}
      minW={360}
      elevation="$2"
      borderWidth={3}
      borderColor="$color2"
      p={0}
      rounded="$6"
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
      <Popover.Arrow bg="$color3" size="$3.5" />

      {pointerFine ? (
        <YStack
          width="100%"
          transition="200ms"
          height={heights[active]}
          maxHeight="90vh"
          overflow="hidden"
          rounded="$6"
        >
          <AnimatePresence custom={{ going }} initial={false}>
            <HeaderMenuContents key={active} id={active} />
          </AnimatePresence>
        </YStack>
      ) : (
        <YStack p="$4">
          <HeaderMenuContents key={active} id={active} />
        </YStack>
      )}
    </Popover.Content>
  )
})

const getDocsSectionFromPath = (pathName: string): 'core' | 'compiler' | 'ui' | null => {
  if (!pathName || pathName === '/' || pathName === '') return null
  if (pathName.startsWith('/ui/')) return 'ui'
  if (
    pathName.startsWith('/docs/intro/compiler') ||
    pathName.startsWith('/docs/intro/benchmarks') ||
    pathName.startsWith('/docs/intro/why-a-compiler')
  )
    return 'compiler'
  if (
    pathName.startsWith('/docs') ||
    pathName.startsWith('/community') ||
    pathName.startsWith('/blog')
  )
    return 'core'
  return null
}

const ActivePageDocsMenuContents = () => {
  const pathName = usePathname()
  const section = getDocsSectionFromPath(pathName)

  if (!section) return null

  return (
    <>
      <Separator bg="$color02" opacity={0.25} my="$4" />
      <DocsMenuContents inMenu section={section} />
    </>
  )
}

const HeaderMenuContents = (props: { id: ID }) => {
  const { data } = useUser()
  const { updateGenerate } = useThemeBuilderStore()
  const bentoStore = useBentoStore()
  const themeHistories = data?.themeHistories || []
  const bentoTheme = useBentoTheme()
  const pathName = usePathname()
  const isOnBentoPage = pathName.startsWith('/bento')
  const isOnlyShowingMenu = useMedia().maxMd
  const isMobile = isTouchable && isOnlyShowingMenu

  const contents = (() => {
    /**
     * When the theme_histories are fetched,
     * we can apply one of them to Bento components from dropdown
     */
    if (props.id === 'menu') {
      return (
        <>
          <HeaderMenuMoreContents />
          {isOnlyShowingMenu && <ActivePageDocsMenuContents />}
        </>
      )
    }

    if (props.id === 'theme') {
      return (
        <YStack flex={1} gap="$2">
          {!isOnBentoPage || !themeHistories.length ? (
            <>
              <PromoCardTheme />
              <Paragraph
                pointerEvents="none"
                borderWidth={0.5}
                bg="$color6"
                rounded="$5"
                fontFamily="$mono"
                size="$4"
                opacity={0.5}
                p="$4"
              >
                Once you create themes, visit the Bento page and open this menu to preview
                them.
                {`\n`}
                <Link href="/bento" theme="blue" style={{ pointerEvents: 'auto' }}>
                  Go to Bento to preview your themes →
                </Link>
              </Paragraph>
            </>
          ) : (
            <YStack gap="$2">
              <XStack>
                <HeadAnchor
                  grid
                  items="center"
                  onPress={() => {
                    bentoStore.disableCustomTheme = !bentoStore.disableCustomTheme
                  }}
                >
                  <SizableText size="$3" color="$color11" ellipsis>
                    Enabled
                  </SizableText>

                  {bentoTheme.enabled ? <Check ml="$2" size={12} /> : null}
                </HeadAnchor>
                <HeadAnchor
                  grid
                  onPress={() => {
                    bentoStore.disableTint = !bentoStore.disableTint
                  }}
                >
                  <SizableText size="$3" color="$color11" ellipsis>
                    Tint
                  </SizableText>

                  {!bentoStore.disableTint ? <Check ml="$2" size={12} /> : null}
                </HeadAnchor>
              </XStack>

              <Separator mb="$3" opacity={0.5} />

              <SizableText
                size="$3"
                fontFamily="$mono"
                px="$4"
                color="$color10"
                theme="alt2"
              >
                Recent Themes
              </SizableText>

              {themeHistories.map((history) => (
                <HeadAnchor
                  key={history.id}
                  grid
                  onPress={() => updateGenerate(history.theme_data)}
                >
                  <XStack items="center" justify="space-between">
                    <SizableText size="$3" color="$color11" ellipsis>
                      {history.search_query}
                    </SizableText>
                  </XStack>
                </HeadAnchor>
              ))}

              {themeHistories.length === 0 && (
                <YStack p="$4" items="center">
                  <SizableText size="$2" theme="alt2">
                    {data?.user ? 'No theme history yet' : 'Login to save themes'}
                  </SizableText>
                </YStack>
              )}
            </YStack>
          )}
        </YStack>
      )
    }

    return <DocsMenuContents inMenu section={props.id} />
  })()

  // For mobile, render content directly without Frame wrapper
  if (isMobile) {
    return (
      <YStack width="100%" p="$3">
        {contents}
      </YStack>
    )
  }

  // For desktop, use Frame wrapper
  return (
    <Frame>
      {/* BUG: when adapted to sheet this scrollview will get scroll events not the inner one */}
      <Popover.ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          width: '100%',
        }}
        contentContainerStyle={{ width: '100%' }}
      >
        <YStack width="100%" p="$3">
          {contents}
        </YStack>
      </Popover.ScrollView>
    </Frame>
  )
}

const HeaderMenuMoreContents = () => {
  const userSwr = useUser()
  const router = useRouter()
  const { handleLogin } = useLoginLink()
  const context = React.useContext(SlidingPopoverContext)

  const handlePress = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(e.target.href)
  }

  return (
    <YStack gap="$2" aria-label="Home menu contents">
      <YStack gap="$2" $gtSm={{ display: 'none' }}>
        <Link asChild href="/">
          <HeadAnchor grid>Home</HeadAnchor>
        </Link>
        <Separator bg="$color02" opacity={0.25} my="$2" />
      </YStack>

      <XStack flexWrap="wrap" flex={1} gap="$2" width="100%">
        <Link asChild href="/docs/intro/introduction">
          <HeadAnchor grid half>
            Core
          </HeadAnchor>
        </Link>

        <Link asChild href="/docs/intro/compiler-install" onPress={handlePress}>
          <HeadAnchor grid half>
            Compiler
          </HeadAnchor>
        </Link>

        <Link asChild href="/ui/intro" onPress={handlePress}>
          <HeadAnchor grid half>
            UI
          </HeadAnchor>
        </Link>

        <Link asChild href="/theme" onPress={handlePress}>
          <HeadAnchor grid half>
            Theme
          </HeadAnchor>
        </Link>
      </XStack>

      <Separator bg="$color02" opacity={0.25} my="$2" />

      {!userSwr.data?.userDetails && (
        <HeadAnchor grid onPress={handleLogin}>
          Login
          <YStack display={'inline-block' as any} y={2} x={10} self="flex-end">
            <LogIn color="$color10" size={14} />
          </YStack>
        </HeadAnchor>
      )}

      {userSwr.data?.userDetails && (
        <HeadAnchor
          grid
          onPress={() => {
            context.close()
            accountModal.show = true
          }}
        >
          <XStack items="center" justify="center">
            Account
            <YStack flex={10} />
            <YStack display={'inline-block' as any} y={-2} my={-3} self="flex-end">
              <UserAvatar size={22} />
            </YStack>
          </XStack>
        </HeadAnchor>
      )}

      <Separator bg="$color02" opacity={0.25} my="$2" />

      <XStack flexWrap="wrap" flex={1} gap="$2" width="100%">
        <Link asChild href="/takeout">
          <HeadAnchor grid half tag="a">
            <XStack items="center">
              <span>Takeout </span>
              <YStack display={'inline-block' as any} x={6} my={-20} opacity={0.8}>
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
            <XStack items="center">
              <span>Bento </span>
              <YStack
                ml={3}
                display={'inline-block' as any}
                x={6}
                y={-1}
                my={-10}
                opacity={0.8}
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
      <Separator bg="$color02" opacity={0.25} my="$2" />

      <Link asChild href="/community">
        <HeadAnchor grid tag="a">
          Community
        </HeadAnchor>
      </Link>

      <Separator borderColor="$color02" opacity={0.25} my="$2" />

      <Link asChild href="https://github.com/tamagui/tamagui">
        <HeadAnchor target="_blank" grid>
          Github{' '}
          <YStack display={'inline-block' as any} y={10} my={-20} opacity={0.8}>
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
          <YStack display={'inline-block' as any} y={2} my={-20} opacity={0.8}>
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
          <YStack display={'inline-block' as any} y={0} my={-20} ml={12} opacity={0.8}>
            <ExternalLink size={10} opacity={0.5} />
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
    rounded: '$3',
  },

  pressStyle: {
    opacity: 0.25,
  },

  variants: {
    grid: {
      true: {
        fontWeight: '200',
        letterSpacing: 1,
        textTransform: 'unset',
        width: '100%',
        flex: 1,
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
  className: 'header-popover-frame',
  transition: 'medium',
  flex: 1,
  rounded: '$5',
  overflow: 'hidden',
  position: 'absolute',
  t: 0,
  l: 0,
  r: 0,
  b: 0,
  z: 1,
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
