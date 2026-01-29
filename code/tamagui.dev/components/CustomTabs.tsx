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
  const value =
    typeof query[id] === 'string' ? (query[id] as string) : (props.defaultValue ?? '')

  return (
    <Tabs
      activationMode="manual"
      onValueChange={updateUrl}
      unstyled
      orientation="horizontal"
      flexDirection="column"
      borderWidth={0}
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
      px="$5"
      pointerEvents="auto"
      {...props}
      focusStyle={{
        outlineColor: '$outlineColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
      }}
      {...(isActive && {
        bg: '$color4',
        hoverStyle: {
          bg: '$color4',
        },
        focusStyle: {
          bg: '$color4',
        },
      })}
    >
      <Paragraph size="$3">{props.children}</Paragraph>
    </Tabs.Tab>
  )
})

const TabsListFrame = styled(XStack, {
  pointerEvents: 'none',
  maxW: '50%',
  y: -130,
  justify: 'flex-end',
  self: 'flex-end',
  t: 70,
  mr: 0,
  mb: 0,
  z: 10000,
  position: 'sticky' as any,
  r: 0,

  $sm: {
    minW: '100%',
    self: 'stretch',
    mt: 0,
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
