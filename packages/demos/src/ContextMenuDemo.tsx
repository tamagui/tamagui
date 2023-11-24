import {
  ContextMenu,
  ContextMenuArrow,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@tamagui/context-menu'
import { Airplay, CheckCircle, ChevronRight, Dot } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Text, XStack } from 'tamagui'

export function ContextMenuDemo() {
  const [bookmarkChecked, setBookmarkChecked] = useState(false)
  const [person, setPerson] = useState('pedro')

  return (
    <ContextMenu allowFlip placement="bottom-start">
      <ContextMenuTrigger borderWidth={2} height={200} width={200} asChild>
        <Text>Right click here</Text>
      </ContextMenuTrigger>

      <ContextMenuPortal>
        <ContextMenuContent
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
          <ContextMenuGroup>
            <ContextMenuItem>
              <Text>New Tab ⌘+T</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text>New Window ⌘+N</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text numberOfLines={1}>New Private Window ⇧+⌘+N</Text>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={bookmarkChecked}
              onCheckedChange={setBookmarkChecked}
              height={40}
            >
              <ContextMenuItemIndicator>
                <CheckCircle color="red" width={20} />
              </ContextMenuItemIndicator>
              <Text>Show Bookmarks ⌘+B</Text>
            </ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuLabel>
            <Text>People</Text>
          </ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro" paddingLeft={person !== 'pedro' ? 24 : 0}>
              <ContextMenuItemIndicator>
                <Dot />
              </ContextMenuItemIndicator>
              <Text>Pedro Duarte</Text>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm" paddingLeft={person !== 'colm' ? 24 : 0}>
              <ContextMenuItemIndicator>
                <Dot />
              </ContextMenuItemIndicator>
              <Text>Colm Tuite</Text>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub placement="right-start">
            <ContextMenuSubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent
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
                <ContextMenuItem>
                  <Text numberOfLines={1}>Save Page As… ⌘+S</Text>
                </ContextMenuItem>
                <ContextMenuItem>
                  <Text>Create Shortcut…</Text>
                </ContextMenuItem>
                <ContextMenuItem>
                  <Text>Name Window…</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Text>Developer Tools</Text>
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>
          <ContextMenuArrow size={'$5'} borderColor={'$borderColor'} borderWidth={1} />
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  )
}
