import {
  BadgeAlert,
  Banana,
  BellDot,
  Calendar,
  CheckCircle,
  CheckSquare,
  CircleUserRound,
  Cog,
  FormInput,
  Image,
  Layout,
  List,
  MessageSquareShare,
  MousePointerClick,
  NotebookTabs,
  PanelLeft,
  PanelTop,
  RectangleHorizontal,
  ShoppingBag,
  ShoppingCart,
  Table,
  TextCursorInput,
  ToggleRight,
} from '@tamagui/lucide-icons'
import { H5 } from 'tamagui'
import { H4 } from 'tamagui'
import { Theme } from 'tamagui'
import { YStack } from 'tamagui'
import { Link } from '~/components/Link'

export function ComponentPreviewItem({
  name,
  numberOfComponents,
  path,
}: {
  name: string
  numberOfComponents: number
  path: string
}) {
  const Icon = icons[name] ?? Null

  return (
    <Link href={(BASE_PATH + path) as any} asChild>
      <YStack
        tag="a"
        ov="hidden"
        w={220}
        // br="$9"
        cursor="pointer"
        pos="relative"
        hoverStyle={{
          bg: `rgba(150,150,150,0.035)`,
        }}
        pressStyle={{
          bg: 'rgba(150,150,150,0.05)',
          y: 1,
        }}
        bg="rgba(150,150,150,0.025)"
        mt="$3"
        br="$6"
        $gtMd={{
          bg: 'rgba(255,255,255,0)',
          w: 'calc(25% - 14px)',
          br: '$6',
          m: '$2',
        }}
      >
        <YStack f={1} p="$4">
          <Theme name="gray">
            <H4 ff="$body" size="$4" fow="600" color="$color12">
              {name}
            </H4>
          </Theme>

          <H5 theme="alt1" size="$1" ls={1}>
            {numberOfComponents} components
          </H5>

          <YStack
            // className="mask-gradient-down"
            pos="absolute"
            t="$4"
            r="$4"
            rotate="20deg"
            p="$2"
            o={0.4}
          >
            <Icon size={25} color="$color10" />
          </YStack>
        </YStack>
      </YStack>
    </Link>
  )
}

const Null = () => null

const BASE_PATH = ' /bento'

const icons = {
  Inputs: TextCursorInput,
  Checkboxes: CheckSquare,
  Layouts: Layout,
  RadioGroups: CheckCircle,
  Switches: ToggleRight,
  Textareas: FormInput,
  'Image Pickers': Image,
  List: List,
  Avatars: CircleUserRound,
  Buttons: RectangleHorizontal,
  DatePickers: Calendar,
  Tables: Table,
  Chips: BadgeAlert,
  Dialogs: MessageSquareShare,
  Navbar: PanelTop,
  Sidebar: PanelLeft,
  Tabbar: NotebookTabs,
  Microinteractions: MousePointerClick,
  Slide: Banana,
  Cart: ShoppingCart,
  'Product Page': ShoppingBag,
  Preferences: Cog,
  'Event Reminders': BellDot,
}
