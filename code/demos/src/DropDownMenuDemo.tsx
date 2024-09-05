import { isAndroid, isWeb } from '@tamagui/core'
import { DropdownMenu } from '@tamagui/dropdown-menu'
import { Backpack, Calendar, Check } from '@tamagui/lucide-icons'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Text, useEvent } from 'tamagui'

export function DropDownMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(false)

  const onSelect = useEvent(() => {})

  return (
    <DropdownMenu
      offset={{
        crossAxis: 25,
      }}
      allowFlip
      native={native}
      placement="bottom-start"
    >
      <DropdownMenu.Trigger asChild>
        <Button width={60}>
          <Backpack />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal zIndex={100}>
        <DropdownMenu.Content
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
          <DropdownMenu.Item onSelect={onSelect} key="about-notes">
            <DropdownMenu.ItemTitle>About Notes</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item onSelect={onSelect} key="settings">
              <DropdownMenu.ItemTitle>Settings</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={onSelect}
              jc="space-between"
              // when title is nested inside a React element then you need to use `textValue`
              textValue="Calender"
              key="accounts"
            >
              <DropdownMenu.ItemTitle>
                <Text>Calender</Text>
              </DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                androidIconName="ic_menu_today"
                ios={{
                  name: 'u.square',
                  hierarchicalColor: '#000',
                  pointSize: 20,
                }}
              >
                <Calendar color="gray" size="$1" />
              </DropdownMenu.ItemIcon>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item onSelect={onSelect} key="close-notes" disabled>
              <DropdownMenu.ItemTitle color="gray">locked notes</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onSelect} destructive key="delete-all">
              <DropdownMenu.ItemTitle>Delete all</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Sub placement="right-start">
            <DropdownMenu.SubTrigger jc="space-between" key="actions-trigger">
              <>
                <DropdownMenu.ItemTitle>Actions</DropdownMenu.ItemTitle>
                {!native || isWeb ? <ChevronRight size="$1" /> : null}
              </>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal zIndex={200}>
              <DropdownMenu.SubContent
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
                <DropdownMenu.Label fontSize={'$1'}>Note settings</DropdownMenu.Label>
                <DropdownMenu.Item onSelect={onSelect} key="create-note">
                  <DropdownMenu.ItemTitle>Create note</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={onSelect} key="delete-all">
                  <DropdownMenu.ItemTitle>Delete all notes</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={onSelect} key="sync-all">
                  <DropdownMenu.ItemTitle>Sync notes</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator className="DropdownMenuSeparator" />
          <DropdownMenu.CheckboxItem
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
            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
              <Check size="$1" />
            </DropdownMenu.ItemIndicator>
            <DropdownMenu.ItemTitle>Mark as read</DropdownMenu.ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && bookmarksChecked && (
              <DropdownMenu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
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
            <DropdownMenu.ItemIndicator>
              <Check size="$1" />
            </DropdownMenu.ItemIndicator>
            <DropdownMenu.ItemTitle>Enable Native</DropdownMenu.ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && (
              <DropdownMenu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Arrow size={'$2'} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
