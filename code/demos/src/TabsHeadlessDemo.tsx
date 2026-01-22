import React, { useState } from 'react'
import {
  Button,
  SizableStack,
  ThemeableStack,
  XStack,
  YStack,
  isWeb,
  styled,
} from 'tamagui'
import { createTabs } from '@tamagui/tabs'
import { getButtonSized } from '@tamagui/get-button-sized'

const demos = ['horizontal', 'vertical'] as const

export const TabsFrame = styled(SizableStack, {
  name: 'TabsFrame',
})

export const TabFrame = styled(ThemeableStack, {
  name: 'TabsTrigger',
  render: 'button',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  variants: {
    size: {
      '...size': getButtonSized,
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },

        focusStyle: {
          backgroundColor: '$background',
        },
      },
    },
  } as const,
})

const CONTENT_NAME = 'TabsContent'

export const ContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
  flex: 1,
  p: '$6',
  justify: 'center',
  items: 'center',
  bg: '$color4',
  rounded: '$4',
})

export const CustomTabs = createTabs({
  TabsFrame,
  TabFrame,
  ContentFrame,
})

export function TabsHeadlessDemo() {
  const [demo, setDemo] = useState<(typeof demos)[number]>(demos[0])

  return (
    // web only fix for position relative
    <YStack
      px="$4"
      {...(isWeb && {
        position: 'static',
      })}
    >
      <TabsView flexDirection={demo === 'horizontal' ? 'row' : 'column'} />

      <XStack
        items="center"
        gap="$4"
        position="absolute"
        b="$3"
        l="$4"
        $xxs={{ display: 'none' }}
      >
        <Button
          size="$2"
          onPress={() => setDemo(demo === 'horizontal' ? 'vertical' : 'horizontal')}
        >
          <Button.Text textTransform="capitalize">{demo}</Button.Text>
        </Button>
      </XStack>
    </YStack>
  )
}

const content = ['Home', 'Profile', 'Settings']

const TabsView = ({ flexDirection = 'row' }: { flexDirection: 'row' | 'column' }) => {
  return (
    <CustomTabs
      flexDirection={flexDirection === 'column' ? 'row' : 'column'}
      defaultValue={content[0]}
    >
      <CustomTabs.List flexDirection={flexDirection}>
        {content.map((name, index) => (
          <CustomTabs.Tab
            key={index}
            value={name}
            activeStyle={{ backgroundColor: 'transparent' }}
          >
            {name}
          </CustomTabs.Tab>
        ))}
      </CustomTabs.List>
      {content.map((name, index) => (
        <CustomTabs.Content key={index} value={name}>
          {name}
        </CustomTabs.Content>
      ))}
    </CustomTabs>
  )
}
