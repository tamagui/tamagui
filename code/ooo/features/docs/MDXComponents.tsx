import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import {
  EnsureFlexed,
  H1,
  H2,
  H3,
  H4,
  H5,
  Heading,
  Paragraph,
  Spacer,
  Text,
  Theme,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import { Link } from 'one'
import { SubTitle } from '../site/SubTitle'
import { Code, CodeInline } from './Code'
import { DocCodeBlock } from './DocsCodeBlock'
import { LinkHeading } from './LinkHeading'
import { Notice } from './Notice'
import { PropsTable } from './PropsTable'
import { RouteTree } from './RouteTree'
import { unwrapText } from './unwrapText'
import { Status } from './Status'
import { Badge } from './Badge'

const IntroParagraph = ({ children, disableUnwrapText, ...props }: any) => {
  return (
    <Paragraph
      tag="p"
      size="$8"
      lh={39}
      mt="$2"
      mb="$2"
      fow="400"
      $sm={{
        size: '$7',
        fow: '400',
      }}
      {...props}
    >
      {disableUnwrapText ? children : unwrapText(children)}
    </Paragraph>
  )
}

const LI = styled(Paragraph, {
  display: 'list-item' as any,
  tag: 'li',
  size: '$5',
  pb: '$1',
})

const UL = styled(YStack, {
  tag: 'ul',
  my: '$1',
  ml: '$4',
  mr: '$2',
})

const HR = () => (
  <YStack mt="$9" mb="$5" mx="auto" maxWidth="50%">
    <EnsureFlexed />
    <YStack borderBottomColor="$color5" borderBottomWidth={1} flex={1} />
  </YStack>
)

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
    const childText = unwrapText(children)
    if (!childText[0]?.includes('\n')) {
      return <CodeInline>{childText}</CodeInline>
    }
  }
  return (
    <DocCodeBlock
      isHighlightingLines={line !== undefined}
      className={className}
      isHero={hero !== undefined}
      showMore={showMore !== undefined}
      showLineNumbers={showLineNumbers !== undefined}
      {...rest}
    >
      {children}
    </DocCodeBlock>
  )
}

const componentsIn = {
  IntroParagraph,
  Spacer,
  Text,
  Theme,
  Code,
  Notice,
  SubTitle,
  RouteTree,
  PropsTable,
  Status,
  Badge,
  XStack,
  YStack,

  Card: ({ category, title, href }) => {
    const content = (
      <YStack
        tag="a"
        animation="quickest"
        className="text-underline-none"
        f={1}
        y={0}
        bg="$color2"
        br="$4"
        p="$6"
        py="$5"
        hoverStyle={{ y: -2, bg: '$color3' }}
        pressStyle={{ y: 2, bg: '$color1' }}
      >
        <XStack ai="center" jc="space-between" f={1} w="100%">
          <YStack>
            <Heading size="$4" color="$color7" {...(!!category && { mt: '$-2' })}>
              {category}
            </Heading>
            <Paragraph size="$7" color="$color11">
              {title}
            </Paragraph>
          </YStack>

          <Spacer flex />

          <ChevronRight color="$color11" />
        </XStack>
      </YStack>
    )

    if (href) {
      return (
        <Link asChild href={href}>
          {content}
        </Link>
      )
    }

    return content
  },

  CardCol: (props) => <YStack mt="$6" mb="$6" gap="$3" {...props} />,

  h1: (props) => <H1 width="max-content" pos="relative" mb="$2" {...props} />,

  h2: ({ children, ...props }) => (
    <H2
      pos="relative"
      width={`fit-content` as any}
      pt="$8"
      mt="$2"
      mb="$4"
      bbw={1}
      w="100%"
      pb="$4"
      bbc="$color4"
      data-heading
      {...props}
    >
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading pt="$8" mb="$1" id={id}>
      <H3 pos="relative" width={`fit-content` as any} id={id} data-heading {...props}>
        {children}
      </H3>
    </LinkHeading>
  ),

  h4: (props) => (
    <H4
      pos="relative"
      width={`fit-content` as any}
      mt="$6"
      mb="$3"
      fow="400"
      {...props}
    />
  ),

  h5: (props) => <H5 mt="$4" {...props} />,

  p: (props) => (
    <Paragraph
      className="docs-paragraph"
      display="block"
      size="$6"
      lh={30}
      my="$2.5"
      {...props}
    />
  ),

  hr: HR,

  ul: ({ children }) => {
    return (
      <UL my="$2">
        {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
      </UL>
    )
  },

  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  li: (props) => {
    return (
      <LI size="$6" className="docs-paragraph">
        {props.children}
      </LI>
    )
  },

  a: ({ href = '', children, ...props }) => {
    return (
      <Link className="link" href={href} asChild>
        {/* @ts-ignore */}
        <Paragraph
          tag="a"
          // @ts-ignore
          fontSize="inherit"
          display="inline"
          cursor="pointer"
          {...props}
        >
          {children}
          {/* {href.startsWith('http') ? (
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
          ) : null} */}
        </Paragraph>
      </Link>
    )
  },

  // hr: HR,

  // ul: ({ children }) => {
  //   return (
  //     <UL my="$4">
  //       {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
  //     </UL>
  //   )
  // },

  // ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  // li: (props) => {
  //   return (
  //     <LI size="$6" my="$1.5" className="docs-paragraph">
  //       {props.children}
  //     </LI>
  //   )
  // },

  strong: (props) => (
    <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />
  ),

  img: ({ ...props }) => (
    <View tag="span" my="$6">
      {/* TODO make this a proper <Image /> component */}
      <View tag="img" {...props} maxWidth="100%" />
    </View>
  ),

  pre: ({ children }) => <>{children}</>,

  code,

  blockquote: ({ children, ...props }) => {
    return (
      <View
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
          color="$color"
          opacity={0.65}
        >
          {unwrapText(children)}
        </Paragraph>
      </View>
    )
  },
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

const getNonTextChildren = (children) => {
  return React.Children.map(children, (x) => {
    if (typeof x === 'string') return null
    if (x['type'] === code) return null
    return x
  }).flat()
}
