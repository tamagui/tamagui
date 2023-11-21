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
import { ChevronRight } from '@tamagui/lucide-icons'
import { Button, Text, XStack } from 'tamagui'

export function DropdoownMenuDemo() {
  return (
    <DropdownMenu placement="bottom">
      <DropdownMenuTrigger width={200} asChild>
        <Button>
          <Button.Text>yes trigger</Button.Text>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          paddingHorizontal={0}
          borderWidth={1}
          width={200}
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
            <Text>New Private Window ⇧+⌘+N</Text>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <XStack ai="center" jc="space-between">
                <Text>More Tools</Text>
                <ChevronRight />
              </XStack>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="DropdownMenuItem">
                  <Text>Save Page As… ⌘+S</Text>
                </DropdownMenuItem>
                <DropdownMenuItem className="DropdownMenuItem">
                  <Text>Create Shortcut…</Text>
                </DropdownMenuItem>
                <DropdownMenuItem className="DropdownMenuItem">
                  <Text>Name Window…</Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="DropdownMenuItem">
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
