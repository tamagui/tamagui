import { LogoWords, setTintFamily, TamaguiLogo, ThemeTint, useTint } from '@tamagui/logo'
import { ExternalLink, Figma, Menu } from '~/components/icons'
import { isTouchable, useGet, useMedia } from '@tamagui/web'
import { useFocusEffect, usePathname, useRouter } from 'one'
import * as React from 'react'
import type { LayoutRectangle } from '@tamagui/react-native-types'
import { useWindowDimensions } from '@tamagui/use-window-dimensions'
import {
  Adapt,
  AnimatePresence,
  Circle,
  debounce,
  isClient,
  Paragraph,
  Popover,
  Separator,
  Sheet,
  SizableText,
  style,
  styled,
  TooltipGroup,
  useComposedRefs,
  useDebounce,
  View,
  XGroup,
  XStack,
  YStack,
  createStyledHOC,
  type PopoverProps,
} from 'tamagui'
import { Button } from '~/components/Button'
import { PAGE_MAX_WIDTH } from '~/components/Containers'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { seasons, SeasonTogglePopover } from '~/features/site/seasons/SeasonTogglePopover'
import { ThemeToggle } from '~/features/site/theme/ThemeToggle'
import { DocsMenuContents } from '../../docs/DocsMenuContents'
import { useDocsMenu } from '../../docs/useDocsMenu'
import { AddEvenBrandIcon } from '../../icons/AddEvenBrandIcon'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { SearchButton } from './SearchButton'
import { SiteModePopover } from './SiteModePopover'
import type { HeaderProps } from './types'

const drawerContentStyle = style({ width: '100%' })

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
        position="fixed"
        t={0}
        l={0}
        r={0}
        items="center"
        pointerEvents="none"
        justify="center"
        z={10000}
        px="md:0-5"
        className="all ease-out s1"
      >
        <XStack
          pointerEvents="auto"
          width="100%"
          maxW={PAGE_MAX_WIDTH}
          position="relative"
        >
          <XStack
            className="ease-out all ms300"
            py="1 max-md:1-5"
            y={`0px max-md:-1px${isScrolled ? ' md:6px' : ''}`}
            overflow="hidden"
            contain="paint"
            width="100%"
            bg="transparent"
            rounded="10 max-md:0"
            borderColor={isScrolled ? 'transparent md:color-5' : 'transparent'}
            borderWidth="0.5px max-md:0px"
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
              position="absolute"
              inset={0}
              bg="color-2"
              className={`ease-out all ms300`}
            />
            <YStack mx="auto" px="4 max-sm:2" width="100%">
              <ThemeTint>
                <HeaderContents floating {...props} />
              </ThemeTint>
            </YStack>
          </XStack>
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className="ease-in-out all ms200"
            z={-1}
            rounded="10"
            position="absolute"
            inset={0}
            boxShadow="0 8px 20px shadow-3"
            opacity={isScrolled ? '0 md:1' : 0}
            py={isScrolled ? 'md:1-5' : undefined}
            y={isScrolled ? 'md:5px' : undefined}
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
      render="header"
      py={props.minimal ? '4' : props.floating ? 0 : '1-5'}
      z={50000}
    >
      <XStack items="center" gap="3 max-sm:1-5">
        <ThemeToggle
          size="sm"
          borderWidth={0}
          variant="quiet"
          rounded="10"
          width={32}
          height={32}
          minH={32}
          p={0}
        />

        <SearchButton
          size="sm"
          borderWidth={0}
          variant="quiet"
          rounded="10"
          width={32}
          height={32}
          minH={32}
          p={0}
        />

        <Link target="_blank" href="https://github.com/tamagui/tamagui">
          <XStack
            group
            containerType="normal"
            items="center"
            justify="center"
            width="32px xxl:auto"
            height={32}
            px="0 xxl:2"
            gap="1-5"
            rounded="10"
            opacity="0.9 hover:1"
            transition="all 150ms ease"
          >
            <GithubIcon width={16} height={16} />
            <SizableText
              display="max-xxl:none"
              color="color-12"
              opacity="0.5 group-hover:0.8"
              size="2"
            >
              GitHub
            </SizableText>
          </XStack>
        </Link>

        <SiteModePopover />
      </XStack>

      <View flex={1} />

      <XStack
        position="absolute"
        opacity="max-lg:0"
        pointerEvents="none max-lg:none"
        z={-1}
        justify="center"
        inset={0}
        items="center"
      >
        <Link href="/" aria-label="Homepage">
          <XStack
            cursor={isHome ? 'default' : 'pointer'}
            pointerEvents="auto"
            self="center"
            gap="3"
            ml="-6"
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

      <XStack height={40} justify="flex-end" pointerEvents="auto" render="nav">
        <XStack items="center" gap="1-5">
          <HeaderLinksPopover>
            <HeaderLink id="core" href="/docs/intro/introduction">
              Core
            </HeaderLink>

            <HeaderLink id="ui" href="/ui/intro">
              Components
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

  return (
    <Popover.Trigger justify="center" items="center">
      <SlidingPopoverTarget id="menu">
        <Button
          size="sm"
          circular
          width={32}
          height={32}
          p={0}
          my={-1}
          bg="transparent hover:shadow-1"
          borderWidth={0}
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
        >
          <Circle size={32} items="center" justify="center">
            <Menu size={18} />
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

      <Adapt platform="touch" when="max-md">
        <Sheet transition="medium" zIndex={100000000} modal dismissOnSnapToBottom>
          <Sheet.Container>
            <Sheet.Background />
            <Sheet.ScrollView showsVerticalScrollIndicator={false}>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
          <Sheet.Overlay z={100} bg="shadow-4" />
        </Sheet>
      </Adapt>
    </Popover>
  )
}

type ID = 'core' | 'ui' | 'theme' | 'menu'

export const HeaderLink = (props: { id: ID; children: string; href: string }) => {
  const pathname = usePathname()
  const section = getDocsSectionFromPath(pathname)
  const isActive =
    props.id === section || (props.id === 'theme' && pathname.startsWith('/theme'))

  return (
    <SlidingPopoverTarget id={props.id}>
      <Link asChild href={props.href as any}>
        <HeadAnchor
          fontFamily="mono"
          fontSize={15}
          color="color-9 hover:color-12"
          {...(isActive && { active: true })}
          display="max-sm:none"
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

export const SlidingPopoverTarget = createStyledHOC(
  YStack,
  ({ id, ...props }: { id: ID }, ref) => {
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

const order = ['', 'core', 'ui', 'theme', 'menu']

const HeaderLinksPopoverContent = React.memo((props: { active: ID | '' }) => {
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
  const isOnlyShowingMenu = useMedia()['max-md']

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
  const maxHeight = height - 150

  const heights = {
    core: Math.min(maxHeight, 1300),
    compiler: 117,
    ui: Math.min(maxHeight, 1300),
    theme: 240,
    menu: Math.min(maxHeight, isOnlyShowingMenu ? 1000 : 520),
  }

  return (
    <Popover.Content
      onMouseEnter={() => {
        isOnMenu = true
      }}
      onMouseLeave={() => {
        isOnMenu = false
      }}
      animatePosition
      transition="medium"
      bg="background-06"
      backdropFilter="blur(40px)"
      maxH="90vh"
      maxW={360}
      minW={360}
      boxShadow="0 4px 12px shadow-color"
      p={0}
      rounded="6"
      opacity="1 enter:0 exit:0"
      y="0 enter:3px exit:5px"
    >
      {/* round(v5-site size-token 4 = 44px * 0.52); the old - 11.5 offset gives 11 */}
      <Popover.Arrow transition="medium" bg="background-06" animatePosition size={23} />

      {pointerFine ? (
        <YStack
          width="100%"
          transition="200ms"
          height={heights[active]}
          maxHeight="90vh"
          overflow="hidden"
          rounded="6"
        >
          <AnimatePresence custom={{ going }} initial={false}>
            <HeaderMenuContents key={active} id={active} />
          </AnimatePresence>
        </YStack>
      ) : (
        <YStack p="4">
          <HeaderMenuContents key={active} id={active} />
        </YStack>
      )}
    </Popover.Content>
  )
})

const getDocsSectionFromPath = (pathName: string): 'core' | 'ui' | null => {
  if (!pathName || pathName === '/' || pathName === '') return null
  if (pathName.startsWith('/ui/')) return 'ui'
  if (pathName.startsWith('/docs') || pathName.startsWith('/blog')) return 'core'
  return null
}

const ActivePageDocsMenuContents = () => {
  const pathName = usePathname()
  const section = getDocsSectionFromPath(pathName)

  if (!section) return null

  return (
    <>
      <Separator bg="color-02" opacity={0.25} my="4" />
      <DocsMenuContents inMenu section={section} />
    </>
  )
}

const HeaderMenuContents = (props: { id: ID }) => {
  const isOnlyShowingMenu = useMedia()['max-md']
  const isMobile = isTouchable && isOnlyShowingMenu

  const contents = (() => {
    if (props.id === 'menu') {
      return (
        <>
          <HeaderMenuMoreContents />
          <Separator borderColor="color-02" opacity={0.25} my="1-5" />
          {isOnlyShowingMenu && (
            <>
              <ActivePageDocsMenuContents />
              <Separator borderColor="color-02" opacity={0.25} my="1-5" />
            </>
          )}
          <SeasonChooser />
        </>
      )
    }

    if (props.id === 'theme') {
      return (
        <YStack flex={1} gap="1-5" flexBasis="auto">
          <Paragraph
            pointerEvents="none"
            borderWidth={0.5}
            bg="color-6"
            rounded="5"
            opacity={0.5}
            p="4"
            size="4"
          >
            Create themes to preview them across the site.
            {`\n`}
            <Link href="/theme" theme="blue" style={{ pointerEvents: 'auto' }}>
              Go to Theme Builder →
            </Link>
          </Paragraph>
        </YStack>
      )
    }

    return <DocsMenuContents inMenu section={props.id} />
  })()

  // For mobile, render content directly without Frame wrapper
  if (isMobile) {
    return (
      <YStack width="100%" p="3">
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
        contentContainerStyle={drawerContentStyle}
      >
        <YStack width="100%" p="3">
          {contents}
        </YStack>
      </Popover.ScrollView>
    </Frame>
  )
}

const HeaderMenuMoreContents = () => {
  const router = useRouter()

  const handlePress = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(e.target.href)
  }

  return (
    <YStack gap="1-5" aria-label="Home menu contents">
      <YStack gap="1-5" display="md:none">
        <Link asChild href="/">
          <HeadAnchor grid>Home</HeadAnchor>
        </Link>
        <Separator bg="color-02" opacity={0.25} my="1-5" />
      </YStack>

      <XStack flex={1} flexBasis="auto" flexWrap="wrap" gap="1-5" width="100%">
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
            Components
          </HeadAnchor>
        </Link>

        <Link asChild href="/theme" onPress={handlePress}>
          <HeadAnchor grid half>
            Theme
          </HeadAnchor>
        </Link>
      </XStack>

      <Separator bg="color-02" opacity={0.25} my="1-5" />

      <Link asChild href="/takeout">
        <HeadAnchor grid render="a">
          <XStack items="center">
            <span>Takeout</span>
            <YStack display={'inline-block' as any} x={6} my={-20} opacity={0.8}>
              <TakeoutIcon scale={0.65} />
            </YStack>
          </XStack>
          <SizableText size="2" color="color-9">
            Starter Kit
          </SizableText>
        </HeadAnchor>
      </Link>

      <Link asChild href="/bento">
        <HeadAnchor grid render="a">
          <XStack items="center">
            <span>Bento</span>
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
          <SizableText size="2" color="color-9">
            Copy-paste UI
          </SizableText>
        </HeadAnchor>
      </Link>

      <Link asChild href="https://addeven.com" target="_blank">
        <HeadAnchor grid render="a">
          <XStack items="center">
            <SizableText>Add Even</SizableText>
            <YStack
              ml={3}
              display={'inline-block' as any}
              x={6}
              y={-1}
              my={-10}
              opacity={0.8}
            >
              <AddEvenBrandIcon scale={0.65} />
            </YStack>
          </XStack>
          <SizableText size="2" color="color-9">
            Expert Consulting
          </SizableText>
        </HeadAnchor>
      </Link>

      <Separator borderColor="color-02" opacity={0.25} my="1-5" />

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

const SeasonChooser = () => {
  const { name } = useTint()

  return (
    <XStack flexWrap="wrap" items="center" justify="center">
      {Object.keys(seasons).map((seasonName) => {
        const isActive = name === seasonName
        return (
          <Circle
            key={seasonName}
            size="11"
            cursor="pointer"
            items="center"
            justify="center"
            bg={
              isActive
                ? 'color-5 hover:color-5 press:color-5'
                : 'hover:background-hover press:background-press'
            }
            onPress={() => {
              setTintFamily(seasonName as any)
            }}
          >
            <SizableText size="5">{seasons[seasonName]}</SizableText>
          </Circle>
        )
      })}
    </XStack>
  )
}

const HeadAnchor = styled(Paragraph, {
  render: 'a',
  px: '4',
  py: '3',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: '25px',
  color: 'color-11 hover:color',
  rounded: 'hover:3',
  outlineColor: 'focus-visible:outline-color',
  outlineWidth: 'focus-visible:2px',
  outlineStyle: 'focus-visible:solid',
  outlineOffset: 'focus-visible:-2px',
  opacity: 'press:0.25',
  variants: {
    active: {
      true: {
        color: 'color-12',
      },
    },

    grid: {
      true: {
        width: '100%',
        flex: 1,
        flexBasis: 'auto',
        paddingTop: '1-5',
        paddingBottom: '1-5',
        px: '4',
        backgroundColor: 'hover:color-mix(in srgb, var(--color-8) 10%, transparent 50%)',
      },
    },

    half: {
      true: {
        maxWidth: '48.5%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      },
    },
  } as const,
})

const Frame = styled(YStack, {
  className: 'header-popover-frame',
  transition: '300ms',
  flex: 1,
  rounded: '5',
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
    going: styled.dynamic<number>((going) => ({
      x: `enter:${going > 0 ? 50 : -50}px exit:${going < 0 ? 50 : -50}px`,
      opacity: 'enter:0 exit:0',
      zIndex: 'exit:0',
    })),
  } as const,
})
