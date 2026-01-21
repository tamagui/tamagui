import {
  CheckCircle,
  Code2,
  Copy,
  FileCode2,
  Paintbrush,
  TerminalSquare,
} from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Spacer,
  TooltipSimple,
  XStack,
  YStack,
  useEvent,
} from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { Pre } from '~/components/Pre'
import { RovingTabs } from '~/components/RovingTabs'
import { useBashCommand } from '~/hooks/useBashCommand'
import { useClipboard } from '~/hooks/useClipboard'
import { toggleDocsTinted } from './docsTint'

class CollapseStore {
  isCollapsed: boolean

  constructor(props: { id: string; isCollapsed: boolean }) {
    this.isCollapsed = props.isCollapsed
  }

  setIsCollapsed(val: boolean) {
    this.isCollapsed = val
  }
}

// all of the code around useClipboard useBashCommand codeElement.innerText.replace
// was written by a junior dev and could be way simpler and cleaner

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    isHero = false,
    showMore = true,
    fileName = undefined,
    isHighlightingLines,
    showLineNumbers: showLineNumbersIn,
    disableCopy,
    size,
    ...rest
  } = props

  const lines = Array.isArray(children) ? children.length : 0
  const isCollapsible = isHero || props.isCollapsible
  const storeId = useId()
  const store = useStore(CollapseStore, { id: storeId, isCollapsed: showMore })
  const { isCollapsed, setIsCollapsed } = store
  const isLong = lines > 22
  const [isCutoff, setIsCutoff] = useState(isLong && !showMore)
  const [code, setCode] = useState<string | undefined>(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy } = useClipboard(code)
  const showLineNumbers = showLineNumbersIn ?? lines > 10

  const { isTerminalCommand, showTabs, transformedCommand } = useBashCommand(
    children,
    className
  )

  const showFileName = fileName || isTerminalCommand

  const isPreVisible = !isCollapsed || !isCollapsible

  const onCommandChange = useEvent(() => {
    try {
      const codeElement = preRef.current?.querySelector('code')
      if (codeElement) {
        setCode(transformedCommand)
      }
    } catch (err) {
      console.warn('err', err)
    }
  })

  useEffect(() => {
    onCommandChange()
  }, [transformedCommand, isPreVisible, onCommandChange])

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
            items="center"
            justify="flex-end"
            t={-82}
            r="$6"
            $gtMd={{
              r: '$3',
            }}
          >
            <Button
              aria-label="Show or hide code"
              icon={Code2}
              size="$3"
              z={10}
              onPress={() => setIsCollapsed(!isCollapsed)}
              // theme="surface3"
              debug="verbose"
            >
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
            <TooltipSimple label="Toggle tint on/off">
              <Button size="$3" onPress={toggleDocsTinted} z={10} icon={Paintbrush} />
            </TooltipSimple>
          </XStack>
        )}

        {isPreVisible && (
          <YStack
            {...(isCutoff && {
              maxHeight: 400,
              ov: 'hidden',
              br: '$4',
            })}
          >
            {isCutoff && (
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
                <Button
                  z={10}
                  size="$3"
                  onPress={() => setIsCutoff(!isCutoff)}
                  self="center"
                >
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
              id={id}
              justify="center"
              bg="$color3"
              position="relative"
            >
              {showFileName && (
                <XStack
                  items="center"
                  gap="$2"
                  pl="$4"
                  height="$5"
                  py="$4"
                  borderBottomWidth="$0.5"
                  borderBottomColor="$color3"
                >
                  {isTerminalCommand ? (
                    <TerminalSquare size="$1" color="$color11" />
                  ) : (
                    <FileCode2 size="$1" color="$color11" />
                  )}
                  <Paragraph color="$color11">
                    {isTerminalCommand ? 'Terminal' : fileName}
                  </Paragraph>
                </XStack>
              )}

              <RovingTabs
                className={className}
                size={size}
                {...rest}
                {...(showTabs && {
                  width: '100%',
                })}
              >
                {children}
              </RovingTabs>

              {!disableCopy && (
                <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                  <Button
                    position="absolute"
                    aria-label="Copy code to clipboard"
                    size="$2"
                    t={showFileName ? '$6' : '$3'}
                    r="$3"
                    display="inline-flex"
                    icon={hasCopied ? CheckCircle : Copy}
                    onPress={() => {
                      onCopy()
                    }}
                  >
                    Copy
                  </Button>
                </TooltipSimple>
              )}
            </Pre>

            <AnimatePresence>
              {isLong && !isCutoff && (
                <>
                  <Spacer />
                  <Button size="$3" onPress={() => setIsCutoff(!isCutoff)} self="center">
                    Show less
                  </Button>
                </>
              )}
            </AnimatePresence>
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
