import { CheckCircle, Clipboard, Paintbrush } from '@tamagui/lucide-icons'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, TooltipSimple, XStack, YStack } from 'tamagui'

import { setTinted, toggleTinted } from '../hooks/setTinted'
import { useClipboard } from '../lib/useClipboard'
import { Code } from './Code'
import { ErrorBoundary } from './ErrorBoundary'
import { Pre } from './Pre'

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    showLineNumbers = false,
    isHero = false,
    isCollapsible = false,
    isHighlightingLines,
  } = props
  const [isCollapsed, setIsCollapsed] = useState(isHero || isCollapsible)
  const [code, setCode] = useState(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy, value } = useClipboard(code)
  // const frontmatter = useContext(FrontmatterContext)

  useEffect(() => {
    try {
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
    } catch {
      // ok
    }
  }, [preRef])

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
      <ErrorBoundary>
        {isCollapsible && (
          <XStack
            space="$2"
            position="absolute"
            display="inline-flex"
            alignItems="center"
            justifyContent="flex-end"
            top={-70}
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

            {/* <TooltipSimple label="Toggle tint on/off">
              <Button
                accessibilityLabel="Toggle tint on/off"
                size="$2"
                onPress={toggleTinted}
                icon={Paintbrush}
              />
            </TooltipSimple> */}
          </XStack>
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
            <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
              <Button
                aria-label="Copy code to clipboard"
                position="absolute"
                size="$2"
                top="$3"
                right="$3"
                display="inline-flex"
                icon={hasCopied ? CheckCircle : Clipboard}
                onPress={onCopy}
                $xs={{
                  display: 'none',
                }}
              />
            </TooltipSimple>
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
