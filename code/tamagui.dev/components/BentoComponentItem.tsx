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
import { H4, H5, Image, YStack } from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Link } from '~/components/Link'
import ComponentPreview from './ComponentPreview'

export function ComponentItem({
  name,
  numberOfComponents,
  route,
}: {
  name: string
  numberOfComponents: number
  route: string
}) {
  const Icon = BENTO_COMPONENT_ICONS[name] ?? Null
  const Preview = ComponentPreview[name] ?? Null

  const href = BASE_PATH + route

  return (
    <Link href={href as any} asChild>
      <YStack
        render="a"
        width={210}
        cursor="pointer"
        position="relative"
        bg="rgba(150,150,150,0.025)"
        mt="$3"
        $gtMd={{
          bg: 'rgba(255,255,255,0)',
          width: 'calc(25% - 20px)',
          rounded: '$4',
        }}
      >
        {/* Preview */}
        <YStack
          position="relative"
          height={192}
          rounded="$8"
          overflow="hidden"
          className="relative"
          shadowColor="$shadow2"
          shadowRadius={30}
          shadowOffset={{ height: 16, width: 0 }}
          hoverStyle={{
            bg: '$color3',
          }}
          pressStyle={{
            y: 2,
            scale: 0.99,
          }}
        >
          <YStack fullscreen pointerEvents="none" justify="center" items="center" p="$6">
            <Preview />
          </YStack>
          <LinearGradient
            fullscreen
            start={[0, 0.5]}
            end={[0.5, 0]}
            colors={['transparent', '$background04']}
            z={1}
          />
        </YStack>

        <YStack flex={1} p="$4" position="relative">
          <H4 fontFamily="$mono" size="$5" color="$color12">
            {name}
          </H4>

          <H5 opacity={0} fontFamily="$mono" color="$color10" size="$1" letterSpacing={1}>
            {numberOfComponents} components
          </H5>

          <YStack position="absolute" t="$4" r="$4" rotate="20deg" p="$2" opacity={0.4}>
            <Icon size={20} color="$color12" />
          </YStack>
        </YStack>
      </YStack>
    </Link>
  )
}

const Null = () => null

const BASE_PATH = ' /bento'

export const BENTO_COMPONENT_ICONS = {
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
