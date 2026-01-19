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
import { Button, useIsTouchDevice } from 'tamagui'

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
      <Menu allowFlip placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button size="$4" circular icon={Backpack} scaleIcon={1.2} />
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            p="$1.5"
            minW={180}
            borderWidth={1}
            borderColor="$borderColor"
            transformOrigin="left top"
            enterStyle={{ scale: 0.9, opacity: 0, y: -5 }}
            exitStyle={{ scale: 0.95, opacity: 0, y: -3 }}
            transition="quickest"
            elevation="$3"
          >
            <Menu.Arrow size="$4" borderWidth={1} borderColor="$borderColor" />

            <Menu.Item
              onSelect={onSelect}
              key="about-notes"
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle>About Notes</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Separator />

            <Menu.Item
              onSelect={onSelect}
              key="settings"
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle>Settings</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item
              onSelect={onSelect}
              key="accounts"
              justify="space-between"
              // when title is nested inside a React element then you need to use `textValue`
              textValue="Calendar"
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
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

            <Menu.Separator />

            <Menu.Item
              onSelect={onSelect}
              key="close-notes"
              disabled
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle color="gray">Locked Notes</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item
              onSelect={onSelect}
              destructive
              key="delete-all"
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle color="red">Delete all</Menu.ItemTitle>
            </Menu.Item>

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
                paddingHorizontal={8}
                paddingVertical={5}
                borderRadius={4}
                hoverStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Actions</Menu.ItemTitle>
                <ChevronRight size={12} color="$color10" />
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  enterStyle={{ scale: 0.9, opacity: 0, x: -5 }}
                  exitStyle={{ scale: 0.95, opacity: 0, x: -3 }}
                  transition="quickest"
                  transformOrigin="left top"
                  elevation="$3"
                  minW={160}
                  bg="$background"
                  p="$1.5"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Menu.Label
                    color="$color10"
                    fontWeight="400"
                    fontSize={14}
                    alignSelf="flex-start"
                    paddingHorizontal={8}
                    paddingVertical={5}
                  >
                    Note settings
                  </Menu.Label>
                  <Menu.Item
                    onSelect={onSelect}
                    key="create-note"
                    textValue="Create note"
                    justify="space-between"
                    paddingHorizontal={8}
                    paddingVertical={5}
                    borderRadius={4}
                    hoverStyle={{ bg: '$backgroundHover' }}
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
                    paddingHorizontal={8}
                    paddingVertical={5}
                    borderRadius={4}
                    hoverStyle={{ bg: '$backgroundHover' }}
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
                    paddingHorizontal={8}
                    paddingVertical={5}
                    borderRadius={4}
                    hoverStyle={{ bg: '$backgroundHover' }}
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
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
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
              paddingHorizontal={8}
              paddingVertical={5}
              borderRadius={4}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle>Enable Native</Menu.ItemTitle>
              <Menu.ItemIndicator>
                <Check size={12} color="$color10" />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </>
  )
}
