import { ChevronRight } from '@tamagui/lucide-icons'
import { ScrollView } from 'react-native'
import type { UseLinkProps } from 'solito/link'
import { useLink } from 'solito/link'
import type { ListItemProps } from 'tamagui'
import {
  H1,
  ListItem,
  Paragraph,
  Separator,
  Square,
  Theme,
  XStack,
  YGroup,
  YStack,
} from 'tamagui'
import { ColorSchemeListItem } from './ColorSchemeListItem'

export function HomeScreen() {
  // To test a single case easily:
  // return (
  //   <>
  //     <ColorSchemeToggle />
  //     <ScrollView>
  //       <ThemeChange />
  //     </ScrollView>
  //   </>
  // )

  return (
    <ScrollView>
      <YStack bg="$color2" p="$3" pt="$6" pb="$8" f={1} space>
        <H1 fontFamily="$heading" size="$9">
          Kitchen Sink
        </H1>

        <XStack gap="$2">
          <Square
            size={30}
            bg="red"
            $theme-dark={{ bg: 'yellow' }}
            $theme-light={{ bg: 'green' }}
          />

          {/* nested themes */}
          <Theme name="green">
            <Square size={30} bg="$color10" />

            <Theme name="pink">
              <Square size={30} bg="$color10" />
            </Theme>
          </Theme>

          <Square size={30} themeInverse bg="$background" />
          <Square size={30} bg="$background" />
        </XStack>

        <YGroup size="$4">
          <YGroup.Item>
            <ColorSchemeListItem />
          </YGroup.Item>
        </YGroup>
        <YStack
          theme="yellow"
          backgroundColor="$background"
          p="$3"
          br="$4"
          bw={1}
          bc="$borderColor"
        >
          <Paragraph>Welcome to the Tamagui Kitchen Sink!</Paragraph>
        </YStack>

        <YStack gap="$4" maw={600}>
          {demos.map((group, i) => {
            return (
              <YGroup size="$4" key={i} separator={<Separator />}>
                {group.pages.map((page) => {
                  return (
                    <YGroup.Item key={page.route}>
                      <LinkListItem bg="$color1" href={page.route} pressTheme size="$4">
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

export const LinkListItem = ({
  children,
  href,
  as,
  shallow,
  ...props
}: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })

  return (
    <ListItem
      {...linkProps}
      onPress={(e) => {
        linkProps.onPress(e)
      }}
      {...props}
      iconAfter={<ChevronRight color="$color10" />}
    >
      {children}
    </ListItem>
  )
}

const demos = [
  {
    pages: [{ title: 'Bento', route: '/bento' }],
  },
  {
    pages: [
      { title: 'Sandbox', route: '/sandbox' },
      { title: 'Benchmark', route: '/test/Benchmark' },
      {
        title: 'Test Cases',
        route: '/tests',
      },
    ],
  },
  {
    pages: [
      { title: 'Stacks', route: '/demo/stacks' },
      { title: 'Headings', route: '/demo/headings' },
      { title: 'Paragraph', route: '/demo/text' },
      { title: 'Animations', route: '/demo/animations' },
      { title: 'Animate Presence', route: '/demo/animate-presence' },
      { title: 'Themes', route: '/demo/themes' },
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
