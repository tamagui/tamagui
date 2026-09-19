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

export const codeSyntaxChangeEvent = 'docs-code-syntax-change'
const MDXTabsContext = createContext({ codeSyntax: false, isTailwind: false })
const MDXTabsSearchContext = createContext('')
const codeTabActiveStyle = style({
  backgroundColor: 'color-1 hover:color-1 focus:color-1',
})
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

  return (
    <MDXTabsContext.Provider value={{ codeSyntax, isTailwind }}>
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
}

const Tab = forwardRef(function Tab(props: TabsTabProps, ref) {
  const { codeSyntax } = useContext(MDXTabsContext)

  if (codeSyntax) {
    return (
      <Tabs.Tab
        height={27}
        minHeight={27}
        px="2-5"
        py={0}
        pointerEvents="auto"
        cursor="pointer"
        rounded="3"
        bg="transparent"
        {...props}
        outlineColor="focus-visible:outline-color"
        outlineWidth="focus-visible:2px"
        outlineStyle="focus-visible:solid"
        activeStyle={codeTabActiveStyle}
        ref={ref as any}
      >
        <Paragraph size="2" color="color-11">
          {props.children}
        </Paragraph>
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

const TabsList = (props) => {
  const { codeSyntax, isTailwind } = useContext(MDXTabsContext)

  if (isTailwind) return null

  if (codeSyntax) {
    return (
      <XStack position="absolute" t={24} r={86} z={100}>
        <Tabs.List
          loop={false}
          aria-label="code syntax"
          height={28}
          p={0}
          gap={0}
          rounded="4"
          borderWidth="0-5"
          borderColor="border-color"
          bg="transparent"
          {...props}
        />
      </XStack>
    )
  }

  return (
    <TabsListFrame className="sticky">
      <Tabs.List size="4" width="100%" {...props} />
    </TabsListFrame>
  )
}

export const MDXTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: Tabs.Content,
})
