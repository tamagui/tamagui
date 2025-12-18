import { styled } from '@tamagui/core'
import { Backpack, Calendar, Check, ChevronRight } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button } from 'tamagui'

/**
 * Menu Demo using Tamagui Menu component.
 * Automatically uses native menus on iOS/Android, web menus on web.
 * No configuration needed - it just works!
 */

/**
 * Note: you'll want to use createMenu() to customize further.
 */

const Item = styled(Menu.Item, {
  paddingVertical: 4,
  hoverStyle: {
    backgroundColor: '$color2',
  },
  pressStyle: {
    backgroundColor: '$color3',
  },
})

const ItemTitle = styled(Menu.ItemTitle, {
  color: '$color11',
})

Item.displayName = 'Item'
ItemTitle.displayName = 'ItemTitle'

export function MenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)

  // Note: `item` is the Event on web, undefined on native
  const onSelect = (item) => {
    console.info(`selected`, item)
  }

  return (
    <>
      <Menu
        offset={{
          crossAxis: 25,
        }}
        allowFlip
        placement="bottom-start"
      >
        <Menu.Trigger asChild>
          <Button borderRadius="$10" icon={Backpack} scaleIcon={1.2} />
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            paddingHorizontal={0}
            borderWidth={1}
            ai="flex-start"
            borderColor="$borderColor"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            animation={[
              'quicker',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
          >
            <Menu.Item onSelect={onSelect} key="about-notes">
              <Menu.ItemTitle>About Notes</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Separator />

            <Menu.Group>
              <Menu.Item onSelect={onSelect} key="settings">
                <Menu.ItemTitle>Settings</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item
                onSelect={onSelect}
                key="accounts"
                jc="space-between"
                // when title is nested inside a React element then you need to use `textValue`
                textValue="Calendar"
              >
                <Menu.ItemTitle>Calendar</Menu.ItemTitle>
                <Menu.ItemIcon
                  androidIconName="ic_menu_today"
                  ios={{
                    name: 'calendar',
                    hierarchicalColor: '#000',
                    pointSize: 20,
                  }}
                >
                  <Calendar color="gray" size={14} />
                </Menu.ItemIcon>
              </Menu.Item>
            </Menu.Group>

            <Menu.Separator />

            <Menu.Group>
              <Menu.Item onSelect={onSelect} key="close-notes" disabled>
                <Menu.ItemTitle color="gray">locked notes</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item onSelect={onSelect} destructive key="delete-all">
                <Menu.ItemTitle color="red">Delete all</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Group>

            <Menu.Separator />

            {/* Submenu */}
            <Menu.Sub placement="right-start">
              <Menu.SubTrigger
                jc="space-between"
                key="actions-trigger"
                textValue="Actions"
              >
                <>
                  <Menu.ItemTitle>Actions</Menu.ItemTitle>
                  <ChevronRight size="$1" />
                </>
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  enterStyle={{ y: -10, opacity: 0 }}
                  exitStyle={{ y: -10, opacity: 0 }}
                  animation={[
                    'quicker',
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  paddingHorizontal={0}
                >
                  <Menu.Label fontSize={'$1'}>Note settings</Menu.Label>
                  <Item onSelect={onSelect} key="create-note" textValue="Create note">
                    <ItemTitle>Create note</ItemTitle>
                  </Item>
                  <Item onSelect={onSelect} key="delete-all" textValue="Create note">
                    <ItemTitle>Delete all notes</ItemTitle>
                  </Item>
                  <Item onSelect={onSelect} key="sync-all" textValue="Sync notes">
                    <ItemTitle>Sync notes</ItemTitle>
                  </Item>
                </Menu.SubContent>
              </Menu.Portal>
            </Menu.Sub>

            <Menu.Separator />

            <Menu.CheckboxItem
              key="show-hidden"
              checked={bookmarksChecked}
              onCheckedChange={setBookmarksChecked}
              gap={'$2'}
            >
              <Menu.ItemTitle>Mark as read</Menu.ItemTitle>
              <Menu.ItemIndicator>
                <Check size="$1" />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>
            <Menu.CheckboxItem
              key="show-other-notes"
              checked={native}
              onCheckedChange={setNative}
              gap={'$2'}
            >
              <Menu.ItemTitle>Enable Native</Menu.ItemTitle>
              <Menu.ItemIndicator>
                <Check size="$1" />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>

            <Menu.Arrow size={'$2'} />
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </>
  )
}
