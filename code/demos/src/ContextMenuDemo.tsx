import { ContextMenu } from '@tamagui/context-menu'
import { Calendar, Check, ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Text, YStack } from 'tamagui'

/**
 * Note: you'll want to use createMenu() to customize further.
 */

export function ContextMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)

  const onSelect = () => {
    console.info('onSelect')
  }

  return (
    <ContextMenu allowFlip native={native} placement="bottom-start" offset={14}>
      <ContextMenu.Trigger asChild>
        <Text text="center" select={null}>
          Right Click or Long Press
        </Text>
      </ContextMenu.Trigger>

      <ContextMenu.Portal zIndex={100}>
        <ContextMenu.Content
          p="$1.5"
          minW={180}
          borderWidth={1}
          borderColor="$borderColor"
          transformOrigin="left top"
          enterStyle={{ scale: 0.9, opacity: 0, y: -5 }}
          exitStyle={{ scale: 0.95, opacity: 0, y: -3 }}
          elevation="$3"
          transition="quickest"
        >
          <ContextMenu.Arrow size="$4" borderWidth={1} borderColor="$borderColor" />

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
          <ContextMenu.Item
            onSelect={onSelect}
            key="about-notes"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle>About Notes</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Separator />

          <ContextMenu.Item
            onSelect={onSelect}
            key="settings"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle>Settings</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item
            onSelect={onSelect}
            justify="space-between"
            textValue="Calendar"
            key="accounts"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle>Calendar</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon
              androidIconName="ic_menu_today"
              ios={{
                name: 'calendar',
              }}
            >
              <Calendar color="gray" size={14} />
            </ContextMenu.ItemIcon>
          </ContextMenu.Item>

          <ContextMenu.Separator />

          <ContextMenu.Item
            onSelect={onSelect}
            key="close-notes"
            disabled
            textValue="Locked Notes"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle color="gray">Locked Notes</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item
            destructive
            onSelect={onSelect}
            key="delete-all"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle color="red">Delete all</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          {/* Submenu */}
          <ContextMenu.Sub placement="right-start">
            <ContextMenu.SubTrigger
              key="actions-trigger"
              justify="space-between"
              textValue="Actions"
              style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
              hoverStyle={{ bg: '$backgroundHover' }}
            >
              <ContextMenu.ItemTitle>Actions</ContextMenu.ItemTitle>
              <ChevronRight size={12} color="$color10" />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal zIndex={200}>
              <ContextMenu.SubContent
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
                <ContextMenu.Label
                  color="$color10"
                  fontWeight="400"
                  fontSize={14}
                  alignSelf="flex-start"
                  style={{ paddingHorizontal: 8, paddingVertical: 5 }}
                >
                  Note settings
                </ContextMenu.Label>
                <ContextMenu.Item
                  onSelect={onSelect}
                  key="create-note"
                  textValue="Create note"
                  style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
                  <ContextMenu.ItemTitle>Create note</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item
                  onSelect={onSelect}
                  key="delete-all"
                  textValue="Delete all notes"
                  style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
                  <ContextMenu.ItemTitle>Delete all notes</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item
                  onSelect={onSelect}
                  key="sync-all"
                  textValue="Sync notes"
                  style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
                  <ContextMenu.ItemTitle>Sync notes</ContextMenu.ItemTitle>
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Separator className="MenuSeparator" />
          <ContextMenu.CheckboxItem
            key="show-hidden"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
            justify="space-between"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle>Mark as read</ContextMenu.ItemTitle>
            <ContextMenu.ItemIndicator>
              <Check size={12} color="$color10" />
            </ContextMenu.ItemIndicator>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            key="show-other-notes"
            checked={native}
            onCheckedChange={setNative}
            justify="space-between"
            style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 }}
            hoverStyle={{ bg: '$backgroundHover' }}
          >
            <ContextMenu.ItemTitle>Enable Native</ContextMenu.ItemTitle>
            <ContextMenu.ItemIndicator>
              <Check size={12} color="$color10" />
            </ContextMenu.ItemIndicator>
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  )
}
