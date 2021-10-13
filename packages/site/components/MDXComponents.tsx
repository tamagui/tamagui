import { AlertCircle, Link } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import NextRouter from 'next/router'
import rangeParser from 'parse-numeric-range'
import React from 'react'
import {
  Box,
  EnsureFlexed,
  H1,
  H2,
  H3,
  H4,
  Paragraph,
  Separator,
  StackProps,
  Text,
  XStack,
  YStack,
} from 'tamagui'

import { Frontmatter } from '../types/frontmatter'
import { Code } from './Code'
import { DemoButton } from './DemoButton'
import * as Demos from './demos'
import { Description } from './Description'
import { DocCodeBlock } from './DocsCodeBlock'
import { HeroContainer } from './HeroContainer'
import { Highlights } from './Highlights'
import { Preview } from './Preview'
import { PropsTable } from './PropsTable'

export const components = {
  Text,
  Paragraph,
  YStack,
  Box,
  // Title,
  Separator,
  Code,
  HeroContainer,

  ...Demos,

  Highlights,
  PropsTable,
  Description,

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

  Notice: ({ children, ...props }) => {
    return (
      <XStack px="$4" py="$5" bc="$yellow2" br="$2" mb="$4" mt="$2" {...props}>
        <YStack my={-5} w={30} h={30} ai="center" jc="center" bc="$yellow5" br={100} mr="$3">
          <AlertCircle size={16} color="var(--yellow10)" />
        </YStack>
        {/* TODO could unwrapText to get proper coloring */}
        <Paragraph mt={-6} mb={-3} className="paragraph-parent" size="$4" color="$yellow12">
          {children}
        </Paragraph>
      </XStack>
    )
  },

  h1: (props) => <H1 letterSpacing={-1} {...props} mb="$2" />,

  h2: ({ children, id, ...props }) => (
    <LinkHeading id={id} mt="$6" mb="$2">
      <H2 size="$8" letterSpacing={-2} {...props} id={id} data-heading>
        {children}
      </H2>
    </LinkHeading>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading id={id} mt="$5" mb="$2">
      <H3 {...props} id={id} data-heading letterSpacing={-1}>
        {children}
      </H3>
    </LinkHeading>
  ),

  h4: (props) => <H4 mb="$2" mt="$3" lineHeight={27} {...props} />,

  p: (props) => <Paragraph className="paragraph" display="block" {...props} mb="$2" mt="$2" />,

  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink href={href} passHref>
        <Text tag="a" display="inline" {...props}>
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Link size={10} color="currentColor" />
            </>
          ) : null}
        </Text>
      </NextLink>
    )
  },

  hr: (props) => (
    <YStack my="$6" mx="auto" maxWidth="50%">
      <EnsureFlexed />
      <YStack borderBottomColor="$borderColor" borderBottomWidth={1} flex={1} />
    </YStack>
  ),

  ul: ({ children }) => {
    return (
      <YStack tag="ul" my="$1">
        {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
      </YStack>
    )
  },

  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  li: (props) => (
    <YStack pb="$1">
      <li>
        <Paragraph {...props} />
      </li>
    </YStack>
  ),

  strong: (props) => <Text {...props} fontWeight="700" />,

  img: ({ ...props }) => (
    <YStack my="$6">
      <YStack tag="img" {...props} maxWidth="100%" verticalAlign="middle" />
    </YStack>
  ),

  pre: ({ children }) => <>{children}</>,

  code: (props) => {
    const { hero, line, scrollable, className, children, id, showLineNumbers, collapsed, ...rest } =
      props
    if (!className) {
      return (
        // inline
        <Paragraph
          fontFamily="Monospace"
          color="$pink11"
          br="$1"
          backgroundColor="$pink2"
          lineHeight={18}
          px="$1"
          py={3}
          fontSize={14}
        >
          {children}
        </Paragraph>
      )
    }
    return (
      <DocCodeBlock
        isHighlightingLines={line !== undefined}
        className={className}
        isHero={hero !== undefined}
        isCollapsible={hero !== undefined || collapsed !== undefined}
        isScrollable={scrollable !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...(rest as any)}
      >
        {children}
      </DocCodeBlock>
    )

    // return (
    //   <Pre
    //     mb="$4"
    //     {...(isCollapsed && {
    //       height: 100,
    //       position: 'relative',
    //     })}
    //     // css={{
    //     //   '[data-preview] + &': {
    //     //     marginTop: 1,
    //     //     borderTopLeftRadius: 0,
    //     //     borderTopRightRadius: 0,
    //     //   },
    //     // }}
    //     className={className}
    //     id={id}
    //     data-line-numbers={showLineNumbers}
    //   >
    //     {isCollapsed && (
    //       <YStack position="absolute" left={0} zIndex={1} bottom="$2" width="100%">
    //         <Button onClick={() => setIsCollapsed(false)}>
    //           <ChevronDown /> Show code
    //         </Button>
    //       </YStack>
    //     )}
    //     <code className={className} children={children} />
    //   </Pre>
    // )
  },

  Image: ({ children, size, ...props }) => (
    <YStack tag="figure" mx={0} mb="$3">
      {/* <OffsetBox size={size}> */}
      <img
        {...props}
        style={{
          maxWidth: '100%',
          verticalAlign: 'middle',
        }}
      />
      {/* </OffsetBox> */}
      <Text tag="figcaption" lineHeight={23} color="$color3" mt="$2">
        {children}
      </Text>
    </YStack>
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
      <Text tag="figcaption" lineHeight={23} mt="$2" color="$color3">
        {children}
      </Text>
    </YStack>
  ),

  blockquote: ({ children, ...props }) => {
    return (
      <YStack
        my="$5"
        pl="$4"
        ml="$3"
        borderLeftWidth={1}
        borderColor="$borderColor"
        jc="center"
        {...props}
      >
        <Paragraph whiteSpace="revert" size="$6" color="$color4">
          {React.Children.toArray(children).map((x) => (x?.props?.children ? x.props.children : x))}
        </Paragraph>
      </YStack>
    )
  },

  DemoButton,

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
      const addClick = () => (isExternal ? window.location.replace(href) : NextRouter.push(href))

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

      const addClass = () => targetIndex.forEach((i) => allHighlightWords[i].classList.add('on'))
      const removeClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.remove('on'))

      trigger.addEventListener('mouseenter', addClass)
      trigger.addEventListener('mouseleave', removeClass)

      return () => {
        trigger.removeEventListener('mouseenter', addClass)
        trigger.removeEventListener('mouseleave', removeClass)
      }
    }, [])

    return <Paragraph fontFamily="Monospace" cursor="default" ref={triggerRef} {...props} />
  },
}

const OffsetBox = Box
// styled('div', {
//   variants: {
//     size: {
//       wide: {
//         mx: '-$5',
//         '@bp4': { mx: '-$8' },
//       },
//       hero: {
//         mx: '-35px',
//         '@bp2': {
//           mx: '-90px',
//         },
//         '@bp3': {
//           mx: '-166px',
//         },
//       },
//     },
//   },
// });

const LinkHeading = ({ id, children, ...props }: { id: string } & StackProps) => (
  <XStack
    tag="a"
    href={`#${id}`}
    // used by `scrollToUrlHash`
    // not using the `id` attribute for that because we may get ids that start with a number
    // and that is not a valid css selector
    data-id={id}
    display="inline-flex"
    ai="center"
    spacing
    {...props}
    // css={{
    //   textDecoration: 'none',
    //   color: 'inherit',
    //   display: 'inline-flex',
    //   alignItems: 'center',
    //   svg: {
    //     opacity: 0,
    //   },
    //   '&:hover svg': {
    //     opacity: 1,
    //   },
    // }}
  >
    {children}
    <YStack tag="span" opacity={0.3}>
      <Link size={12} color="currentColor" aria-hidden />
    </YStack>
  </XStack>
)

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props) {
  const { frontmatter, children } = props
  return (
    <>
      <FrontmatterContext.Provider value={frontmatter}>{children}</FrontmatterContext.Provider>
    </>
  )
}
