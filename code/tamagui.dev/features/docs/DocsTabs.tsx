import { useStore, useStoreSelector } from '@tamagui/use-store'
import { forwardRef } from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, Tabs, XStack, styled, withStaticProperties } from 'tamagui'
import { type Href, router, useParams } from 'one'

class TabsStore {
  active = 'styled'
}

function TabsComponent(props: TabsProps) {
  const params = useParams()
  const store = useStore(TabsStore)

  const id = props.id || 'value'

  const updateUrl = (newValue: string) => {
    store.active = newValue
    const url = new URL(location.href)
    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll
    router.replace(url as Href)
  }

  const value =
    typeof params[id] === 'string' ? (params[id] as string) : (props.defaultValue ?? '')

  return (
    <Tabs
      onValueChange={updateUrl}
      unstyled
      orientation="horizontal"
      flexDirection="column"
      borderWidth={0}
      position="unset"
      {...props}
      value={value ?? ''}
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
      pointerEvents="auto"
      {...props}
      focusStyle={{
        outlineColor: '$outlineColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
      }}
      {...(isActive && {
        bg: '$color7',
        hoverStyle: {
          bg: '$color7',
        },
        focusStyle: {
          bg: '$color7',
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
  mt: -30,
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

export const DocsTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: Tabs.Content,
})
