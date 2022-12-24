import { Link } from '@tamagui/lucide-icons'
import NextLink from 'next/link'
import NextRouter from 'next/router'
import rangeParser from 'parse-numeric-range'
import React from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  EnsureFlexed,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  ImageProps,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  ThemeableStack,
  TooltipSimple,
  XGroup,
  XStack,
  XStackProps,
  YStack,
  styled,
} from 'tamagui'

import { BenchmarkChart } from './BenchmarkChart'
import { BenchmarkChartNative } from './BenchmarkChartNative'
import { BenchmarkChartWeb } from './BenchmarkChartWeb'
import { Code, CodeInline } from './Code'
import { DataTable } from './DataTable'
import * as Demos from './demos'
import { DocCodeBlock } from './DocsCodeBlock'
import { ExternalIcon } from './ExternalIcon'
import { Features } from './Features'
import { HeroContainer } from './HeroContainer'
import { ExampleAnimations } from './HeroExampleAnimations'
import { Highlights } from './Highlights'
import { HR } from './HR'
import { LI } from './LI'
import { MediaPlayer } from './MediaPlayer'
import { Notice } from './Notice'
import { OffsetBox } from './OffsetBox'
import { Preview } from './Preview'
import { PropsTable } from './PropsTable'
import { SocialLinksRow } from './SocialLinksRow'
import { SubTitle } from './SubTitle'
import { TamaguiExamplesCode } from './TamaguiExamplesCode'
import { UL } from './UL'
import { unwrapText } from './unwrapText'

const TableFrame = styled(ThemeableStack, {
  bordered: true,
  br: '$4',
  ov: 'hidden',
  my: '$4',
})

const Table = ({ heading, children, ...props }) => {
  return (
    <TableFrame className="no-scrollbar" overflow={'scroll' as any} {...props}>
      {!!heading && (
        <TableCell size="$4" bc="$color1" fow="500" color="$color9">
          {heading}
        </TableCell>
      )}
      <XStack minWidth="100%" ai="stretch">
        {children}
      </XStack>
    </TableFrame>
  )
}

const code = (props) => {
  const {
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
        isCollapsible={hero !== undefined || collapsible !== undefined}
        isScrollable={scrollable !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...rest}
      >
        {children}
      </DocCodeBlock>
    </YStack>
  )
}

const TableCell = styled(Paragraph, {
  bbw: 1,
  bbc: '$borderColor',
  fd: 'row',
  ai: 'center',
  pos: 'relative',
  f: 1,
  jc: 'center',
  ta: 'center',
  h: '$4',
  p: '$2',
  px: '$3',
  size: '$5',
  ellipse: true,

  variants: {
    head: {
      true: {
        bc: '$color1',
      },
    },
    highlight: {
      true: {
        bc: '$yellow2',
      },
    },
  },
})

const TableCol = styled(ThemeableStack, {
  brw: 1,
  brc: '$borderColor',
  f: 1,
  mr: -1,
  fd: 'column',
})

const TableHighlight = styled(YStack, {
  fullscreen: true,
  bc: '$yellow1',
})

export const components = {
  SocialLinksRow: () => (
    <YStack mt="$6" mx="$-4">
      <SocialLinksRow />
    </YStack>
  ),
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
  BenchmarkChart,
  Separator,
  Code,
  HeroContainer,
  BenchmarkChartNative,
  BenchmarkChartWeb,
  TooltipSimple,

  ...Demos,

  Highlights,
  PropsTable,
  DataTable,
  Description: SubTitle,
  UL,
  LI,

  TamaguiExamplesCode,

  TLDR: (props) => {
    return (
      <YStack
        $gtMd={{ mx: '$-4' }}
        mt="$5"
        mb="$3"
        px="$6"
        py="$2"
        br="$6"
        bw={1}
        o={0.8}
        boc="$borderColor"
        {...props}
      />
    )
  },

  DeployToVercel: () => {
    return (
      <a
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftamagui%2Fstarters&root-directory=next-expo-solito/next&envDescription=Set%20this%20environment%20variable%20to%201%20for%20Turborepo%20to%20cache%20your%20node_modules.&envLink=https%3A%2F%2Ftamagui.dev&project-name=tamagui-app&repo-name=tamagui-app&demo-title=Tamagui%20App%20%E2%9A%A1%EF%B8%8F&demo-description=Tamagui%20React%20Native%20%2B%20Next.js%20starter&demo-url=https%3A%2F%2Ftamagui.dev%2Fstarter&demo-image=https%3A%2F%2Ftamagui.dev%2Fblog%2Fintroducing-tamagui%2Fhero.png"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="Deploy with Vercel"
          style={{ height: 32, width: 90 }}
          src="https://vercel.com/button"
        />
      </a>
    )
  },

  Beta: () => (
    <Button
      accessibilityLabel="Beta blog post"
      pe="none"
      size="$2"
      theme="pink_alt2"
      pos="absolute"
      t={-15}
      r={-75}
      rotate="5deg"
    >
      Beta
    </Button>
  ),

  IntroParagraph: ({ children, large, ...props }) => {
    return (
      <Paragraph
        tag="span"
        size={large ? '$9' : '$8'}
        className="paragraph"
        ls={0.25}
        my="$3"
        fow={large ? '200' : '300'}
        {...props}
      >
        {unwrapText(children)}
      </Paragraph>
    )
  },

  Note: (props) => (
    <YStack
      tag="aside"
      mt="$5"
      mb="$5"
      borderRadius="$3"
      // & & p
      // fontSize: '$3',
      // color: '$slate11',
      // lineHeight: '23px',
      // margin: 0,
      {...props}
    />
  ),

  Notice,

  h1: (props) => <H1 width="max-content" pos="relative" mb="$2" {...props} />,

  h2: ({ children, ...props }) => (
    <H2
      pos="relative"
      width={`fit-content` as any}
      mt="$5"
      size="$9"
      data-heading
      {...props}
    >
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading mt="$5" mb="$1" id={id}>
      <H3
        pos="relative"
        width={`fit-content` as any}
        nativeID={id}
        size="$8"
        data-heading
        {...props}
      >
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),

  h4: (props) => (
    <H4 pos="relative" width={`fit-content` as any} mt="$4" mb="$3" {...props} />
  ),
  h5: (props) => <H5 mt="$4" {...props} />,

  p: (props) => (
    <Paragraph className="docs-paragraph" display="block" my="$3" size="$5" {...props} />
  ),

  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink legacyBehavior href={href} passHref>
        {/* @ts-ignore */}
        <Paragraph
          className="link"
          fontSize="inherit"
          tag="a"
          display="inline"
          cursor="pointer"
          {...props}
        >
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text fontSize="inherit" display="inline-flex" y={2} ml={-1}>
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Paragraph>
      </NextLink>
    )
  },

  hr: HR,

  ul: ({ children }) => {
    return (
      <UL my="$4">
        {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
      </UL>
    )
  },

  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  li: (props) => {
    return <LI my="$1">{props.children}</LI>
  },

  strong: (props) => (
    <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />
  ),

  img: ({ ...props }) => (
    <YStack tag="span" my="$6">
      {/* TODO make this a proper <Image /> component */}
      <YStack tag="img" {...props} maxWidth="100%" />
    </YStack>
  ),

  pre: ({ children }) => <>{children}</>,

  code,

  Image: ({
    children,
    size,
    overlap,
    ...props
  }: ImageProps & { size?: 'hero'; overlap?: boolean }) => (
    <OffsetBox
      size={size}
      tag="figure"
      f={1}
      mx={0}
      mb="$3"
      ai="center"
      jc="center"
      ov="hidden"
      {...(overlap && {
        mt: '$-6',
        elevation: '$4',
      })}
    >
      <Image maxWidth="100%" {...props} />
      {!!children && (
        <Text tag="figcaption" lineHeight={23} color="$colorPress" mt="$2">
          {children}
        </Text>
      )}
    </OffsetBox>
  ),

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
    <YStack tag="figure" mx={0} my="$6">
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
      <Text tag="figcaption" lineHeight={23} mt="$2" color="$colorPress">
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
        jc="center"
        {...props}
      >
        <Paragraph
          fontFamily="$silkscreen"
          whiteSpace="revert"
          size="$8"
          lh="$9"
          fow="300"
          ls="$0"
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

  RegisterLink: ({ id, index, href }) => {
    const isExternal = href.startsWith('http')

    React.useEffect(() => {
      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const target = allHighlightWords[index - 1]
      if (!target) return

      const addClass = () => target.classList.add('on')
      const removeClass = () => target.classList.remove('on')
      const addClick = () =>
        isExternal ? window.location.replace(href) : NextRouter.push(href)

      target.addEventListener('mouseenter', addClass)
      target.addEventListener('mouseleave', removeClass)
      target.addEventListener('click', addClick)

      return () => {
        target.removeEventListener('mouseenter', addClass)
        target.removeEventListener('mouseleave', removeClass)
        target.removeEventListener('click', addClick)
      }
    }, [])

    return null
  },

  H: ({ id, index, ...props }) => {
    const triggerRef = React.useRef<HTMLElement>(null)

    React.useEffect(() => {
      const trigger = triggerRef.current

      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const targetIndex = rangeParser(index).map((i) => i - 1)
      // exit if the `index` passed is bigger than the total number of highlighted words
      if (Math.max(...targetIndex) >= allHighlightWords.length) return

      const addClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.add('on'))
      const removeClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.remove('on'))

      trigger?.addEventListener('mouseenter', addClass)
      trigger?.addEventListener('mouseleave', removeClass)

      return () => {
        trigger?.removeEventListener('mouseenter', addClass)
        trigger?.removeEventListener('mouseleave', removeClass)
      }
    }, [])

    return <Paragraph fontFamily="$mono" cursor="default" ref={triggerRef} {...props} />
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
      <XGroup als="center" disabled>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </XGroup>
    )
  },

  DemoButton: () => <Button>Hello world</Button>,
}

const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <XStack
    tag="a"
    href={`#${id}`}
    id={id}
    data-id={id}
    display="inline-flex"
    ai="center"
    space
    {...props}
  >
    {children}
    <YStack tag="span" opacity={0.3}>
      <Link size={12} color="var(--color)" aria-hidden />
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
