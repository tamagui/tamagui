import { CheckCircle, Clipboard } from '@tamagui/feather-icons'
import copy from 'copy-to-clipboard'
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { Button, Text, YStack } from 'tamagui'

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
  const [isCollapsed, setIsCollapsed] = useState(isHero)
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
    setTimeout(() => setHasCopied(false), 1500)
  }, [hasCopied])

  return (
    <YStack
      ref={ref}
      position="relative"
      {...(isHero && {
        px: '$4',
        $gtSm: {
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
          space="$1"
          top={-70}
          right="$2"
          $gtSm={{
            right: 50,
          }}
          $gtMd={{
            right: 50,
          }}
        >
          <Button
            className="text-shadow"
            chromeless
            onPress={() => setIsCollapsed((x) => !x)}
            textProps={{
              size: '$2',
              color: '$color',
            }}
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
            id={id}
          >
            <Code backgroundColor="transparent" className={className}>
              {children}
            </Code>
          </Pre>
          <Button
            aria-label="Copy code to clipboard"
            position="absolute"
            top="$2"
            right="$2"
            display="inline-flex"
            opacity={0}
            // css={{
            //   '*:hover > &, &:focus': { opacity: 1, transition: '150ms linear' },
            // }}
            onClick={() => setHasCopied(true)}
          >
            {hasCopied ? <CheckCircle /> : <Clipboard />}
          </Button>
        </YStack>
      )}
    </YStack>
  )
})
