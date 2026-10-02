import {
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, Tabs, XStack, style, withStaticProperties } from 'tamagui'
import { type Href, useLocalSearchParams, usePathname, useRouter } from 'one'

export const codeSyntaxChangeEvent = 'docs-code-syntax-change'
const SYNTAX_PREF_KEY = 'tamagui_syntax_preference'

const MDXTabsContext = createContext({ codeSyntax: false, isTailwind: false })
const MDXTabsSearchContext = createContext('')

const codeTabActiveStyle = style({
  backgroundColor: 'color-4 hover:color-4 focus:color-4',
})

const generalTabActiveStyle = style({
  backgroundColor: 'color-4 hover:color-4 focus:color-4',
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

  const getResolvedValue = () => {
    if (isTailwind) return 'string'
    if (codeSyntax) {
      const codeSyntaxFromUrl = new URLSearchParams(initialSearch).get('syntax')
      if (codeSyntaxFromUrl === 'typed' || codeSyntaxFromUrl === 'object') return 'typed'
      if (codeSyntaxFromUrl === 'string') return 'string'
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(SYNTAX_PREF_KEY)
        if (saved === 'object' || saved === 'typed') return 'typed'
      }
      return 'string'
    }
    return typeof paramValue === 'string' ? paramValue : (defaultValue ?? '')
  }

  const [value, setValue] = useState(getResolvedValue)

  useEffect(() => {
    setValue(getResolvedValue())
  }, [initialSearch, pathname])

  useEffect(() => {
    if (!codeSyntax || isTailwind) return

    const syncFromUrl = () => {
      const syntax = new URLSearchParams(location.search).get('syntax')
      if (syntax === 'typed' || syntax === 'object') {
        setValue('typed')
        return
      }
      if (syntax === 'string') {
        setValue('string')
        return
      }
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(SYNTAX_PREF_KEY)
        setValue(saved === 'object' || saved === 'typed' ? 'typed' : 'string')
      }
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

    if (codeSyntax) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SYNTAX_PREF_KEY, newValue === 'typed' ? 'object' : 'string')
      }
      if (newValue === 'typed') {
        url.searchParams.set('syntax', 'typed')
      } else {
        url.searchParams.delete('syntax')
      }
      history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`)
      dispatchEvent(new Event(codeSyntaxChangeEvent))
      return
    }

    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll

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
        height={22}
        minHeight={22}
        px="2"
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
        <Paragraph size="1" fontSize={11} color="color-11">
          {props.children}
        </Paragraph>
      </Tabs.Tab>
    )
  }

  return (
    <Tabs.Tab
      height={28}
      minHeight={28}
      px="3-5"
      py={0}
      pointerEvents="auto"
      cursor="pointer"
      rounded="3"
      bg="transparent"
      {...props}
      outlineColor="focus:outline-color"
      outlineWidth="focus:2px"
      outlineStyle="focus:solid"
      activeStyle={generalTabActiveStyle}
      ref={ref as any}
    >
      <Paragraph size="2" color="color-12" whiteSpace="nowrap">
        {props.children}
      </Paragraph>
    </Tabs.Tab>
  )
})

const TabsList = (props) => {
  const { codeSyntax, isTailwind } = useContext(MDXTabsContext)

  if (isTailwind) return null

  if (codeSyntax) {
    return (
      <XStack
        justify="flex-end"
        items="center"
        mb="1-5"
        self="flex-end"
        width="100%"
        z={10}
      >
        <Tabs.List
          loop={false}
          aria-label="code syntax"
          height={26}
          p="2px"
          gap={0}
          rounded="4"
          borderWidth={1}
          borderColor="border-color"
          bg="color-2"
          {...props}
        />
      </XStack>
    )
  }

  return (
    <XStack my="3" self="flex-start" items="center">
      <Tabs.List
        loop={false}
        aria-label="tabs"
        height={32}
        p="2px"
        gap={0}
        rounded="4"
        borderWidth={1}
        borderColor="border-color"
        bg="color-1"
        {...props}
      />
    </XStack>
  )
}

export const MDXTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: Tabs.Content,
})
