import {
  CheckCircle,
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
  Button,
  Paragraph,
  Progress,
  Spacer,
  TooltipSimple,
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
import { getBashText } from './getBashText'

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
    showFull = true,
    fileName,
    isHero = false,
    isHighlightingLines,
    showLineNumbers: showLineNumbersIn,
    disableCopy,
    size,
    ...rest
  } = props
  const lines = Array.isArray(children) ? children.length : 0
  const isCollapsible = isHero || props.isCollapsible
  const store = useStore(CollapseStore, { isCollapsed: showFull })
  const { isCollapsed, setIsCollapsed } = store
  const isLong = lines > 22
  const [isCutoff, setIsCutoff] = useState(isLong && showFull)
  const [code, setCode] = useState<string | undefined>(undefined)
  const preRef = useRef<any>(null)
  const { hasCopied, onCopy, value, timeout } = useClipboard(code)
  const copyTimeoutValue = useGradualIncrease(hasCopied, timeout)
  const showLineNumbers = showLineNumbersIn ?? (lines > 10 ? true : false)

  const bashText = getBashText(children)[0]
  const [command, setCommand] = useState('')
  const isBash = className === 'language-bash'
  const isPackage = bashText.startsWith('yarn')
  const isPackageRunner = bashText.startsWith('npx')
  const isStarter = bashText.startsWith('npm create')
  const isTerminal = isBash && !isPackage && !isPackageRunner && !isStarter
  const packageToInstall = bashText.split(' ').splice(2).join(' ')
  const packageToRun = bashText.split(' ').splice(1).join(' ')

  const commands = {
    bun: 'bun add',
    npm: 'npm install',
    pnpm: 'pnpm install',
    npx: 'npx',
    bunx: 'bunx',
    default: 'yarn add',
  }

  const handleTabChange = (tab: string) => {
    setCommand(commands[tab] || commands.default)
  }

  const getCommand = (command: string, code: string, isPackage: boolean) => {
    const codeParts = code.split(' ')
    const spliceIndex = isPackage ? 2 : 1
    return `${command} ${codeParts.splice(spliceIndex).join(' ')}`
  }

  // const frontmatter = useContext(FrontmatterContext)

  const isPreVisible = !isCollapsed || !isCollapsible

  useEffect(() => {
    try {
      if (preRef.current && isPreVisible) {
        const codeElement = preRef.current.querySelector('code')
        if (codeElement) {
          // remove double line breaks
          const code = codeElement.innerText.replace(/\n{3,}/g, '\n')
          if (isBash) {
            if (isTerminal || isStarter) {
              setCode(code)
            } else {
              setCode(getCommand(command, code, isPackage))
            }
          } else {
            setCode(code)
          }
        } else {
          // not collapsible
        }
      }
    } catch {
      // ok
    }
  }, [preRef, isPreVisible, command])

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
              jc="center"
              bw="$1"
              bc="$black1"
            >
              {(fileName || isTerminal) && (
                <XStack
                  ai="center"
                  gap="$2"
                  pl="$4"
                  h="$5"
                  py="$4"
                  bg="$black1"
                  bw="$1.5"
                  bc="$background"
                  br="$5"
                >
                  {isTerminal ? (
                    <TerminalSquare size="$1" col="$white8" />
                  ) : (
                    <FileCode2 size="$1" col="$white8" />
                  )}
                  <Paragraph col="$white8">
                    {isTerminal ? 'Terminal' : fileName}
                  </Paragraph>
                </XStack>
              )}

              <RowingTabs enabled={isBash && !isTerminal} onTabChange={handleTabChange}>
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
                    {isPackage
                      ? `${command} ${packageToInstall}`
                      : // : isPackageRunner
                        //   ? `${command} ${packageToRun}`
                        children}
                  </Code>
                </ScrollView>
              </RowingTabs>
            </Pre>

            {!disableCopy && (
              <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                <Button
                  position="absolute"
                  aria-label="Copy code to clipboard"
                  size="$2"
                  top={fileName || isTerminal ? '$3' : '$3.5'}
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

            <Progress
              value={copyTimeoutValue}
              size="$0.75"
              pos="absolute"
              zi={1001}
              w="auto"
              b={!isLong && '$0'}
              t={isLong && '$0'}
              l="$2"
              r="$2"
              bg="$black1"
              rotate="180deg"
              animation="quickest"
            >
              <Progress.Indicator bg="$color8" animation="quickest" />
            </Progress>
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  )
})
