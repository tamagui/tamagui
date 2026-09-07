import {
  CheckCircle,
  Code2,
  Copy,
  FileCode2,
  Paintbrush,
  TerminalSquare,
} from '@tamagui/lucide-icons-2'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useId, useState } from 'react'
import {
  AnimatePresence,
  Paragraph,
  Spacer,
  TooltipSimple,
  XStack,
  YStack,
} from 'tamagui'
import { Button } from '~/components/Button'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { Pre } from '~/components/Pre'
import { CodeBlockTabs } from '~/components/CodeBlockTabs'
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
  const showLineNumbers = showLineNumbersIn ?? lines > 10

  const command = useBashCommand(children, className)
  const { isTerminalCommand, showTabs, transformedCommand } = command
  const { hasCopied, onCopy } = useClipboard(transformedCommand)

  const showFileName = fileName || isTerminalCommand

  const isPreVisible = !isCollapsed || !isCollapsible

  const copyButton = disableCopy ? null : (
    <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
      <Button
        aria-label="Copy code to clipboard"
        size="2"
        display="inline-flex"
        // with no title row it floats over the code, so keep it out of the way
        // until the pointer is here. touch has no hover, so small screens keep it
        {...(!showFileName &&
          !showTabs && {
            opacity: '0 sm:1 group-hover/code:1',
            transition: 'quickest',
          })}
        icon={hasCopied ? CheckCircle : Copy}
        onPress={() => {
          onCopy()
        }}
      >
        Copy
      </Button>
    </TooltipSimple>
  )

  return (
    <YStack
      ref={ref}
      position="relative"
      mb="4"
      {...(isHero && {
        px: '4',
        mx: '-4 gtMd:-7',
      })}
    >
      <ErrorBoundary>
        {isCollapsible && (
          <XStack
            gap="2"
            position="absolute"
            display="inline-flex"
            items="center"
            justify="flex-end"
            t={-82}
            r="6"
            z={0}
          >
            <Button
              aria-label="Show or hide code"
              icon={Code2}
              size="3"
              fontWeight="400"
              z={10}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
            <TooltipSimple label="Toggle tint on/off">
              <Button size="3" onPress={toggleDocsTinted} z={10} icon={Paintbrush} />
            </TooltipSimple>
          </XStack>
        )}

        {isPreVisible && (
          <YStack
            {...(isCutoff && {
              maxHeight: 400,
              ov: 'hidden',
              br: '4',
            })}
          >
            {isCutoff && (
              <LinearGradient
                position="absolute"
                b={0}
                l={0}
                r={0}
                height={200}
                colors={['background0', 'background']}
                z={1000}
              >
                <Spacer flex={1} />
                <Button
                  z={10}
                  size="3"
                  onPress={() => setIsCutoff(!isCutoff)}
                  self="center"
                >
                  Show more
                </Button>
                <Spacer size="4" />
              </LinearGradient>
            )}

            <Pre
              data-invert-line-highlight={isHighlightingLines}
              data-line-numbers={showLineNumbers}
              className={className}
              p={0}
              mb={0}
              id={id}
              justify="center"
              bg="color2"
              position="relative"
              group="code"
            >
              {/* with tabs the picker row already carries the copy button, so a
                  separate "Terminal" row would just be a second header */}
              {showFileName && !showTabs && (
                <XStack
                  items="center"
                  gap="2"
                  pl="4"
                  pr="3"
                  height="5"
                  py="4"
                  borderBottomWidth="0-5"
                  borderBottomColor="color3"
                >
                  {isTerminalCommand ? (
                    <TerminalSquare size="1" color="color11" />
                  ) : (
                    <FileCode2 size="1" color="color11" />
                  )}
                  <Paragraph color="color11">
                    {isTerminalCommand ? 'Terminal' : fileName}
                  </Paragraph>
                  {/* in the title row it sits in the flow, so it centers on the
                      title instead of hanging over the row's bottom border */}
                  <XStack ml="auto">{copyButton}</XStack>
                </XStack>
              )}

              <CodeBlockTabs
                command={command}
                className={className}
                size={size}
                {...rest}
                {...(showTabs && {
                  width: '100%',
                  headerRight: copyButton,
                })}
              >
                {children}
              </CodeBlockTabs>

              {!showFileName && !showTabs && copyButton && (
                <XStack position="absolute" t="3" r="3">
                  {copyButton}
                </XStack>
              )}
            </Pre>

            <AnimatePresence>
              {isLong && !isCutoff && (
                <>
                  <Spacer />
                  <Button size="3" onPress={() => setIsCutoff(!isCutoff)} self="center">
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
