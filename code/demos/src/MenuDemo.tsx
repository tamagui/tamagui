import {
  Backpack,
  Calendar,
  Check,
  ChevronRight,
  FilePlus,
  RefreshCw,
  Trash2,
} from '@tamagui/lucide-icons'
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

export function MenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)

  // Note: `item` is the Event on web, undefined on native
  const onSelect = (item) => {
    console.info(`selected`, item)
  }

  return (
    <>
      <Menu offset={8}>
        <Menu.Trigger asChild>
          <Button size="$4" icon={Backpack}>
            Open
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            transition="100ms"
            borderRadius="$4"
            enterStyle={{ scale: 0.9, opacity: 0, y: -5 }}
            exitStyle={{ scale: 0.95, opacity: 0, y: -3 }}
            elevation="$4"
          >
            <Menu.Arrow size="$4" borderWidth={1} borderColor="$borderColor" />

            <Menu.ScrollView>
              <Menu.Item onSelect={onSelect} key="about-notes">
                <Menu.ItemTitle>About Notes</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Separator />

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
                    // pointSize: 20,
                  }}
                >
                  <Calendar color="gray" size={14} />
                </Menu.ItemIcon>
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item onSelect={onSelect} key="close-notes" disabled>
                <Menu.ItemTitle color="gray">Locked Notes</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item onSelect={onSelect} destructive key="delete-all">
                <Menu.ItemTitle color="red">Delete all</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Separator />

              <Menu.Sub open={subMenuOpen} onOpenChange={setSubMenuOpen}>
                <Menu.SubTrigger
                  justify="space-between"
                  key="actions-trigger"
                  textValue="Actions"
                >
                  <Menu.ItemTitle>Actions</Menu.ItemTitle>
                  <ChevronRight size={16} color="$color10" />
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <Menu.SubContent
                    enterStyle={{ scale: 0.9, opacity: 0, x: -5 }}
                    exitStyle={{ scale: 0.95, opacity: 0, x: -3 }}
                    transition="100ms"
                    transformOrigin="left top"
                    elevation="$3"
                    minW={160}
                    bg="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <Menu.Label py="$1" color="$color8">
                      Note settings
                    </Menu.Label>
                    <Menu.Item
                      onSelect={onSelect}
                      key="create-note"
                      textValue="Create note"
                      justify="space-between"
                    >
                      <Menu.ItemTitle>Create note</Menu.ItemTitle>
                      <Menu.ItemIcon>
                        <FilePlus size={14} color="$color10" />
                      </Menu.ItemIcon>
                    </Menu.Item>
                    <Menu.Item
                      onSelect={onSelect}
                      key="delete-all-notes"
                      textValue="Delete all notes"
                      justify="space-between"
                    >
                      <Menu.ItemTitle>Delete all notes</Menu.ItemTitle>
                      <Menu.ItemIcon>
                        <Trash2 size={14} color="$color10" />
                      </Menu.ItemIcon>
                    </Menu.Item>
                    <Menu.Item
                      onSelect={onSelect}
                      key="sync-all"
                      textValue="Sync notes"
                      justify="space-between"
                    >
                      <Menu.ItemTitle>Sync notes</Menu.ItemTitle>
                      <Menu.ItemIcon>
                        <RefreshCw size={14} color="$color10" />
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
                justify="space-between"
              >
                <Menu.ItemTitle>Mark as read</Menu.ItemTitle>
                <Menu.ItemIndicator>
                  <Check size={12} color="$color10" />
                </Menu.ItemIndicator>
              </Menu.CheckboxItem>
              <Menu.CheckboxItem
                key="show-other-notes"
                checked={native}
                onCheckedChange={setNative}
                justify="space-between"
              >
                <Menu.ItemTitle>Enable Native</Menu.ItemTitle>
                <Menu.ItemIndicator>
                  <Check size={12} color="$color10" />
                </Menu.ItemIndicator>
              </Menu.CheckboxItem>
            </Menu.ScrollView>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </>
  )
}
