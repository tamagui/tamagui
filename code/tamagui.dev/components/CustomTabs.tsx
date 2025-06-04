import { useStore, useStoreSelector } from '@tamagui/use-store'
import { useEffect, forwardRef } from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, styled, Tabs, withStaticProperties, XStack } from 'tamagui'
import { type Href, useRouter } from 'one'
import { useParams } from 'one'

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

    router.replace(
      {
        pathname: location.pathname,
        params,
      } as Href,
      {
        scroll: false,
      }
    )
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
      // disableActiveTheme
      size="$3"
      flex={1}
      ref={ref as any}
      elevation="$0.5"
      px="$5"
      pe="auto"
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
  maxWidth: '50%',
  y: -130,
  justifyContent: 'flex-end',
  alignSelf: 'flex-end',
  top: 70,
  marginRight: 0,
  marginBottom: 0,
  zIndex: 10000,
  position: 'sticky' as any,
  right: 0,

  $sm: {
    minWidth: '100%',
    alignSelf: 'stretch',
    marginTop: 0,
  },
})

const TabsList = (props) => {
  return (
    <TabsListFrame className="sticky">
      <Tabs.List size="$4" width="100%" {...props} />
    </TabsListFrame>
  )
}

export const CustomTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: Tabs.Content,
})
