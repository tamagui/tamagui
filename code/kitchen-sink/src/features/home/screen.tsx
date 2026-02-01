import { ChevronRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import type { UseLinkProps } from 'solito/link'
import { useLink } from 'solito/link'
import type { ListItemProps } from 'tamagui'
import { Button, H1, ListItem, YGroup, YStack } from 'tamagui'
import * as TestCases from '../../usecases'

const testCaseNames = Object.keys(TestCases)

// grid of test case buttons for fast detox navigation
// uses 44x44 buttons (iOS recommended min tap target) for reliable tap detection
const BUTTON_SIZE = 44
const BUTTONS_PER_ROW = 8

function QuickNavItem({ name, index }: { name: string; index: number }) {
  const linkProps = useLink({ href: `/test/${name}` })
  // alternate colors for visibility
  const colors = ['#93c5fd', '#86efac', '#fdba74', '#c4b5fd', '#f9a8d4', '#fde047']
  const bg = colors[index % colors.length]

  return (
    <TouchableOpacity
      testID={`detox-nav-${name}`}
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={linkProps.onPress}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>{index + 1}</Text>
    </TouchableOpacity>
  )
}

function TestCasesSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <YStack gap="$2">
      <Button
        testID="toggle-test-cases"
        size="$3"
        onPress={() => {
          setExpanded(!expanded)
        }}
        theme="gray"
      >
        {`${expanded ? 'Hide' : 'Show'} Quick Test Links (${testCaseNames.length})`}
      </Button>

      {expanded && (
        <View
          testID="detox-quick-nav"
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: BUTTONS_PER_ROW * BUTTON_SIZE,
          }}
        >
          {testCaseNames.map((name, index) => (
            <QuickNavItem key={name} name={name} index={index} />
          ))}
        </View>
      )}
    </YStack>
  )
}

export function HomeScreen() {
  return (
    <ScrollView testID="home-scroll-view">
      <YStack bg="$color2" p="$3" pt="$4" pb="$8" flex={1} gap="$2">
        <H1 fontFamily="$heading">Kitchen Sink</H1>

        {/* Collapsible quick access to test cases */}
        <TestCasesSection />

        <YStack gap="$4" maxW={600}>
          {demos.map(({ pages }, i) => {
            return (
              <YGroup key={i} size="$4">
                {pages.map((page) => {
                  const route = page?.route

                  if (!route) return null

                  return (
                    <YGroup.Item key={route}>
                      <LinkListItem
                        rounded="$4"
                        bg="$color1"
                        href={route}
                        pressStyle={{ backgroundColor: '$color2' }}
                        size="$4"
                        testID={(page as any).testID}
                      >
                        {page.title}
                      </LinkListItem>
                    </YGroup.Item>
                  )
                })}
              </YGroup>
            )
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}

const LinkListItem = ({
  children,
  href,
  as,
  shallow,
  ...props
}: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })

  const handlePress = () => {
    const onPress = linkProps?.onPress
    if (onPress) {
      try {
        onPress()
      } catch (error) {
        console.info('error: ', error)
      }
    }
  }

  return (
    <ListItem
      {...linkProps}
      onPress={handlePress}
      {...props}
      iconAfter={<ChevronRight color="$color10" />}
    >
      {children}
    </ListItem>
  )
}

const demos = [
  {
    pages: [
      { title: 'Sandbox', route: '/sandbox' },
      { title: 'Benchmark', route: '/test/Benchmark' },
      { title: '🔧 Native Style Optimization', route: '/test/NativeStyleOptimization' },
      {
        title: 'Test Cases',
        route: '/tests',
        testID: 'home-test-cases-link',
      },
    ],
  },
  {
    pages: [
      { title: 'XStack, YStack', route: '/demo/stacks' },
      { title: 'Headings', route: '/demo/headings' },
      { title: 'Paragraph', route: '/demo/text' },
      { title: 'Animations', route: '/demo/animations' },
      { title: 'Animate Presence', route: '/demo/animate-presence' },
      { title: 'Animations Delay', route: '/demo/animations-delay' },
      { title: 'Themes', route: '/demo/themes' },
    ],
  },

  {
    label: 'Menus',
    pages: [
      { title: 'Menu', route: '/demo/menu' },
      { title: 'ContextMenu', route: '/demo/context-menu' },
    ],
  },

  {
    label: 'Panels',
    pages: [
      { title: 'AlertDialog', route: '/demo/alert-dialog' },
      { title: 'Dialog', route: '/demo/dialog' },
      { title: 'Popover', route: '/demo/popover' },
      { title: 'Sheet', route: '/demo/sheet' },
      { title: 'Toast', route: '/demo/toast' },
    ],
  },

  {
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/demo/button' },
      { title: 'Checkbox', route: '/demo/checkbox' },
      { title: 'Form', route: '/demo/forms' },
      { title: 'Input + Textarea', route: '/demo/inputs' },
      { title: 'New Input + Textarea', route: '/demo/new-inputs' },
      { title: 'Label', route: '/demo/label' },
      { title: 'Progress', route: '/demo/progress' },
      { title: 'Select', route: '/demo/select' },
      { title: 'Slider', route: '/demo/slider' },
      { title: 'Switch', route: '/demo/switch' },
      { title: 'RadioGroup', route: '/demo/radio-group' },
      { title: 'ToggleGroup', route: '/demo/toggle-group' },
    ],
  },

  {
    label: 'Content',
    pages: [
      { title: 'Avatar', route: '/demo/avatar' },
      { title: 'Card', route: '/demo/card' },
      { title: 'Group', route: '/demo/group' },
      { title: 'Image', route: '/demo/image' },
      { title: 'ListItem', route: '/demo/list-item' },
      { title: 'Tabs', route: '/demo/tabs' },
      { title: 'Tabs Advanced', route: '/demo/tabs-advanced' },
    ],
  },

  {
    label: 'Visual',
    pages: [
      { title: 'LinearGradient', route: '/demo/linear-gradient' },
      { title: 'Separator', route: '/demo/separator' },
      { title: 'Square + Circle', route: '/demo/shapes' },
    ],
  },

  {
    label: 'Etc',
    pages: [
      { title: 'Spinner', route: '/demo/spinner' },
      { title: 'ScrollView', route: '/demo/scroll-view' },
    ],
  },
]
