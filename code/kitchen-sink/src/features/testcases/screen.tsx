import { ChevronRight, Moon, Sun } from '@tamagui/lucide-icons'
import { ScrollView } from 'react-native'
import type { UseLinkProps } from 'solito/link'
import { useLink } from 'solito/link'
import type { ListItemProps } from 'tamagui'
import {
  Button,
  H1,
  H2,
  ListItem,
  Separator,
  Spacer,
  Switch,
  YGroup,
  YStack,
} from 'tamagui'

import * as TestCases from '../../usecases'
import { useThemeControl } from '../../useKitchenSinkTheme'

export function TestCasesScreen() {
  return (
    <ScrollView>
      <YStack bg="$background" p="$3" pt="$6" pb="$8" f={1} gap="$4">
        <H2>All Test Cases</H2>
        <YStack gap="$4" maw={600}>
          <YGroup size="$4" separator={<Separator />}>
            {Object.keys(TestCases).map((page) => {
              return (
                <YGroup.Item key={page}>
                  <LinkListItem href={`/test/${page}`} pressTheme size="$4">
                    {page}
                  </LinkListItem>
                </YGroup.Item>
              )
            })}
          </YGroup>
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

  return (
    <ListItem
      {...linkProps}
      backgroundColor="$color1"
      onPress={(e) => {
        linkProps.onPress(e)
      }}
      {...props}
      iconAfter={ChevronRight}
    >
      {children}
    </ListItem>
  )
}

const ColorSchemeListItem = (props: ListItemProps) => {
  const theme = useThemeControl()
  const checked = theme.value === 'light'

  return (
    <ListItem {...props} pressTheme paddingVertical={0}>
      <ListItem.Text>Theme</ListItem.Text>
      <Spacer flex={1} />
      <Button chromeless disabled w={20} icon={Moon} />
      <Switch
        native
        checked={checked}
        onCheckedChange={() => {
          theme.set(theme.value === 'dark' ? 'light' : 'dark')
        }}
      >
        <Switch.Thumb
          animation={[
            'quick',
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch>
      <Button chromeless disabled w={20} icon={Sun} />
    </ListItem>
  )
}

const demos = [
  {
    pages: [{ title: 'Sandbox', route: '/sandbox' }],
  },
  {
    pages: [
      { title: 'Stacks', route: '/demo/stacks' },
      { title: 'Headings', route: '/demo/headings' },
      { title: 'Paragraph', route: '/demo/text' },
      { title: 'Animations', route: '/demo/animations' },
      { title: 'Themes', route: '/demo/themes' },
    ],
  },

  {
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/demo/button' },
      { title: 'Checkbox', route: '/demo/checkbox' },
      { title: 'Input + Textarea', route: '/demo/inputs' },
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
      // { title: 'Dialog', route: '/demo/dialog' },
      // { title: 'Drawer', route: '/demo/drawer' },
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
    pages: [{ title: 'Spinner', route: '/demo/spinner' }],
  },
]
