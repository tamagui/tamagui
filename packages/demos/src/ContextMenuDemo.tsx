import { ContextMenu } from '@tamagui/context-menu'
import { CheckCircle, ChevronRight, Dot } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Text, XStack } from 'tamagui'

export function ContextMenuDemo() {
  const [bookmarkChecked, setBookmarkChecked] = useState(false)
  const [person, setPerson] = useState('pedro')

  return (
    <ContextMenu allowFlip placement="bottom-start">
      <ContextMenu.Portal zIndex={100}>
        <ContextMenu.Content
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
          <ContextMenu.Group>
            <ContextMenu.Item>
              <Text>New Tab ⌘+T</Text>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Text>New Window ⌘+N</Text>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Text numberOfLines={1}>New Private Window ⇧+⌘+N</Text>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.CheckboxItem
              checked={bookmarkChecked}
              onCheckedChange={setBookmarkChecked}
              height={40}
            >
              <ContextMenu.ItemIndicator>
                <CheckCircle color="red" width={20} />
              </ContextMenu.ItemIndicator>
              <Text>Show Bookmarks ⌘+B</Text>
            </ContextMenu.CheckboxItem>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Label>
            <Text>People</Text>
          </ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem
              value="pedro"
              paddingLeft={person !== 'pedro' ? 24 : 0}
            >
              <ContextMenu.ItemIndicator>
                <Dot />
              </ContextMenu.ItemIndicator>
              <Text>Pedro Duarte</Text>
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="colm" paddingLeft={person !== 'colm' ? 24 : 0}>
              <ContextMenu.ItemIndicator>
                <Dot />
              </ContextMenu.ItemIndicator>
              <Text>Colm Tuite</Text>
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Sub placement="right-start">
            <ContextMenu.SubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
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
                <ContextMenu.Item>
                  <Text numberOfLines={1}>Save Page As… ⌘+S</Text>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <Text>Create Shortcut…</Text>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <Text>Name Window…</Text>
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item>
                  <Text>Developer Tools</Text>
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Arrow size={'$5'} borderColor={'$borderColor'} borderWidth={1} />
        </ContextMenu.Content>
      </ContextMenu.Portal>
      <ContextMenu.Trigger zIndex={-1} borderWidth={2} height={200} width={200} asChild>
        <Text>Right/long press click here</Text>
      </ContextMenu.Trigger>
    </ContextMenu>
  )
}
