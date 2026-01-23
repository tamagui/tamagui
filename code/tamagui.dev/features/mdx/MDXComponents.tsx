import { TamaguiLogo, ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import {
  Asterisk,
  Box,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
  File,
  Link as LinkIcon,
} from '@tamagui/lucide-icons'
import type { Href } from 'one'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import type { ImageProps, XStackProps } from 'tamagui'
import {
  Adapt,
  Button,
  Card,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  Paragraph,
  Separator,
  SizableText,
  Spacer,
  Text,
  Theme,
  TooltipSimple,
  View,
  XGroup,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Code, CodeInline } from '~/components/Code'
import { CustomTabs } from '~/components/CustomTabs'
import { DataTable } from '~/components/DataTable'
import { Features } from '~/components/Features'
import { HR } from '~/components/HR'
import { LI } from '~/components/LI'
import { Link } from '~/components/Link'
import { LogoCard } from '~/components/LogoCard'
import { Notice, NoticeFrame } from '~/components/Notice'
import { OffsetBox } from '~/components/OffsetBox'
import { Preview } from '~/components/Preview'
import { ProductCard } from '~/components/ProductCard'
import { SubTitle } from '~/components/SubTitle'
import { TamaguiCard } from '~/components/TamaguiCard'
import { TamaguiExamplesCode } from '~/components/TamaguiExamples'
import { UL } from '~/components/UL'
import { SponsorButton } from '~/features/docs/SponsorButton'
import { ExternalIcon } from '~/features/icons/ExternalIcon'
import { BenchmarkChart } from '~/features/site/benchmarks/BenchmarkChart'
import { BenchmarkChartNative } from '~/features/site/benchmarks/BenchmarkChartNative'
import { BenchmarkChartWeb } from '~/features/site/benchmarks/BenchmarkChartWeb'
import { MediaPlayer } from '~/features/site/home/MediaPlayer'
import { SocialLinksRow } from '~/features/site/home/SocialLinksRow'
import { unwrapText } from '~/helpers/unwrapText'
import { PACKAGE_MANAGERS, pkgCommands, useBashCommand } from '~/hooks/useBashCommand'
import { useClipboard } from '~/hooks/useClipboard'
import { DocCodeBlock } from '../docs/DocsCodeBlock'
import { HeroContainer } from '../docs/HeroContainer'
import { Highlights } from '../docs/Highlights'
import { InlineTabs } from '../docs/InlineTabs'
import { PropsTable } from '../docs/PropsTable'
import { VersionSwitcher } from '../docs/VersionSwitcher'
import * as Demos from '../docs/demos'
import { ExampleAnimations } from '../site/home/HomeAnimations'
import { TabsTabProps } from 'tamagui'
import { Tab } from '~/components/RovingTabs'
import { SimpleTable } from './SimpleTable'

if (!React.version.startsWith('19')) {
  console.error(`\n\n\n\Not on React 19 ❌\n\n\n\n`)
}

const IntroParagraph = ({ children, large, disableUnwrapText, ...props }: any) => {
  return (
    <Paragraph
      render="p"
      // ff="$mono"
      size={large ? '$8' : '$7'}
      mb="$4"
      $sm={{
        size: '$6',
      }}
      {...props}
    >
      {disableUnwrapText ? children : unwrapText(children)}
    </Paragraph>
  )
}

const TableFrame = styled(YStack, {
  borderWidth: 1,
  borderColor: '$borderColor',
  rounded: '$4',
  overflow: 'hidden',
  my: '$4',
})

const Table = ({ heading, children, ...props }) => {
  return (
    <TableFrame className="no-scrollbar" overflow={'scroll' as any} {...props}>
      {!!heading && (
        <TableCell size="$4" bg="$color1" fontWeight="500" color="$color9">
          {heading}
        </TableCell>
      )}
      <XStack minW="100%" items="stretch">
        {children}
      </XStack>
    </TableFrame>
  )
}

const code = (props) => {
  const {
    showMore,
    hero,
    line,
    scrollable,
    className,
    children,
    id,
    showLineNumbers,
    collapsible,
    ...rest
  } = props
  if (!className) {
    return <CodeInline>{unwrapText(children)}</CodeInline>
  }
  return (
    <YStack mt="$3">
      <DocCodeBlock
        isHighlightingLines={line !== undefined}
        className={className}
        isHero={hero !== undefined}
        showMore={showMore}
        showLineNumbers={showLineNumbers !== undefined}
        {...rest}
      >
        {children}
      </DocCodeBlock>
    </YStack>
  )
}

const TableCell = styled(Paragraph, {
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
  flexDirection: 'row',
  items: 'center',
  position: 'relative',
  flex: 1,
  flexBasis: 'auto',
  justify: 'center',
  text: 'center',
  height: '$4',
  p: '$2',
  px: '$3',
  size: '$5',
  ellipsis: true,

  variants: {
    head: {
      true: {
        bg: '$color1',
      },
    },
    highlight: {
      true: {
        bg: '$yellow2',
      },
    },
  } as const,
})

const TableCol = styled(YStack, {
  borderRightWidth: 1,
  borderRightColor: '$borderColor',
  flex: 1,
  flexBasis: 'auto',
  mr: -1,
  flexDirection: 'column',
})

const TableHighlight = styled(YStack, {
  fullscreen: true,
  bg: '$yellow1',
})

const componentsIn = {
  Tabs: CustomTabs,
  InlineTabs: InlineTabs,

  SocialLinksRow: () => (
    <YStack mt="$6" mx="$-4">
      <SocialLinksRow />
    </YStack>
  ),

  Wide: (props) => (
    <YStack mx="$-8" $sm={{ mx: '$-2' }}>
      {props.children}
    </YStack>
  ),

  Adapt,

  Table,
  TableCell,
  TableHighlight,
  TableCol,

  Spacer,
  ExampleAnimations,
  ScrollView,
  Features,
  Text,
  Paragraph,
  OffsetBox,
  YStack,
  XStack,
  Theme,
  BenchmarkChart,
  Separator,
  Code,
  HeroContainer,
  BenchmarkChartNative,
  BenchmarkChartWeb,
  TooltipSimple,

  ...Demos,

  TamaguiDemo: () => {
    return <TamaguiLogo />
  },

  Highlights,
  VersionSwitcher,
  ThemeTint,
  PropsTable,
  DataTable,
  Description: SubTitle,
  UL,
  LI,
  Link,
  Strong: (props) => (
    <Paragraph render="strong" fontSize="inherit" fontWeight="700" {...props} />
  ),

  TamaguiExamplesCode,

  InstallBanner: ({ name = '' }) => {
    const {
      transformedCommand,
      isInstallCommand,
      isExecCommand,
      isCreateCommand,
      selectedPackageManager,
      setPackageManager,
    } = useBashCommand(`yarn add ${name}`, 'language-bash')

    const { transformedCommand: tamaguiCommand } = useBashCommand(
      `npm install tamagui`,
      'language-bash'
    )
    const { onCopy, hasCopied } = useClipboard(transformedCommand)
    const tamaguiCmdClip = useClipboard(tamaguiCommand)

    const CopyIcon = hasCopied ? Check : Copy
    const CopyIcon2 = tamaguiCmdClip.hasCopied ? Check : Copy

    return (
      <XStack flexWrap="wrap" items="center" gap="$4">
        {name && (
          <ThemeTint>
            <TooltipSimple
              restMs={1200}
              delay={{
                open: 1200,
                close: 0,
              }}
              label={hasCopied ? 'Copied' : 'Copy to clipboard'}
            >
              <XStack
                items="center"
                gap="$2"
                my="$1"
                py="$1"
                px="$2"
                self="flex-start"
                bg="$color3"
                rounded="$3"
                cursor="pointer"
                onPress={onCopy}
              >
                <SizableText color="$color11">{transformedCommand}</SizableText>

                <CopyIcon
                  p="$0.5"
                  size={16}
                  color="$color10"
                  hoverStyle={{
                    color: '$color2',
                  }}
                />
              </XStack>
            </TooltipSimple>
          </ThemeTint>
        )}

        {(isInstallCommand || isExecCommand || isCreateCommand) && (
          <>
            <TooltipSimple label="« Individually or all-in-one »">
              <XStack items="center">
                <SizableText pointerEvents="none" size="$3">
                  or
                </SizableText>
                <Asterisk size={12} y={-8} />
              </XStack>
            </TooltipSimple>

            <ThemeTintAlt>
              <TooltipSimple
                restMs={1200}
                delay={{
                  open: 1200,
                  close: 0,
                }}
                label={tamaguiCmdClip.hasCopied ? 'Copied' : 'Copy to clipboard'}
              >
                <XStack
                  items="center"
                  gap="$2"
                  my="$1"
                  py="$1"
                  px="$2"
                  self="flex-start"
                  bg="$color3"
                  rounded="$3"
                  cursor="pointer"
                  onPress={tamaguiCmdClip.onCopy}
                >
                  <SizableText color="$color11">{tamaguiCommand}</SizableText>

                  <CopyIcon2
                    p="$0.5"
                    size={16}
                    color="$color10"
                    hoverStyle={{
                      color: '$color2',
                    }}
                  />
                </XStack>
              </TooltipSimple>
            </ThemeTintAlt>
          </>
        )}

        <XStack gap="$2">
          {Object.keys(pkgCommands).map((c) => {
            const isActive = selectedPackageManager === c
            return (
              <SizableText
                cursor="pointer"
                onPress={() => {
                  setPackageManager(c)
                }}
                color="$color12"
                opacity={isActive ? 0.8 : 0.5}
                hoverStyle={{
                  opacity: 0.8,
                }}
                key={c}
              >
                {c}
              </SizableText>
            )
          })}
        </XStack>
      </XStack>
    )
  },

  TLDR: (props) => {
    return (
      <YStack
        $gtMd={{ mx: '$-4' }}
        mt="$5"
        mb="$3"
        px="$6"
        py="$2"
        rounded="$6"
        borderWidth={1}
        opacity={0.8}
        borderColor="$borderColor"
        {...props}
      />
    )
  },

  Button,

  Beta: () => (
    <Button
      aria-label="Beta blog post"
      pointerEvents="none"
      size="$2"
      theme="yellow"
      position="absolute"
      t={-15}
      r={-25}
      rotate="5deg"
    >
      Beta
    </Button>
  ),

  IntroParagraph,

  Grid: (props) => <XStack flexWrap="wrap" jc="space-between" {...props} />,
  Card: TamaguiCard,

  LogoCard: LogoCard,
  NextJSRouterCard: (props) => {
    return (
      <LogoCard
        icon={props.title.startsWith('Pages') ? <File size="$1" /> : <Box size="$1" />}
        {...props}
      />
    )
  },

  Note: (props) => <YStack render="aside" mt="$5" mb="$5" borderRadius="$3" {...props} />,

  Notice,

  h1: (props) => (
    <H1 fontFamily="$mono" width="max-content" pos="relative" mb="$2" {...props} />
  ),

  h2: ({ children, ...props }) => (
    <H2
      position="relative"
      width={`fit-content` as any}
      pt="$6"
      mb="$3"
      data-heading
      {...props}
    >
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading pt="$6" mb="$2" id={id}>
      <H3
        maxW="100%"
        position="relative"
        width={`fit-content` as any}
        id={id}
        opacity={0.7}
        data-heading
        fontSize={25}
        fontWeight="700"
        {...props}
      >
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),

  h4: (props) => (
    <H4
      position="relative"
      width={`fit-content` as any}
      mt="$5"
      mb="$2"
      {...props}
      fontWeight="700"
    />
  ),

  h5: (props) => <H5 fontWeight="600" mt="$4" {...props} />,

  p: (props) => (
    <Paragraph className="docs-paragraph" display="block" size="$6" my="$2" {...props} />
  ),

  a: ({ href = '', children, ...props }) => {
    return (
      <Link className="link" href={href as Href} asChild>
        <Paragraph
          render="a"
          // @ts-ignore
          fontSize="inherit"
          display="inline"
          cursor="pointer"
          focusVisibleStyle={{
            outlineColor: '$outlineColor',
            outlineWidth: 2,
            outlineStyle: 'solid',
            outlineOffset: 2,
          }}
          {...props}
        >
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text
                // @ts-ignore
                fontSize="inherit"
                display="inline-flex"
                y={2}
                ml={-1}
              >
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Paragraph>
      </Link>
    )
  },

  hr: HR,

  ul: ({ children }) => {
    return (
      <UL render="ul" my="$4">
        {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
      </UL>
    )
  },

  ol: (props) => <YStack {...props} render="ol" mb="$3" />,

  li: (props) => {
    return (
      <LI
        render="li"
        size="$6"
        mb="$1.5"
        className="docs-paragraph"
        style={{
          listStyleType: 'disc',
        }}
      >
        {props.children}
      </LI>
    )
  },

  strong: (props) => (
    <Paragraph render="strong" fontSize="inherit" {...props} fontWeight="700" />
  ),

  img: ({ ...props }) => (
    <YStack render="span" my="$6">
      {/* TODO make this a proper <Image /> component */}
      <YStack render="img" {...props} maxW="100%" />
    </YStack>
  ),

  pre: ({ children }) => <>{children}</>,

  code,

  Image: ({
    children,
    size,
    overlap,
    linked,
    ...props
  }: ImageProps & { size?: 'hero'; overlap?: boolean; linked?: boolean }) => {
    const content = (
      <OffsetBox
        size={size}
        render="figure"
        flex={1}
        flexBasis="auto"
        mx={0}
        mb="$3"
        items="center"
        justify="center"
        overflow="hidden"
        {...(overlap && {
          mt: '$-6',
        })}
      >
        <Image maxW="100%" {...props} />
        {!!children && (
          <Text render="figcaption" lineHeight={23} color="$colorPress" mt="$2">
            {children}
          </Text>
        )}
      </OffsetBox>
    )

    if (linked) {
      return (
        <Link target="_blank" href={props.src as Href}>
          {content}
        </Link>
      )
    }

    return content
  },

  Video: ({
    small,
    large,
    src,
    children = '',
    muted = true,
    autoPlay = true,
    controls,
    size,
    ...props
  }) => (
    <YStack render="figure" mx={0} my="$6">
      <OffsetBox size={size}>
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          controls={controls}
          loop
          style={{ width: '100%', display: 'block' }}
        ></video>
      </OffsetBox>
      <Text render="figcaption" lineHeight={23} mt="$2" color="$colorPress">
        {children}
      </Text>
    </YStack>
  ),

  blockquote: ({ children, ...props }) => {
    return (
      <YStack
        my="$4"
        px="$6"
        ml="$3"
        borderLeftWidth={1}
        borderColor="$borderColor"
        justify="center"
        {...props}
      >
        <Paragraph
          fontFamily="$silkscreen"
          whiteSpace="revert"
          size="$8"
          lineHeight="$9"
          fontWeight="300"
          color="$color"
          opacity={0.65}
        >
          {unwrapText(children)}
        </Paragraph>
      </YStack>
    )
  },

  Preview: (props) => {
    return <Preview {...props} mt="$5" />
  },

  MediaPlayerDemo: ({ theme, ...props }) => {
    return (
      <Theme name={theme}>
        <MediaPlayer {...props} />
      </Theme>
    )
  },

  GroupDisabledDemo: () => {
    return (
      <XGroup items="center" disabled>
        <XGroup.Item>
          <Button>First</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>Second</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>Third</Button>
        </XGroup.Item>
      </XGroup>
    )
  },

  DemoButton: () => <Button>Hello world</Button>,

  ProductCard: ProductCard,

  SponsorButton,

  SponsorNotice: () => {
    return (
      <NoticeFrame theme="red">
        <YStack maxW="100%" gap="$4">
          <H4 color="$color10" fontFamily="$silkscreen">
            👋 Hey! Listen!
          </H4>
          <YStack overflow="hidden" flex={1} flexBasis="auto" opacity={0.85} gap="$4">
            <Paragraph>
              Tamagui is fully OSS, self-funded and built by{' '}
              <a href="https://x.com/natebirdman" target="_blank" rel="noreferrer">
                me
              </a>
              .
            </Paragraph>
            <Paragraph>
              My goal is to support Tamagui development with sponsorships that get early
              access to <a href="#sponsors">some really interesting</a> new features.
            </Paragraph>
            <SponsorButton />
          </YStack>
        </YStack>
      </NoticeFrame>
    )
  },

  Blog: {
    ThemeBuilder: {
      ExamplePalette: React.lazy(() =>
        import('../site/blog/BlogThemeBuilderExamples').then((x) => ({
          default: x.ExamplePalette,
        }))
      ),
      ExampleTemplate: React.lazy(() =>
        import('../site/blog/BlogThemeBuilderExamples').then((x) => ({
          default: x.ExampleTemplate,
        }))
      ),
    },
  },

  DocsIntro: () => {
    return (
      <YStack gap="$1">
        <ThemeTintAlt offset={2}>
          <IntroParagraph large mt="$4">
            Tamagui makes styling React on any platform a delight. All of its features
            work the same on both React Native and React web.
          </IntroParagraph>

          <UL mt="$4" pl="$4" gap="$2">
            <Theme name="red">
              <LI size="$6" color="$color11">
                {/* @ts-ignore */}
                <Link fontSize="inherit" href="/docs/core/configuration">
                  <CodeInline>
                    <span style={{ color: 'var(--color12)' }}>@tamagui/core</span>
                  </CodeInline>
                </Link>
                &nbsp; is the base style library, it expands on the React Native style API
                with many features from CSS, all without a single external dependency. It
                can entirely replace React Native Web in a much lighter package, with full
                API compatibility, much improved SSR, more features, and much better
                performance.
              </LI>
            </Theme>

            <Theme name="green">
              <LI size="$6" color="$color11">
                {/* @ts-ignore */}
                <Link fontSize="inherit" href="/docs/intro/compiler-install">
                  <CodeInline>
                    <span style={{ color: 'var(--color12)' }}>@tamagui/static</span>
                  </CodeInline>
                </Link>{' '}
                is an optimizing compiler that{' '}
                <Link
                  // @ts-ignore
                  fontSize="inherit"
                  href="/docs/intro/benchmarks"
                >
                  significantly improves performance
                </Link>{' '}
                through partial analysis, hoisting, and flattening. It makes sharing code
                between web and native actually feel great.
              </LI>
            </Theme>

            <Theme name="blue">
              <LI size="$6" color="$color11">
                {/* @ts-ignore */}
                <Link fontSize="inherit" href="/ui/intro">
                  <CodeInline>
                    <span style={{ color: 'var(--color12)' }}>tamagui UI</span>
                  </CodeInline>
                </Link>{' '}
                is a bunch of unstyled and styled components for building common UI
                elements. It's similar to Radix, but works on native and web, and has a
                powerful Adapt primitive to shapeshift UI based on the platform or media
                query.
              </LI>
            </Theme>
          </UL>
        </ThemeTintAlt>
      </YStack>
    )
  },

  GetStarted: () => {
    const clipBoard = useClipboard(`npm create tamagui@latest`)

    return (
      <XStack gap="$4" flex={1} flexBasis="auto" flexWrap="wrap" pt="$3" my="$5">
        <>
          <ThemeTint>
            <Link asChild href="/docs/intro/installation">
              <Card
                render="a"
                transition="quickest"
                animateOnly={['transform']}
                flex={1}
                flexBasis="auto"
                y={0}
                hoverStyle={{ y: -2, bg: '$backgroundHover' }}
                pressStyle={{ y: 2, bg: '$color2' }}
              >
                <Card.Header gap="$2">
                  <H4 size="$4" color="$color8">
                    Install
                  </H4>
                  <Paragraph size="$6" color="$color9">
                    Set up an app.
                  </Paragraph>
                </Card.Header>

                <Card.Footer>
                  <ChevronRight position="absolute" b="$4" r="$4" color="$color11" />
                </Card.Footer>
              </Card>
            </Link>

            <Card flex={1} flexBasis="auto">
              <Card.Header gap="$2">
                <H4 size="$4" color="$color9">
                  Quick start
                </H4>
                <Paragraph size="$4" color="$color11">
                  Choose from a few starters:
                </Paragraph>
              </Card.Header>

              <Card.Footer p="$6" pt={0}>
                <XStack position="relative" items="center" gap="$4" flex={1}>
                  <Code flex={1} bg="$color4" p="$3" rounded="$4" size="$5">
                    npm create tamagui@latest
                  </Code>
                  <Button
                    position="absolute"
                    aria-label="Copy code to clipboard"
                    size="$2"
                    r="$3"
                    display="inline-flex"
                    icon={clipBoard.hasCopied ? CheckCircle : Copy}
                    onPress={() => {
                      clipBoard.onCopy()
                    }}
                    $xs={{
                      display: 'none',
                    }}
                  >
                    Copy
                  </Button>
                </XStack>
              </Card.Footer>
            </Card>
          </ThemeTint>
        </>
      </XStack>
    )
  },

  Aside: ({ children, ...props }) => {
    const areChildrenString = typeof children === 'string'
    const shouldCutoff = !areChildrenString
    const [cutoff, setCutoff] = useState(shouldCutoff)

    return (
      <YStack
        render="aside"
        gap="$2"
        rounded="$4"
        p="$5"
        mx="$-2"
        mt="$2"
        position="relative"
        {...(cutoff && {
          my: '$4',
          px: '$5',
          borderWidth: 1,
          pb: '$10',
          bg: '$color1',
          borderColor: '$borderColor',
          maxH: 300,
          overflow: 'hidden',
        })}
        {...props}
      >
        {areChildrenString ? (
          <Paragraph color="$color10" my="$-5">
            {children}
          </Paragraph>
        ) : (
          children
        )}

        {shouldCutoff && cutoff && (
          <LinearGradient
            position="absolute"
            b={0}
            l={0}
            r={0}
            height={200}
            colors={['$background0', '$background']}
            z={1000}
          >
            <Spacer flex={1} />
            <Button onPress={() => setCutoff(!cutoff)} self="center">
              Show more
            </Button>
            <Spacer size="$4" />
          </LinearGradient>
        )}
      </YStack>
    )
  },
  SimpleTable,
}

export class ErrorBoundary extends React.Component<{ children: any; name: string }> {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    console.error('MDXComponent.error', error)
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.error('MDXComponent.error', this.props.name, error, info)
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export const components = Object.fromEntries(
  Object.entries(componentsIn).map(([key, Component]) => {
    const out = (props) => {
      // adds error boundary here as these errors are stupid to debug
      return (
        <ErrorBoundary name={key}>
          {/* @ts-expect-error */}
          <Component {...props} />
        </ErrorBoundary>
      )
    }

    // inherit static props
    for (const cKey in Component) {
      out[cKey] = Component[cKey]
    }

    return [key, out]
  })
)

const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <XStack
    render="a"
    // @ts-expect-error
    href={`#${id}`}
    id={id}
    data-id={id}
    display="inline-flex"
    items="center"
    gap="$4"
    {...props}
  >
    {children}
    <YStack render="span" opacity={0.3}>
      <LinkIcon size={12} color="var(--color)" aria-hidden />
    </YStack>
  </XStack>
)

const getNonTextChildren = (children) => {
  return React.Children.map(children, (x) => {
    if (typeof x === 'string') return null
    if (x['type'] === code) return null
    return x
  }).flat()
}
