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
  XStack,
  YStack,
  useEvent,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { Code } from '~/components/Code'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { Pre } from '~/components/Pre'
import { RovingTabs } from '~/components/RovingTabs'
import { useBashCommand } from '~/hooks/useBashCommand'
import { useClipboard } from '~/hooks/useClipboard'
import { toggleDocsTinted } from './docsTint'

class CollapseStore {
  isCollapsed: boolean

  constructor(initialState: { isCollapsed: boolean } = { isCollapsed: true }) {
    this.isCollapsed = initialState.isCollapsed
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
  const { hasCopied, onCopy } = useClipboard(code)
  const showLineNumbers = showLineNumbersIn ?? lines > 10

  const {
    isTerminalCommand,
    isCreateCommand,
    isInstallCommand,
    isExecCommand,
    showTabs,
    commandType,
    transformedCommand,
    originalPackageManager,
    selectedPackageManager,
    setPackageManager,
  } = useBashCommand(children, className)

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
            <TooltipSimple label="Toggle tint on/off">
              <Button size="$3" onPress={toggleDocsTinted} zi={10} icon={Paintbrush} />
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
                <Button size="$3" onPress={() => setIsCutoff(!isCutoff)} als="center">
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
                  {isTerminalCommand ? (
                    <TerminalSquare size="$1" col="$color11" />
                  ) : (
                    <FileCode2 size="$1" col="$color11" />
                  )}
                  <Paragraph col="$color11">
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
            </Pre>

            <AnimatePresence>
              {isLong && !isCutoff && (
                <>
                  <Spacer />
                  <Button size="$3" onPress={() => setIsCutoff(!isCutoff)} als="center">
                    Show less
                  </Button>
                </>
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
                >
                  Copy
                </Button>
              </TooltipSimple>
            )}
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
