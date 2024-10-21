import {
  CheckCircle,
  ChevronsDownUp,
  Code2,
  Copy,
  FileCode2,
  TerminalSquare,
} from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Spacer,
  TooltipSimple,
  XStack,
  YStack,
  styled,
  ScrollView,
  useEvent,
  Text,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { ErrorBoundary } from '~/features/site/ErrorBoundary'
import { Code } from './Code'
import { RovingTabs } from './RovingTabs'
import { useBashCommand } from './useBashCommand'
import { useClipboard } from './useClipboard'

export const Pre = styled(YStack, {
  overflow: 'visible',
  tag: 'pre',
  padding: '$4',
  borderRadius: '$4',
  bg: '$background',
})

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
  const isLong = lines > 100
  const [isCutoff, setIsCutoff] = useState(isLong && !showMore)
  const [code, setCode] = useState<string | undefined>(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy } = useClipboard(code)
  const showLineNumbers = showLineNumbersIn ?? lines > 10

  const { isTerminalCommand, transformedCommand } = useBashCommand(children, className)

  const showFileName = fileName || isTerminalCommand

  const isPreVisible = !isCollapsed || !isCollapsible

  const onCommandChange = useEvent(() => {
    try {
      const codeElement = preRef.current.querySelector('code')
      if (codeElement) {
        // remove double line breaks
        const codeExtract = codeElement.innerText.replace(/\n{3,}/g, '\n')
        setCode(transformedCommand)
      }
    } catch (err) {
      console.warn('err', err)
      // ok
    }
  })

  useEffect(() => {
    onCommandChange()
  }, [transformedCommand, onCommandChange])

  return (
    <YStack
      ref={ref}
      position="relative"
      mb="$4"
      mt="$3"
      bw={1}
      bc="$gray4"
      br="$5"
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
              aria-label="Show or hide code"
              icon={Code2}
              size="$3"
              zi={10}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
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
              mt={0}
            >
              {showFileName && (
                <XStack ai="center" gap="$2" pl="$4" py="$3" bbw={1} bc="$gray4">
                  {isTerminalCommand ? (
                    <TerminalSquare size={14} col="$color11" />
                  ) : (
                    <FileCode2 size={14} col="$color11" />
                  )}
                  <Paragraph col="$color11">
                    {isTerminalCommand ? 'Terminal' : fileName}
                  </Paragraph>
                </XStack>
              )}

              <RovingTabs className={className} size={size} {...rest}>
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
                    fontSize={14}
                    lineHeight={22}
                    {...rest}
                  >
                    {children}
                  </Code>
                </ScrollView>
              </RovingTabs>
            </Pre>

            <AnimatePresence>
              {isLong && !isCutoff && (
                <Button
                  position="absolute"
                  aria-label="Collapse code block"
                  size="$2"
                  top={showFileName ? '$3' : '$3.5'}
                  right="$10"
                  display="inline-flex"
                  iconAfter={ChevronsDownUp}
                  scaleIcon={1.25}
                  bg="$color1"
                  o={1}
                  animation="quickest"
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
              <TooltipSimple
                label={
                  <Text dsp="inline-flex" minWidth={100} ai="center" jc="center">
                    {hasCopied ? 'Copied!' : 'Copy to clipboard'}
                  </Text>
                }
              >
                <Button
                  position="absolute"
                  aria-label="Copy code to clipboard"
                  size="$2"
                  top={10}
                  br="$4"
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
