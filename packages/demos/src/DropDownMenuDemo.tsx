import { DropdownMenu } from '@tamagui/dropdown-menu'
import {
  Airplay,
  Box,
  CheckCircle,
  ChevronRight,
  Dot,
  TentTree,
} from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Text, XStack } from 'tamagui'

export function DropdoownMenuDemo() {
  const [bookmarkChecked, setBookmarkChecked] = useState(false)
  const [person, setPerson] = useState('pedro')

  return (
    <DropdownMenu
      offset={{
        crossAxis: 25,
      }}
      allowFlip
      placement="bottom-start"
    >
      <DropdownMenu.Trigger width={50} asChild>
        <Button icon={Airplay} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          paddingHorizontal={0}
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
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <Text>New Tab ⌘+T</Text>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Text>New Window ⌘+N</Text>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Text numberOfLines={1}>New Private Window ⇧+⌘+N</Text>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem
              checked={bookmarkChecked}
              onCheckedChange={setBookmarkChecked}
              height={40}
            >
              <DropdownMenu.ItemIndicator>
                <CheckCircle color="red" width={20} />
              </DropdownMenu.ItemIndicator>
              <Text>Show Bookmarks ⌘+B</Text>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>
            <Text>People</Text>
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenu.RadioItem
              value="pedro"
              paddingLeft={person !== 'pedro' ? 24 : 0}
            >
              <DropdownMenu.ItemIndicator>
                <Dot />
              </DropdownMenu.ItemIndicator>
              <Text>Pedro Duarte</Text>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="colm" paddingLeft={person !== 'colm' ? 24 : 0}>
              <DropdownMenu.ItemIndicator>
                <Dot />
              </DropdownMenu.ItemIndicator>
              <Text>Colm Tuite</Text>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Sub placement="right-start">
            <DropdownMenu.SubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
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
                <DropdownMenu.Item>
                  <Text numberOfLines={1}>Save Page As… ⌘+S</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Text>Create Shortcut…</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Text>Name Window…</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <Text>Developer Tools</Text>
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Arrow size={'$3'} borderColor={'$borderColor'} borderWidth={1} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
