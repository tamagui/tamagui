import {
  CheckCircle,
  ChevronsDownUp,
  Code2,
  Copy,
  FileCode2,
  Paintbrush,
  TerminalSquare,
} from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Spacer,
  TooltipSimple,
  useEvent,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { toggleTinted } from '../hooks/setTinted'
import { useClipboard } from '../lib/useClipboard'
import { useGradualIncrease } from '../lib/useGradualIncrease'
import { Code } from './Code'
import { ErrorBoundary } from './ErrorBoundary'
import { Pre } from './Pre'
import { RowingTabs } from './RowingTabs'
import { useBashCommand } from '@lib/useBashCommand'

class CollapseStore {
  isCollapsed: boolean

  constructor(initialState: { isCollapsed: boolean } = { isCollapsed: true }) {
    this.isCollapsed = initialState.isCollapsed
  }

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
    showMore = false,
    fileName = undefined,
    isHighlightingLines,
    showLineNumbers: showLineNumbersIn,
    disableCopy,
    size,
    ...rest
  } = props
  const lines = Array.isArray(children) ? children.length : 0
  const isCollapsible = isHero || props.isCollapsible
  const store = useStore(CollapseStore, { isCollapsed: showMore })
  const { isCollapsed, setIsCollapsed } = store
  const isLong = lines > 22
  const [isCutoff, setIsCutoff] = useState(isLong && !showMore)
  const [code, setCode] = useState<string | undefined>(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy, timeout } = useClipboard(code)
  const copyTimeoutValue = useGradualIncrease(hasCopied, timeout)
  const showLineNumbers = showLineNumbersIn ?? lines > 10

  const { command, getCode, isTerminal } = useBashCommand(children, className)
  const showFileName = fileName || isTerminal

  const isPreVisible = !isCollapsed || !isCollapsible

  const onCommandChange = useEvent(() => {
    try {
      if (preRef.current && isPreVisible) {
        const codeElement = preRef.current.querySelector('code')
        if (codeElement) {
          // remove double line breaks
          const codeExtract = codeElement.innerText.replace(/\n{3,}/g, '\n')
          setCode(getCode(codeExtract))
        } else {
          // not collapsible
        }
      }
    } catch {
      // ok
    }
  })

  useEffect(() => {
    onCommandChange()
  }, [command, onCommandChange])

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
            top={-82}
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
              jc="center"
            >
              {showFileName && (
                <XStack
                  ai="center"
                  gap="$2"
                  pl="$4"
                  h="$5"
                  py="$4"
                  bg="$color3"
                  bw="$1.5"
                  bc="$background"
                  br="$5"
                >
                  {isTerminal ? (
                    <TerminalSquare size="$1" col="$color11" />
                  ) : (
                    <FileCode2 size="$1" col="$color11" />
                  )}
                  <Paragraph col="$color11">
                    {isTerminal ? 'Terminal' : fileName}
                  </Paragraph>
                </XStack>
              )}

              <RowingTabs className={className} size={size} {...rest}>
                <ScrollView
                  style={{ width: '100%' }}
                  contentContainerStyle={{ minWidth: '100%' }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
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
              </RowingTabs>
            </Pre>

            <AnimatePresence>
              {isLong && !isCutoff && (
                <Button
                  position="absolute"
                  aria-label="Collapse code block"
                  size="$2"
                  top={showFileName ? '$3' : '$3.5'}
                  right="$8"
                  display="inline-flex"
                  iconAfter={ChevronsDownUp}
                  scaleIcon={1.25}
                  bg="$color1"
                  o={1}
                  animation="quicker"
                  enterStyle={{ x: 5, o: 0 }}
                  exitStyle={{ x: 5, o: 0 }}
                  onPress={() => setIsCutoff(true)}
                  $xs={{
                    display: 'none',
                  }}
                >
                  Show less
                </Button>
              )}
            </AnimatePresence>

            {!disableCopy && (
              <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                <Button
                  position="absolute"
                  aria-label="Copy code to clipboard"
                  size="$2"
                  top={showFileName ? '$3' : '$3'}
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

            {/* <Progress
              value={copyTimeoutValue}
              size="$0.75"
              pos="absolute"
              zi={1001}
              w="auto"
              b={(!isLong || isCutoff) && '$0'}
              t={isLong && !isCutoff && '$0'}
              l="$2"
              r="$2"
              bg="transparent"
              rotate="180deg"
              animation="quickest"
            >
              <Progress.Indicator bg="$color8" />
            </Progress> */}
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
