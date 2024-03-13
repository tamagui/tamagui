import { useRouter } from 'next/router'
import React, { forwardRef } from 'react'
import type { TabsProps, TabsTabProps } from 'tamagui'
import { Paragraph, styled, Tabs, withStaticProperties, XStack } from 'tamagui'
import { useStore, useStoreSelector } from '@tamagui/use-store'

class TabsStore {
  active = 'styled'
}

function TabsComponent(props: TabsProps) {
  const router = useRouter()
  const store = useStore(TabsStore)

  const id = props.id || 'value'

  const updateUrl = (newValue: string) => {
    store.active = newValue
    const url = new URL(location.href)
    url.searchParams.set(id, newValue)
    url.hash = '' // having this set messes with the scroll
    router.replace(url, undefined, {
      scroll: false,
      shallow: true,
    })
  }

  const value =
    typeof router.query[id] === 'string'
      ? (router.query[id] as string)
      : props.defaultValue

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
      bblr={0}
      bbrr={0}
      btlr="$5"
      btrr="$5"
      {...props}
      hoverStyle={{ h: '$3.5', mt: '$-1.5', backgroundColor: '$color3' }}
      pressStyle={{ h: '$2', mt: '$2', backgroundColor: '$color2' }}
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
  justifyContent: 'center',
  alignSelf: 'stretch',
  marginRight: 0,
  marginBottom: 0,
  pb: '$2',
  mt: '$4',
  zIndex: 10000,
  position: 'sticky' as any,

  $sm: {
    minWidth: '100%',
    alignSelf: 'stretch',
    marginTop: 0,
  },
})

const TabsList = (props) => {
  return (
    <TabsListFrame className="sticky">
      <Tabs.List w="100%" {...props} />
    </TabsListFrame>
  )
}

const TabsContent = (props) => {
  return (
    <Tabs.Content
      width="100%"
      jc="center"
      ai="stretch"
      t="$-2"
      px="$6"
      borderColor="$background"
      bw="$1"
      btw={0}
      bblr="$5"
      bbrr="$5"
      btlr={0}
      btrr={0}
      {...props}
    />
  )
}

export const WideTabs = withStaticProperties(TabsComponent, {
  List: TabsList,
  Tab,
  Content: TabsContent,
})
