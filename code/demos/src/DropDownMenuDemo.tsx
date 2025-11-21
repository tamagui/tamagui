import { isAndroid, isWeb, styled } from '@tamagui/core'
import { DropdownMenu } from '@tamagui/dropdown-menu'
import { Backpack, Calendar, Check } from '@tamagui/lucide-icons'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Text, useEvent } from 'tamagui'

const DropDownItem = styled(DropdownMenu.Item, {
  paddingVertical: 4,
  hoverStyle: {
    backgroundColor: '$color2',
  },
  pressStyle: {
    backgroundColor: '$color3',
  },
})

const DropDownItemTitle = styled(DropdownMenu.ItemTitle, {
  color: '$color11',
})

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
        <Button borderRadius="$10" icon={Backpack} scaleIcon={1.2} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal zIndex={100}>
        <DropdownMenu.Content
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
          <DropDownItem onSelect={onSelect} key="about-notes">
            <DropDownItemTitle>About Notes</DropDownItemTitle>
          </DropDownItem>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropDownItem onSelect={onSelect} key="settings">
              <DropDownItemTitle>Settings</DropDownItemTitle>
            </DropDownItem>
            <DropDownItem
              onSelect={onSelect}
              jc="space-between"
              // when title is nested inside a React element then you need to use `textValue`
              textValue="Calender"
              key="accounts"
            >
              <DropDownItemTitle>
                <Text>Calender</Text>
              </DropDownItemTitle>
              <DropdownMenu.ItemIcon
                androidIconName="ic_menu_today"
                ios={{
                  name: 'u.square',
                  hierarchicalColor: '#000',
                  pointSize: 20,
                }}
              >
                <Calendar color="gray" size={14} />
              </DropdownMenu.ItemIcon>
            </DropDownItem>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropDownItem onSelect={onSelect} key="close-notes" disabled>
              <DropDownItemTitle color="gray">locked notes</DropDownItemTitle>
            </DropDownItem>
            <DropDownItem onSelect={onSelect} destructive key="delete-all">
              <DropDownItemTitle>Delete all</DropDownItemTitle>
            </DropDownItem>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub placement="right-start">
            <DropdownMenu.SubTrigger jc="space-between" key="actions-trigger">
              <>
                <DropDownItemTitle>Actions</DropDownItemTitle>
                {!native || isWeb ? <ChevronRight size="$1" /> : null}
              </>
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal zIndex={200}>
              <DropdownMenu.SubContent
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
                <DropdownMenu.Label fontSize={'$1'}>Note settings</DropdownMenu.Label>
                <DropDownItem onSelect={onSelect} key="create-note">
                  <DropDownItemTitle>Create note</DropDownItemTitle>
                </DropDownItem>
                <DropDownItem onSelect={onSelect} key="delete-all">
                  <DropDownItemTitle>Delete all notes</DropDownItemTitle>
                </DropDownItem>
                <DropDownItem onSelect={onSelect} key="sync-all">
                  <DropDownItemTitle>Sync notes</DropDownItemTitle>
                </DropDownItem>
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
            <DropDownItemTitle>Mark as read</DropDownItemTitle>
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
            <DropDownItemTitle>Enable Native</DropDownItemTitle>
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
