import { AlertCircle, Copy, File } from '@tamagui/lucide-icons'
import { useLocalStorage } from 'foxact/use-local-storage'
import { lazy, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { useClipboard } from '../hooks'
import { useReplaceTokens } from '../hooks/useReplaceTokens'
import useTokenMapper from '../hooks/useTokenMapper'
import { useUserTamaguiConfig } from '../hooks/useUserTamaguiConfig'
interface Props {
  code: string
  isLoading?: boolean
}

const CodeBlockLazy = lazy(() => import('./CodeBlock'))

const startOfTheFileRegex = /\/\*\* START of the file (.+\.tsx) \*\//

export function CodeWindow({ code, isLoading }: Props) {
  const [CodeBlock, setCodeBlock] = useState<any>(null)

  const { mappedTokens } = useTokenMapper()

  const { codeWithReplacedTokens } = useReplaceTokens(code, mappedTokens)

  useEffect(() => {
    setCodeBlock(CodeBlockLazy)
  }, [])

  const tabs = useMemo(() => {
    const lines = codeWithReplacedTokens.split('\n')

    let accContent = ''
    let tabName = ''

    const accTabs: { name: string; content: string }[] = []
    lines.forEach((line, index) => {
      const matchedLine = line.match(startOfTheFileRegex)
      if (matchedLine) {
        const fileName = matchedLine[1]
        if (tabName) {
          accTabs.push({ name: tabName, content: accContent })
        }
        tabName = fileName
        accContent = ''
      } else {
        accContent += line + '\n'
      }
    })
    if (tabName) {
      accTabs.push({ name: tabName, content: accContent })
    }
    return accTabs
  }, [codeWithReplacedTokens])

  const [activeTabIndex, setActiveTabIndex] = useState('0')

  const { hasCopied, onCopy, resetState } = useClipboard(
    tabs.length ? tabs[Number(activeTabIndex)].content : ''
  )

  useEffect(() => {
    resetState()
  }, [activeTabIndex])

  if (!tabs.length || isLoading)
    return (
      <XStack
        height={700}
        backgroundColor="$background"
        borderWidth={0.5}
        borderColor="$borderColor"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mih={150}
        overflow="hidden"
      >
        <Spinner size="large" />
      </XStack>
    )

  if (tabs.length === 1) {
    return (
      <YStack>
        <Content CodeBlock={CodeBlock} tab={tabs[0]} />
        <CopyCodeButton onCopy={onCopy} hasCopied={hasCopied} oneTabLayout />
      </YStack>
    )
  }

  return (
    <Tabs
      value={activeTabIndex}
      onValueChange={setActiveTabIndex}
      orientation="horizontal"
      flexDirection="column"
      backgroundColor="$background"
      borderColor="$color3"
      width="100%"
      overflow="hidden"
      padding={0}
    >
      <Tabs.List
        unstyled
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
        backgroundColor="$background"
        borderColor="$borderColor"
        borderBottomWidth={0.5}
      >
        {tabs.map((tab, i) => {
          const isActive = String(i) === activeTabIndex

          return (
            <Tabs.Tab
              bg={isActive ? '$color1' : '$color2'}
              paddingVertical={'$4'}
              key={tab.name}
              flex={1}
              value={String(i)}
              hoverStyle={{
                bg: isActive ? '$color2' : '$color3',
              }}
              focusStyle={{
                bg: isActive ? '$color1' : '$color3',
              }}
              alignItems="center"
              justifyContent="center"
              gap="$2"
            >
              <File size={16} color={isActive ? '$gray12' : '$gray10'} />
              <SizableText
                color={isActive ? '$gray12' : '$gray10'}
                size="$3"
                letterSpacing={1}
              >
                {tab.name}
              </SizableText>
            </Tabs.Tab>
          )
        })}
      </Tabs.List>
      {tabs.map((tab, i) => (
        <Tabs.Content key={tab.name} value={String(i)}>
          <Content CodeBlock={CodeBlock} tab={tab} />
        </Tabs.Content>
      ))}
      <CopyCodeButton onCopy={onCopy} hasCopied={hasCopied} />
    </Tabs>
  )
}

function CopyCodeButton({ onCopy, hasCopied, oneTabLayout = false }) {
  return (
    <Button
      borderRadius="$4"
      themeInverse
      position="absolute"
      top={oneTabLayout ? 16 : 48}
      right={0}
      m="$4"
      size="$3"
      onPress={onCopy}
    >
      <Button.Text>{hasCopied ? 'Copied' : 'Copy'}</Button.Text>
      <Button.Icon>
        <Copy />
      </Button.Icon>
    </Button>
  )
}

const safeJSONStringify = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.warn('Failed to stringify value for localStorage:', error)
    return ''
  }
}

const safeJSONParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error)
    return ''
  }
}

function CustomizationEnabledBanner() {
  const userTamaguiConfig = useUserTamaguiConfig()

  if (!userTamaguiConfig) return null
  return (
    <YStack marginTop="$3" marginLeft="$3">
      <Theme name="green">
        <XStack minWidth={'87%'} maxWidth={'87%'} br="$4">
          <YStack o={0.62} bg="$color10" fullscreen br="$4" />
          <XStack py={14} px="$3" f={1}>
            <AlertCircle t="$3" l="$3" zi={100} color="$color7" size={22} />
            <Paragraph
              ml="$2.5"
              size="$3"
              fontWeight="200"
              lh="$2"
              color="$color1"
              marginRight="auto"
            >
              Customization enabled
            </Paragraph>
            <Paragraph color="$color4" size="$3" lh="$2">
              These components are customized to your tokens through the customize option.
            </Paragraph>
          </XStack>
        </XStack>
      </Theme>
    </YStack>
  )
}

function Content({
  tab,
  CodeBlock,
}: { tab: { name: string; content: string }; CodeBlock: React.ComponentType<any> }) {
  return (
    <YStack
      width="100%"
      overflow="hidden"
      padding={0}
      backgroundColor="$background"
      tag="pre"
      mih={500}
      data-line-numbers={true}
    >
      <CustomizationEnabledBanner />
      <ScrollView
        showsVerticalScrollIndicator={true}
        width="100%"
        maxHeight={700}
        contentContainerStyle={{
          padding: 12,
        }}
      >
        {CodeBlock ? (
          <CodeBlock
            language="tsx"
            value={tab.content}
            backgroundColor="transparent"
            borderWidth={0}
            line="0"
            marginBottom={0}
          />
        ) : (
          <Spinner />
        )}
      </ScrollView>
    </YStack>
  )
}
