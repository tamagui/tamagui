import { ContextMenu } from '@tamagui/context-menu'
import { Calendar, Check, ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { styled, Text, YStack } from 'tamagui'

/**
 * Note: you'll want to use createMenu() to customize further.
 */

const Item = styled(ContextMenu.Item, {
  py: 4,
  hoverStyle: {
    bg: '$color2',
  },
  pressStyle: {
    bg: '$color3',
  },
})

const ItemTitle = styled(ContextMenu.ItemTitle, {
  color: '$color11',
})

Item.displayName = 'Item'
ItemTitle.displayName = 'ItemTitle'

export function ContextMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)

  const onSelect = () => {
    console.info('onSelect')
  }

  return (
    <ContextMenu allowFlip native={native} placement="right-start">
      <ContextMenu.Trigger asChild>
        <Text text="center" select={null}>
          Right Click or longPress
        </Text>
      </ContextMenu.Trigger>

      <ContextMenu.Portal zIndex={100}>
        <ContextMenu.Content
          px={0}
          borderWidth={1}
          items="flex-start"
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          transition={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <ContextMenu.Preview>
            {() => {
              return (
                <YStack
                  items="center"
                  justify="center"
                  height={100}
                  width={250}
                  style={{ backgroundColor: 'pink' }}
                >
                  <Text>Your Preview here</Text>
                </YStack>
              )
            }}
          </ContextMenu.Preview>
          <ContextMenu.Item onSelect={onSelect} key="about-notes">
            <ContextMenu.ItemTitle>About Notes</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Group backgroundColor="transparent">
            <ContextMenu.Item onSelect={onSelect} key="settings">
              <ContextMenu.ItemTitle>Settings</ContextMenu.ItemTitle>
            </ContextMenu.Item>
            <ContextMenu.Item
              onSelect={onSelect}
              justify="space-between"
              // when title is nested inside a React element then you need to use `textValue`
              textValue="Calender"
              key="accounts"
            >
              <ContextMenu.ItemTitle>
                <Text>Calender</Text>
              </ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon
                androidIconName="ic_menu_today"
                ios={{
                  name: 'calendar',
                }}
              >
                <Calendar color="gray" size="$1" />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group backgroundColor="transparent">
            <ContextMenu.Item
              onSelect={onSelect}
              key="close-notes"
              disabled
              textValue="locked notes"
            >
              <ContextMenu.ItemTitle>
                <Text color="gray">locked notes</Text>
              </ContextMenu.ItemTitle>
            </ContextMenu.Item>
            <ContextMenu.Item destructive onSelect={onSelect} key="delete-all">
              <ContextMenu.ItemTitle color="red">Delete all</ContextMenu.ItemTitle>
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          {/* Submenu */}
          <ContextMenu.Sub placement="right-start">
            <ContextMenu.SubTrigger
              key="actions-trigger"
              justify="space-between"
              textValue="Actions"
            >
              <ContextMenu.ItemTitle>Actions</ContextMenu.ItemTitle>
              <ChevronRight size="$1" />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal zIndex={200}>
              <ContextMenu.SubContent
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                transition={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
                px={0}
              >
                <Item onSelect={onSelect} key="create-note" textValue="Create note">
                  <ItemTitle>Create note</ItemTitle>
                </Item>
                <Item onSelect={onSelect} key="delete-all" textValue="Delete all notes">
                  <ItemTitle>Delete all notes</ItemTitle>
                </Item>
                <Item onSelect={onSelect} key="sync-all" textValue="Sync notes">
                  <ItemTitle>Sync notes</ItemTitle>
                </Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Separator className="MenuSeparator" />
          <ContextMenu.CheckboxItem
            key="show-hidden"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
            gap="$2"
            justify="space-between"
          >
            <ContextMenu.ItemTitle>Mark as read</ContextMenu.ItemTitle>
            <ContextMenu.ItemIndicator>
              <Check size="$1" />
            </ContextMenu.ItemIndicator>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            key="show-other-notes"
            checked={native}
            onCheckedChange={setNative}
            gap="$2"
            justify="space-between"
          >
            <ContextMenu.ItemTitle>Enable Native</ContextMenu.ItemTitle>
            <ContextMenu.ItemIndicator>
              <Check size="$1" />
            </ContextMenu.ItemIndicator>
          </ContextMenu.CheckboxItem>

          <ContextMenu.Arrow size={'$2'} />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  )
}
