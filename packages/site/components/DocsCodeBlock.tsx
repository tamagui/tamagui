import { CheckCircle, Clipboard } from '@tamagui/feather-icons'
import copy from 'copy-to-clipboard'
import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, YStack } from 'tamagui'

import { Code } from './Code'
import { FrontmatterContext } from './MDXComponents'
import { Pre } from './Pre'

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    showLineNumbers = false,
    isHero = false,
    isCollapsible = false,
    isScrollable = false,
    variant,
    isHighlightingLines,
  } = props
  const [isCollapsed, setIsCollapsed] = useState(isHero || isCollapsible)
  const [hasCopied, setHasCopied] = useState(false)
  const [code, setCode] = useState(undefined)
  const preRef = useRef<any>(null)
  const frontmatter = useContext(FrontmatterContext)

  useEffect(() => {
    if (preRef.current) {
      const codeElement = preRef.current.querySelector('code')
      if (codeElement) {
        // remove double line breaks
        const code = codeElement.innerText.replace(/\n{3,}/g, '\n')
        setCode(code)
      } else {
        // not collapsible
      }
    }
  }, [preRef])

  useEffect(() => {
    if (hasCopied && code) copy(code)
    const tm = setTimeout(() => setHasCopied(false), 1500)
    return () => {
      clearTimeout(tm)
    }
  }, [hasCopied])

  return (
    <YStack
      ref={ref}
      position="relative"
      mb="$4"
      {...(isHero && {
        px: '$4',
        mx: '$-4',
        $gtMd: {
          mx: '$-7',
        },
      })}
    >
      {isCollapsible && (
        <YStack
          position="absolute"
          display="inline-flex"
          alignItems="center"
          justifyContent="flex-end"
          top={-60}
          r="$6"
          $gtMd={{
            r: '$7',
          }}
        >
          <Button
            accessibilityLabel="Show or hide code"
            size="$2"
            onPress={() => setIsCollapsed((x) => !x)}
          >
            {isCollapsed ? 'Show code' : 'Hide code'}
          </Button>
        </YStack>
      )}

      {(!isCollapsed || !isCollapsible) && (
        <YStack position="relative">
          <Pre
            ref={preRef}
            data-invert-line-highlight={isHighlightingLines}
            data-line-numbers={showLineNumbers}
            className={className}
            p={0}
            mb={0}
            // @ts-ignore
            id={id}
          >
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ minWidth: '100%' }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <Code p="$4" backgroundColor="transparent" f={1} className={className}>
                {children}
              </Code>
            </ScrollView>
          </Pre>
          <Button
            aria-label="Copy code to clipboard"
            position="absolute"
            size="$2"
            top="$5"
            right="$3"
            display="inline-flex"
            opacity={0}
            icon={hasCopied ? CheckCircle : Clipboard}
            // css={{
            //   '*:hover > &, &:focus': { opacity: 1, transition: '150ms linear' },
            // }}
            onPress={() => setHasCopied(true)}
          ></Button>
        </YStack>
      )}
    </YStack>
  )
})
