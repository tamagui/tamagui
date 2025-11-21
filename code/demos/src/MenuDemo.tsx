import { isAndroid, isWeb, styled } from '@tamagui/core'
import { Menu } from '@tamagui/menu'
import { Backpack, Calendar, Check } from '@tamagui/lucide-icons'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Text, useEvent } from 'tamagui'

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

export function MenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [native, setNative] = React.useState(false)

  const onSelect = useEvent(() => {})

  return (
    <Menu
      offset={{
        crossAxis: 25,
      }}
      allowFlip
      native={native}
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
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Item onSelect={onSelect} key="about-notes">
            <ItemTitle>About Notes</ItemTitle>
          </Item>

          <Menu.Separator />

          <Menu.Group>
            <Item onSelect={onSelect} key="settings">
              <ItemTitle>Settings</ItemTitle>
            </Item>
            <Item
              onSelect={onSelect}
              jc="space-between"
              // when title is nested inside a React element then you need to use `textValue`
              textValue="Calender"
              key="accounts"
            >
              <ItemTitle>
                <Text>Calender</Text>
              </ItemTitle>
              <Menu.ItemIcon
                androidIconName="ic_menu_today"
                ios={{
                  name: 'u.square',
                  hierarchicalColor: '#000',
                  pointSize: 20,
                }}
              >
                <Calendar color="gray" size={14} />
              </Menu.ItemIcon>
            </Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Item onSelect={onSelect} key="close-notes" disabled>
              <ItemTitle color="gray">locked notes</ItemTitle>
            </Item>
            <Item onSelect={onSelect} destructive key="delete-all">
              <ItemTitle>Delete all</ItemTitle>
            </Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Sub placement="right-start">
            <Menu.SubTrigger jc="space-between" key="actions-trigger">
              <>
                <ItemTitle>Actions</ItemTitle>
                {!native || isWeb ? <ChevronRight size="$1" /> : null}
              </>
            </Menu.SubTrigger>

            <Menu.Portal zIndex={200}>
              <Menu.SubContent
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
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
                <Menu.Label fontSize={'$1'}>Note settings</Menu.Label>
                <Item onSelect={onSelect} key="create-note">
                  <ItemTitle>Create note</ItemTitle>
                </Item>
                <Item onSelect={onSelect} key="delete-all">
                  <ItemTitle>Delete all notes</ItemTitle>
                </Item>
                <Item onSelect={onSelect} key="sync-all">
                  <ItemTitle>Sync notes</ItemTitle>
                </Item>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>

          <Menu.Separator className="MenuSeparator" />

          <Menu.CheckboxItem
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
            <Menu.ItemIndicator className="MenuItemIndicator">
              <Check size="$1" />
            </Menu.ItemIndicator>
            <ItemTitle>Mark as read</ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && bookmarksChecked && (
              <Menu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </Menu.CheckboxItem>

          <Menu.CheckboxItem
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
            <Menu.ItemIndicator>
              <Check size="$1" />
            </Menu.ItemIndicator>
            <ItemTitle>Enable Native</ItemTitle>
            {/* android native menu treat checkbox as simple MenuItem */}
            {isAndroid && native && (
              <Menu.ItemIcon androidIconName="checkbox_on_background" />
            )}
          </Menu.CheckboxItem>

          <Menu.Arrow size={'$2'} />
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}
