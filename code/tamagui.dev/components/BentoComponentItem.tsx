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
} from '@tamagui/lucide-icons-2'
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
        width="210px gtMd:calc(25% - 20px)"
        cursor="pointer"
        position="relative"
        bg="rgba(150,150,150,0.025) gtMd:rgba(255,255,255,0)"
        mt="3"
        rounded="gtMd:4"
      >
        {/* Preview */}
        <YStack
          position="relative"
          height={192}
          rounded="8"
          overflow="hidden"
          shadowColor="shadow2"
          shadowRadius={30}
          shadowOffset={{ height: 16, width: 0 }}
          bg="hover:color4 dark:color3"
          y="press:2px"
          scale="press:0.99"
          className="relative"
        >
          <YStack
            position="absolute"
            inset={0}
            pointerEvents="none"
            justify="center"
            items="center"
            p="6"
          >
            <Preview />
          </YStack>
          <LinearGradient
            position="absolute"
            inset={0}
            start={[0, 0.5]}
            end={[0.5, 0]}
            colors={['transparent', 'background04']}
            z={1}
          />
        </YStack>

        <YStack flex={1} flexBasis="auto" p="4" position="relative">
          <H4 color="color12" size="5">
            {name}
          </H4>

          <H5 opacity={0} color="color10" letterSpacing={1} size="1">
            {numberOfComponents} components
          </H5>

          <YStack position="absolute" t="4" r="4" rotate="20deg" p="2" opacity={0.4}>
            <Icon size={20} color="color12" />
          </YStack>
        </YStack>
      </YStack>
    </Link>
  )
}

const Null = () => null

const BASE_PATH = '/bento'

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
