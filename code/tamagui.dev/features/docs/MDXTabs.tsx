import { forwardRef, useEffect, useState } from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, Tabs, XStack, styled, withStaticProperties } from 'tamagui'
import { type Href, useLocalSearchParams, useRouter } from 'one'

function TabsComponent(props: TabsProps) {
  const router = useRouter()
  const params = useLocalSearchParams()

  const id = props.id || 'value'
  const valueFromUrl =
    typeof params[id] === 'string' ? (params[id] as string) : (props.defaultValue ?? '')
  const [value, setValue] = useState(valueFromUrl)

  useEffect(() => {
    setValue(valueFromUrl)
  }, [valueFromUrl])

  const updateUrl = (newValue: string) => {
    setValue(newValue)
    const url = new URL(location.href)
    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll

    router.replace(url.toString() as Href, {
      scroll: false,
    })
  }

  return (
    <Tabs
      onValueChange={updateUrl}
      orientation="horizontal"
      flexDirection="column"
      borderWidth={0}
      {...props}
      value={value}
    />
  )
}

const Tab = forwardRef(function Tab(props: TabsTabProps, ref) {
  return (
    <Tabs.Tab
      // disableActiveTheme
      size="3"
      flex={1}
      px="5"
      pointerEvents="auto"
      {...props}
      outlineColor="focus:outline-color"
      outlineWidth="focus:2px"
      outlineStyle="focus:solid"
      activeStyle={{
        backgroundColor: 'color-7 hover:color-7 focus:color-7',
      }}
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
