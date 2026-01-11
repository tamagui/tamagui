import {
  Backpack,
  Calendar,
  Check,
  ChevronRight,
  FilePlus,
  Trash2,
  RefreshCw,
} from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, View, useIsTouchDevice } from 'tamagui'

/**
 * Menu Demo using Tamagui Menu component.
 * Automatically uses native menus on iOS/Android, web menus on web.
 * No configuration needed - it just works!
 */

/**
 * Note: you'll want to use createMenu() to customize further.
 */

export function MenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)
  const isTouchDevice = useIsTouchDevice()

  // Note: `item` is the Event on web, undefined on native
  const onSelect = (item) => {
    console.info(`selected`, item)
  }

  return (
    <>
      <Menu
        allowFlip
        placement="bottom"
      >
        <Menu.Trigger asChild>
          <Button size="$3" circular icon={Backpack} scaleIcon={1.2} />
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            style={{ paddingHorizontal: 0 }}
            borderWidth={1}
            items="flex-start"
            borderColor="$borderColor"
            transformOrigin="center top"
            enterStyle={{ scale: 0.4, opacity: 0, y: -10 }}
            exitStyle={{ scale: 0.6, opacity: 0, y: -5 }}
            animation="menu"
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
                justify="space-between"
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
                <Menu.ItemTitle color="gray">Locked Notes</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item onSelect={onSelect} destructive key="delete-all">
                <Menu.ItemTitle color="red">Delete all</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Group>

            <Menu.Separator />

            <Menu.Sub
              open={subMenuOpen}
              placement={isTouchDevice ? 'bottom' : 'right-start'}
              onOpenChange={setSubMenuOpen}
            >
              <Menu.SubTrigger
                justify="space-between"
                key="actions-trigger"
                textValue="Actions"
              >
                <>
                  <Menu.ItemTitle>Actions</Menu.ItemTitle>
                  <View rotate={subMenuOpen ? '90deg' : '0deg'} animation="quicker">
                    <ChevronRight size="$1" />
                  </View>
                </>
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  enterStyle={{ scale: 0.5, opacity: 0, y: -5 }}
                  exitStyle={{ scale: 0.7, opacity: 0, y: -3 }}
                  animation="menu"
                  transformOrigin="left top"
                  elevation="$5"
                  scale={1.02}
                  bg="$color1"
                >
                  <Menu.Item
                    onSelect={onSelect}
                    key="create-note"
                    textValue="Create note"
                  >
                    <Menu.ItemTitle>Create note</Menu.ItemTitle>
                    <Menu.ItemIcon>
                      <FilePlus size={18} color="$color10" />
                    </Menu.ItemIcon>
                  </Menu.Item>
                  <Menu.Item
                    onSelect={onSelect}
                    key="delete-all"
                    textValue="Delete all notes"
                  >
                    <Menu.ItemTitle>Delete all notes</Menu.ItemTitle>
                    <Menu.ItemIcon>
                      <Trash2 size={18} color="$color10" />
                    </Menu.ItemIcon>
                  </Menu.Item>
                  <Menu.Item onSelect={onSelect} key="sync-all" textValue="Sync notes">
                    <Menu.ItemTitle>Sync notes</Menu.ItemTitle>
                    <Menu.ItemIcon>
                      <RefreshCw size={18} color="$color10" />
                    </Menu.ItemIcon>
                  </Menu.Item>
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
                <Check size={16} color="$color10" />
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
                <Check size={16} color="$color10" />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>

            <Menu.Arrow size={'$2'} />
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </>
  )
}
