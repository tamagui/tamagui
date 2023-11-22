import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@tamagui/dropdown-menu'
import { Airplay, ChevronRight } from '@tamagui/lucide-icons'
import { Button, Text, XStack } from 'tamagui'

export function DropdoownMenuDemo() {
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
          <DropdownMenuItem>
            <Text>New Tab ⌘+T</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>New Window ⌘+N</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text numberOfLines={1}>New Private Window ⇧+⌘+N</Text>
          </DropdownMenuItem>
          <DropdownMenuSub placement="right-start">
            <DropdownMenuSubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent paddingHorizontal={0}>
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
