import { Code2, FileCode2, Paintbrush, TerminalSquare } from '@tamagui/lucide-icons-2'
import { useStore } from '@tamagui/use-store'
import { forwardRef, useEffect, useId } from 'react'
import { Paragraph, TooltipSimple, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { Pre } from '~/components/Pre'
import { CodeBlockTabs } from '~/components/CodeBlockTabs'
import { useBashCommand } from '~/hooks/useBashCommand'
import { useClipboard } from '~/hooks/useClipboard'
import { toggleDocsTinted } from './docsTint'
import { useCodeSyntaxTabs } from './MDXTabs'
import { CodeChromeButton, CodeChromeRow, useCodeChromeSlot } from './CodeChrome'

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
  const showLineNumbers = showLineNumbersIn ?? lines > 10
  const showCodeSyntax = useCodeSyntaxTabs()

  const command = useBashCommand(children, className)
  const { isTerminalCommand, showTabs, transformedCommand } = command
  const { hasCopied, onCopy } = useClipboard(transformedCommand)

  const showFileName = fileName || isTerminalCommand

  const isPreVisible = !isCollapsed || !isCollapsible

  // inside a syntax-toggle block the copy control belongs in the toggle's row,
  // which is a sibling above this one, so publish the text up and let that row
  // render it. keeps the two controls in a single flex row.
  const slot = useCodeChromeSlot()
  const publishCopy = showCodeSyntax && !disableCopy
  useEffect(() => {
    if (!publishCopy || !slot) return
    slot.setCopyText(transformedCommand)
    return () => slot.setCopyText(null)
  }, [publishCopy, transformedCommand])

  const copyButton =
    disableCopy || publishCopy ? null : (
      <CodeChromeButton label="Copy code to clipboard" onPress={onCopy}>
        {hasCopied ? 'Copied' : 'Copy'}
      </CodeChromeButton>
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
              theme="brand"
              icon={Code2}
              size="sm"
              fontWeight="400"
              z={10}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
            <TooltipSimple label="Toggle tint on/off">
              <Button
                theme="brand"
                size="sm"
                onPress={toggleDocsTinted}
                z={10}
                icon={Paintbrush}
              />
            </TooltipSimple>
          </XStack>
        )}

        {isPreVisible && (
          <YStack>
            {/* a standalone block has no syntax toggle, so it gets the same row
                on its own, with copy right-aligned and lined up identically */}
            {copyButton && !showFileName && !showTabs && (
              <CodeChromeRow justify="flex-end">{copyButton}</CodeChromeRow>
            )}
            <Pre
              data-invert-line-highlight={isHighlightingLines}
              data-line-numbers={showLineNumbers}
              className={className}
              p={0}
              mb={0}
              id={id}
              justify="center"
              bg="color-2"
              borderWidth={1}
              borderColor="color-3"
              rounded="4"
              overflow="hidden"
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
                  borderBottomColor="color-3"
                >
                  {isTerminalCommand ? (
                    <TerminalSquare size="1" color="color-11" />
                  ) : (
                    <FileCode2 size="1" color="color-11" />
                  )}
                  <Paragraph color="color-11">
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
            </Pre>
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
