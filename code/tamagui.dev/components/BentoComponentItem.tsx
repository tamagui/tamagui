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
import { H4, H5, Image, Theme, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
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
        tag="a"
        w={210}
        key={10}
        // br="$9"
        cursor="pointer"
        pos="relative"
        bg="rgba(150,150,150,0.025)"
        mt="$3"
        // br="$6"
        $gtMd={{
          bg: 'rgba(255,255,255,0)',
          w: 'calc(25% - 20px)',
          br: '$4',
        }}
      >
        {/* Preview */}
        <YStack
          h={192}
          br="$8"
          ov="hidden"
          className="relative"
          $theme-dark={{
            borderColor: '$background04',
            borderWidth: 1.5,
          }}
          $theme-light={{
            bg: '$background',
          }}
          animation="bouncy"
          shadowColor="$shadow1"
          shadowRadius={10}
          shadowOffset={{ height: 5, width: 0 }}
          hoverStyle={{
            scale: 1.02,
          }}
          pressStyle={{
            y: 2,
            scale: 0.99,
          }}
        >
          <YStack
            fullscreen
            pointerEvents="none"
            justifyContent="center"
            alignItems="center"
            p="$6"
          >
            <Preview />
          </YStack>
          <LinearGradient
            fullscreen
            start={[1, 0]}
            end={[0, 0.5]}
            colors={['$background02', 'transparent']}
          />
        </YStack>

        <YStack f={1} p="$4">
          <Theme name="gray">
            <H4 ff="$mono" size="$5" fow="600" color="$color12">
              {name}
            </H4>
          </Theme>

          <H5 fontFamily="$mono" theme="alt1" size="$1" ls={1}>
            {numberOfComponents} components
          </H5>

          <YStack pos="absolute" t="$4" r="$4" rotate="20deg" p="$2" o={0.4}>
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
