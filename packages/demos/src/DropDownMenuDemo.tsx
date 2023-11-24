import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@tamagui/dropdown-menu'
import { Airplay, CheckCircle, ChevronRight, Dot, TentTree } from '@tamagui/lucide-icons'
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
      <DropdownMenuTrigger width={50} asChild>
        <Button icon={Airplay} />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Text>New Tab ⌘+T</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Text>New Window ⌘+N</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Text numberOfLines={1}>New Private Window ⇧+⌘+N</Text>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={bookmarkChecked}
              onCheckedChange={setBookmarkChecked}
              height={40}
            >
              <DropdownMenuItemIndicator>
                <CheckCircle color="red" width={20} />
              </DropdownMenuItemIndicator>
              <Text>Show Bookmarks ⌘+B</Text>
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>People</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenuRadioItem
              value="pedro"
              paddingLeft={person !== 'pedro' ? 24 : 0}
            >
              <DropdownMenuItemIndicator>
                <Dot />
              </DropdownMenuItemIndicator>
              <Text>Pedro Duarte</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="colm" paddingLeft={person !== 'colm' ? 24 : 0}>
              <DropdownMenuItemIndicator>
                <Dot />
              </DropdownMenuItemIndicator>
              <Text>Colm Tuite</Text>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub placement="right-start">
            <DropdownMenuSubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
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
                <DropdownMenuItem>
                  <Text numberOfLines={1}>Save Page As… ⌘+S</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Create Shortcut…</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Name Window…</Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>Developer Tools</Text>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuArrow size={'$3'} borderColor={'$borderColor'} borderWidth={1} />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
