import {
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, Tabs, XStack, style, styled, withStaticProperties } from 'tamagui'
import { type Href, useLocalSearchParams, usePathname, useRouter } from 'one'
import { useClipboard } from '~/hooks/useClipboard'
import {
  CODE_CHROME_HEIGHT,
  CODE_CHROME_TAB_WIDTH,
  CodeChromeButton,
  CodeChromeRow,
  CodeChromeSlotProvider,
  CodeChromeText,
  useCodeChromeSlot,
} from './CodeChrome'

const codeSyntaxChangeEvent = 'docs-code-syntax-change'
const MDXTabsContext = createContext({ codeSyntax: false, isTailwind: false, value: '' })
const MDXTabsSearchContext = createContext('')
const tabActiveStyle = style({
  backgroundColor: 'color-7 hover:color-7 focus:color-7',
})

export function useCodeSyntaxTabs() {
  const { codeSyntax, isTailwind } = useContext(MDXTabsContext)
  return codeSyntax && !isTailwind
}

export function MDXTabsSearchProvider({
  children,
  search,
}: {
  children: ReactNode
  search?: string
}) {
  return (
    <MDXTabsSearchContext.Provider value={search ?? ''}>
      {children}
    </MDXTabsSearchContext.Provider>
  )
}

function TabsComponent({
  codeSyntax = false,
  defaultValue,
  ...props
}: TabsProps & { codeSyntax?: boolean }) {
  const router = useRouter()
  const params = useLocalSearchParams()
  const pathname = usePathname()
  const initialSearch = useContext(MDXTabsSearchContext)

  const id = codeSyntax ? 'syntax' : props.id || 'value'
  const isTailwind = codeSyntax && pathname.startsWith('/tailwind')
  const paramValue = params[id]
  const codeSyntaxFromUrl = new URLSearchParams(initialSearch).get('syntax')
  const valueFromUrl = isTailwind
    ? 'string'
    : codeSyntax
      ? codeSyntaxFromUrl === 'typed'
        ? 'typed'
        : 'string'
      : typeof paramValue === 'string'
        ? paramValue
        : (defaultValue ?? '')
  const [value, setValue] = useState(valueFromUrl)

  useEffect(() => {
    setValue(valueFromUrl)
  }, [valueFromUrl])

  useEffect(() => {
    if (!codeSyntax || isTailwind) return

    const syncFromUrl = () => {
      const syntax = new URLSearchParams(location.search).get('syntax')
      setValue(syntax === 'typed' ? 'typed' : 'string')
    }

    syncFromUrl()
    addEventListener(codeSyntaxChangeEvent, syncFromUrl)
    addEventListener('popstate', syncFromUrl)
    return () => {
      removeEventListener(codeSyntaxChangeEvent, syncFromUrl)
      removeEventListener('popstate', syncFromUrl)
    }
  }, [codeSyntax, isTailwind])

  const updateUrl = (newValue: string) => {
    setValue(newValue)
    const url = new URL(location.href)
    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll

    if (codeSyntax) {
      history.replaceState(history.state, '', `${url.pathname}${url.search}`)
      dispatchEvent(new Event(codeSyntaxChangeEvent))
      return
    }

    router.replace(url.toString() as Href, {
      scroll: false,
    })
  }

  const tabs = (
    <MDXTabsContext.Provider value={{ codeSyntax, isTailwind, value }}>
      <Tabs
        onValueChange={updateUrl}
        orientation="horizontal"
        activationMode={codeSyntax ? 'manual' : undefined}
        flexDirection="column"
        position="relative"
        borderWidth={0}
        {...props}
        value={value}
      />
    </MDXTabsContext.Provider>
  )

  // the code block inside a content panel publishes its copy text up to the
  // toggle's row, so both controls render in one flex row instead of two
  // absolutely positioned islands
  return codeSyntax ? <CodeChromeSlotProvider>{tabs}</CodeChromeSlotProvider> : tabs
}

const Tab = forwardRef(function Tab(props: TabsTabProps, ref) {
  const { codeSyntax, value } = useContext(MDXTabsContext)

  if (codeSyntax) {
    return (
      <Tabs.Tab
        height={CODE_CHROME_HEIGHT}
        minHeight={CODE_CHROME_HEIGHT}
        width={CODE_CHROME_TAB_WIDTH}
        px={0}
        py={0}
        items="center"
        justify="center"
        pointerEvents="auto"
        cursor="pointer"
        rounded="3"
        bg="transparent"
        borderWidth={0}
        // above the sliding indicator
        z={1}
        {...props}
        outlineColor="focus-visible:outline-color"
        outlineWidth="focus-visible:2px"
        outlineStyle="focus-visible:solid"
        ref={ref as any}
      >
        <CodeChromeText active={value === props.value}>{props.children}</CodeChromeText>
      </Tabs.Tab>
    )
  }

  return (
    <Tabs.Tab
      // disableActiveTheme
      size="sm"
      flex={1}
      px="5"
      pointerEvents="auto"
      {...props}
      outlineColor="focus:outline-color"
      outlineWidth="focus:2px"
      outlineStyle="focus:solid"
      activeStyle={tabActiveStyle}
      ref={ref as any}
    >
      <Paragraph size="3">{props.children}</Paragraph>
    </Tabs.Tab>
  )
})

const TabsListFrame = styled(XStack, {
  pointerEvents: 'none',
  maxW: '50%',
  mt: '-30px sm:0px',
  justify: 'flex-end',
  self: 'flex-end sm:stretch',
  t: 70,
  mr: 0,
  mb: 0,
  z: 10000,
  position: 'sticky' as any,
  r: 0,
  minW: 'sm:100%',
})

// the two codeSyntax values, in render order, so the indicator knows how far to
// slide. codeSyntax is always this pair (see valueFromUrl above)
const syntaxOrder = ['string', 'typed']

/** copy, rendered from the text the active code block published upward */
const CodeSyntaxCopy = () => {
  const slot = useCodeChromeSlot()
  const { hasCopied, onCopy } = useClipboard(slot?.copyText ?? '')

  if (!slot?.copyText) return null

  return (
    <CodeChromeButton label="Copy code to clipboard" onPress={onCopy}>
      {hasCopied ? 'Copied' : 'Copy'}
    </CodeChromeButton>
  )
}

const TabsList = ({ children, ...props }: any) => {
  const { codeSyntax, isTailwind, value } = useContext(MDXTabsContext)

  if (isTailwind) return null

  if (codeSyntax) {
    const index = Math.max(0, syntaxOrder.indexOf(value))
    return (
      <CodeChromeRow>
        <Tabs.List
          loop={false}
          aria-label="code syntax"
          height={CODE_CHROME_HEIGHT}
          p={0}
          gap={0}
          bg="transparent"
          borderWidth={0}
          position="relative"
          {...props}
        >
          {/* the background is the whole animation: a soft token sliding under
              the active label, no border and no button shape */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: CODE_CHROME_TAB_WIDTH,
              borderRadius: 6,
              backgroundColor: 'var(--color-3)',
              transform: `translateX(${index * 100}%)`,
              transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          {children}
        </Tabs.List>
        <CodeSyntaxCopy />
      </CodeChromeRow>
    )
  }

  return (
    <TabsListFrame className="sticky">
      <Tabs.List size="4" width="100%" {...props}>
        {children}
      </Tabs.List>
    </TabsListFrame>
  )
}

export const MDXTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: Tabs.Content,
})
