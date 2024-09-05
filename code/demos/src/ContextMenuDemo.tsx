import { ContextMenu } from '@tamagui/context-menu'
import { isAndroid, isWeb } from '@tamagui/core'
import { Calendar, Check } from '@tamagui/lucide-icons'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Image } from 'react-native'
import { Text, YStack, useEvent } from 'tamagui'

export function ContextMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(true)

  const onSelect = useEvent(() => {})

  return (
    <ContextMenu allowFlip native={native} placement="bottom-start">
      <ContextMenu.Trigger asChild>
        <YStack
          jc="center"
          ai="center"
          bw={1}
          boc="$borderColor"
          width={250}
          height={200}
        >
          <Text textAlign="center">Right Click or longPress</Text>
        </YStack>
      </ContextMenu.Trigger>

      <ContextMenu.Portal zIndex={100}>
        <ContextMenu.Content
          paddingHorizontal={0}
          maxWidth={180}
          borderWidth={1}
          ai="flex-start"
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
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
                <YStack bc="$green1" jc="center" ai="center" p={20}>
                  <Text>Your Preview here</Text>
                  <Image
                    width={240}
                    height={100}
                    resizeMode="contain"
                    source={{ uri: 'https://tamagui.dev/social.png' }}
                  />
                </YStack>
              )
            }}
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
              jc="space-between"
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
                  name: 'u.square',
                  hierarchicalColor: '#000',
                  pointSize: 20,
                }}
              >
                <Calendar color="gray" size="$1" />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item onSelect={onSelect} key="close-notes" disabled>
              <ContextMenu.ItemTitle color="gray">locked notes</ContextMenu.ItemTitle>
            </ContextMenu.Item>
            <ContextMenu.Item onSelect={onSelect} destructive key="delete-all">
              <ContextMenu.ItemTitle>Delete all</ContextMenu.ItemTitle>
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Sub placement="right-start">
            <ContextMenu.SubTrigger jc="space-between" key="actions-trigger">
              <>
                <ContextMenu.ItemTitle>Actions</ContextMenu.ItemTitle>
                {!native || isWeb ? <ChevronRight size="$1" /> : null}
              </>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal zIndex={200}>
              <ContextMenu.SubContent
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                elevate
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
                paddingHorizontal={0}
              >
                <ContextMenu.Label fontSize={'$1'}>Note settings</ContextMenu.Label>
                <ContextMenu.Item onSelect={onSelect} key="create-note">
                  <ContextMenu.ItemTitle>Create note</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item onSelect={onSelect} key="delete-all">
                  <ContextMenu.ItemTitle>Delete all notes</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item onSelect={onSelect} key="sync-all">
                  <ContextMenu.ItemTitle>Sync notes</ContextMenu.ItemTitle>
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Separator className="DropdownMenuSeparator" />
          <ContextMenu.CheckboxItem
            key="show-hidden"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
            // value and onValueChange is necessary for native dropdowns
            value={bookmarksChecked ? 'on' : 'off'}
            onValueChange={(v) => setBookmarksChecked(v == 'on')}
            // android native menu treat checkbox as simple MenuItem
            {...(isAndroid &&
              native && {
                onSelect: () => {
                  isAndroid && setBookmarksChecked(!bookmarksChecked)
                },
              })}
            gap={'$2'}
          >
            <ContextMenu.ItemIndicator className="DropdownMenuItemIndicator">
              <Check size="$1" />
            </ContextMenu.ItemIndicator>
            <ContextMenu.ItemTitle>Mark as read</ContextMenu.ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && bookmarksChecked && (
              <ContextMenu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            key="show-other-notes"
            checked={native}
            onCheckedChange={setNative}
            value={native ? 'on' : 'off'}
            onValueChange={(v) => setNative(v == 'on')}
            // android native menu treat checkbox as simple MenuItem
            {...(isAndroid &&
              native && {
                onSelect: () => {
                  setNative(!native)
                },
              })}
            gap={'$2'}
          >
            <ContextMenu.ItemIndicator>
              <Check size="$1" />
            </ContextMenu.ItemIndicator>
            <ContextMenu.ItemTitle>Enable Native</ContextMenu.ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && (
              <ContextMenu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </ContextMenu.CheckboxItem>

          <ContextMenu.Arrow size={'$2'} />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  )
}
