import { CheckCircle, Code2, Copy, Paintbrush } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Spacer, TooltipSimple, XStack, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { toggleTinted } from '../hooks/setTinted'
import { useClipboard } from '../lib/useClipboard'
import { Code } from './Code'
import { ErrorBoundary } from './ErrorBoundary'
import { Pre } from './Pre'

class CollapseStore {
  isCollapsed = true
  setIsCollapsed(val: boolean) {
    this.isCollapsed = val
  }
}

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    isHero = false,
    isHighlightingLines,
    showLineNumbers: showLineNumbersIn,
    disableCopy,
    size,
    ...rest
  } = props
  const lines = Array.isArray(children) ? children.length : 0
  const isCollapsible = isHero || props.isCollapsible
  const store = useStore(CollapseStore)
  const { isCollapsed, setIsCollapsed } = store
  const isLong = lines > 22
  const [isCutoff, setIsCutoff] = useState(isLong && !isCollapsible)
  const [code, setCode] = useState(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy, value } = useClipboard(code)
  const showLineNumbers = showLineNumbersIn ?? (lines > 10 ? true : false)

  // const frontmatter = useContext(FrontmatterContext)

  const isPreVisible = !isCollapsed || !isCollapsible

  useEffect(() => {
    try {
      if (preRef.current && isPreVisible) {
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
  }, [preRef, isPreVisible])

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
            gap="$2"
            position="absolute"
            display="inline-flex"
            alignItems="center"
            justifyContent="flex-end"
            top={-84}
            r="$6"
            $gtMd={{
              r: '$7',
            }}
          >
            <Button
              accessibilityLabel="Show or hide code"
              icon={Code2}
              size="$3"
              zi={10}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
            <TooltipSimple label="Toggle tint on/off">
              <Button
                accessibilityLabel="Toggle tint on/off"
                size="$3"
                onPress={toggleTinted}
                zi={10}
                icon={Paintbrush}
              />
            </TooltipSimple>
          </XStack>
        )}

        {isPreVisible && (
          <YStack
            position="relative"
            {...(isCutoff && {
              maxHeight: 400,
              ov: 'hidden',
              br: '$4',
            })}
          >
            {isCutoff && (
              <LinearGradient
                pos="absolute"
                b={0}
                l={0}
                r={0}
                height={200}
                colors={['$background0', '$background']}
                zi={1000}
              >
                <Spacer f={1} />
                <Button onPress={() => setIsCutoff(!isCutoff)} als="center">
                  Show more
                </Button>
                <Spacer size="$4" />
              </LinearGradient>
            )}

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
                {/* @ts-ignore */}
                <Code
                  p="$4"
                  backgroundColor="transparent"
                  f={1}
                  className={className}
                  size={size ?? '$5'}
                  lineHeight={size ?? '$5'}
                  {...rest}
                >
                  {children}
                </Code>
              </ScrollView>
            </Pre>
            {!disableCopy && (
              <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                <Button
                  position="absolute"
                  aria-label="Copy code to clipboard"
                  size="$2"
                  top="$3"
                  right="$3"
                  display="inline-flex"
                  icon={hasCopied ? CheckCircle : Copy}
                  onPress={onCopy}
                  $xs={{
                    display: 'none',
                  }}
                />
              </TooltipSimple>
            )}
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
