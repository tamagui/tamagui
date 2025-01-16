import { useStore, useStoreSelector } from '@tamagui/use-store'
import { forwardRef } from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, Tabs, XStack, styled, withStaticProperties } from 'tamagui'
import { type Href, useParams, useRouter } from 'one'

class TabsStore {
  active = 'styled'
}

function TabsComponent(props: TabsProps) {
  const router = useRouter()
  const query = useParams()
  const store = useStore(TabsStore)

  const id = props.id || 'value'

  const updateUrl = (newValue: string) => {
    store.active = newValue
    const url = new URL(location.href)
    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll

    const params = Object.fromEntries(url.searchParams?.entries() ?? [])

    router.replace({
      pathname: location.pathname,
      params,
    } as Href, {
      scroll: false,
    })
  }

  const value = typeof query[id] === 'string' ? (query[id] as string) : props.defaultValue

  return (
    <Tabs
      onValueChange={updateUrl}
      unstyled
      orientation="horizontal"
      flexDirection="column"
      borderWidth={0}
      position="unset"
      {...props}
      value={value}
    />
  )
}

const Tab = forwardRef(function Tab(props: TabsTabProps, ref) {
  const isActive = useStoreSelector(TabsStore, (x) => x.active === props.value)

  return (
    <Tabs.Tab
      size="$3"
      flex={1}
      ref={ref as any}
      elevation="$0.5"
      px="$5"
      pe="auto"
      br="$5"
      {...props}
      focusStyle={{
        outlineColor: '$outlineColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
      }}
      {...(isActive && {
        backgroundColor: '$color7',
        hoverStyle: {
          backgroundColor: '$color7',
        },
        focusStyle: {
          backgroundColor: '$color7',
        },
      })}
    >
      <Paragraph size="$3">{props.children}</Paragraph>
    </Tabs.Tab>
  )
})

const TabsListFrame = styled(XStack, {
  pe: 'none',
  maxWidth: '100%',
  height: '$4',
  alignSelf: 'stretch',
  marginRight: 0,
  marginBottom: 0,
  pb: '$2',
  zIndex: 10000,
  position: 'sticky' as any,

  px: '$2',
  ai: 'center',
  bc: '$color4',
  bbw: '$1',
  br: '$2',

  $sm: {
    minWidth: '100%',
    alignSelf: 'stretch',
    marginTop: 0,
  },
})

const TabsList = (props) => {
  return (
    <TabsListFrame className="sticky">
      <Tabs.List gap="$3" {...props} />
    </TabsListFrame>
  )
}

const TabsContent = (props) => {
  return (
    <Tabs.Content width="100%" jc="flex-start" ai="stretch" t="$-2" pt="$4" {...props} />
  )
}

export const InlineTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: TabsContent,
})
