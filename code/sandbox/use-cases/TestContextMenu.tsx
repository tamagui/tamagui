import { styled } from '@tamagui/core'
import { ContextMenu } from '@tamagui/context-menu'
import { Calendar, Check, ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button } from 'tamagui'

/**
 * ContextMenu Demo using Tamagui ContextMenu component.
 * Automatically uses native menus on iOS/Android, web menus on web.
 * No configuration needed - it just works!
 */

/**
 * Note: you'll want to use createMenu() to customize further.
 */

const Item = styled(ContextMenu.Item, {
  paddingVertical: 4,
  color: '$color11',
  hoverStyle: {
    backgroundColor: '$color2',
  },
  pressStyle: {
    backgroundColor: '$color3',
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

  // Note: `item` is the Event on web, undefined on native
  const onSelect = (item) => {
    console.info(`selected`, item)
  }

  return (
    <>
      <ContextMenu allowFlip placement="right-start">
        <ContextMenu.Trigger asChild>
          <Button>Right Click or longPress</Button>
        </ContextMenu.Trigger>

        <ContextMenu.Portal zIndex={100}>
          <ContextMenu.Content
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
            <ContextMenu.Preview>
              {() => null}
            </ContextMenu.Preview>

            <ContextMenu.Item onSelect={onSelect} key="about-notes">
              <ContextMenu.ItemTitle>About Notes</ContextMenu.ItemTitle>
            </ContextMenu.Item>

            <ContextMenu.Separator />

            <ContextMenu.Group>
              <ContextMenu.Item onSelect={onSelect} key="settings">
                <ContextMenu.ItemTitle>Settings</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item
                onSelect={onSelect}
                key="accounts"
                jc="space-between"
                // when title is nested inside a React element then you need to use `textValue`
                textValue="Calendar"
              >
                <ContextMenu.ItemTitle>Calendar</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  androidIconName="ic_menu_today"
                  ios={{
                    name: 'calendar',
                    hierarchicalColor: '#000',
                    pointSize: 20,
                  }}
                >
                  <Calendar color="gray" size={14} />
                </ContextMenu.ItemIcon>
              </ContextMenu.Item>
            </ContextMenu.Group>

            <ContextMenu.Separator />

            <ContextMenu.Group>
              <ContextMenu.Item onSelect={onSelect} key="close-notes" disabled>
                <ContextMenu.ItemTitle color="gray">locked notes</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item onSelect={onSelect} destructive key="delete-all">
                <ContextMenu.ItemTitle color="red">Delete all</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.Group>

            <ContextMenu.Separator />

            {/* Submenu */}
            <ContextMenu.Sub placement="right-start">
              <ContextMenu.SubTrigger
                jc="space-between"
                key="actions-trigger"
                textValue="Actions"
              >
                <>
                  <ContextMenu.ItemTitle>Actions</ContextMenu.ItemTitle>
                  <ChevronRight size="$1" />
                </>
              </ContextMenu.SubTrigger>

              <ContextMenu.Portal zIndex={200}>
                <ContextMenu.SubContent
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
                  <ContextMenu.Label fontSize={'$1'}>Note settings</ContextMenu.Label>
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

            <ContextMenu.Separator />

            <ContextMenu.CheckboxItem
              key="show-hidden"
              checked={bookmarksChecked}
              onCheckedChange={setBookmarksChecked}
              gap={'$2'}
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
              gap={'$2'}
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
    </>
  )
}
