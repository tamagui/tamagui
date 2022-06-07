import { ButtonDemo, FormsDemo, LabelDemo } from '@tamagui/demos'
import { Sun } from '@tamagui/feather-icons'
import React from 'react'
import { ScrollView, TextInput, useColorScheme } from 'react-native'
import { UseLinkProps, useLink } from 'solito/link'
import {
  Group,
  H1,
  ListItem,
  ListItemProps,
  Separator,
  Spacer,
  Switch,
  XStack,
  YStack,
} from 'tamagui'

const LinkListItem = ({ children, href, as, shallow, ...props }: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })
  return (
    <ListItem {...linkProps} {...props}>
      {children}
    </ListItem>
  )
}

export function HomeScreen() {
  const scheme = useColorScheme()

  return (
    <ScrollView>
      <YStack p="$3" pb="$8" f={1} space>
        <H1 size="$9">Demos</H1>

        <Group vertical>
          <ListItem pressable icon={Sun}>
            <ListItem.Text>Theme {scheme}</ListItem.Text>
            <Spacer flex />
            <Switch bc="$blue10">
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </ListItem>
        </Group>

        <YStack space="$4" maw={600}>
          {demos.map((group, i) => {
            return (
              <Group key={i} vertical separator={<Separator />}>
                {group.pages.map((page) => {
                  return (
                    <LinkListItem key={page.route} href={page.route} pressable size="$4">
                      {page.title}
                    </LinkListItem>
                  )
                })}
              </Group>
            )
          })}
        </YStack>

        <XStack als="center"></XStack>
      </YStack>
    </ScrollView>
  )
}

const demos = [
  {
    pages: [
      { title: 'Stacks', route: '/demo/stacks' },
      { title: 'Headings', route: '/demo/headings' },
      { title: 'Paragraph', route: '/demo/text' },
    ],
  },

  {
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/demo/button' },
      { title: 'Input + Textarea', route: '/demo/inputs' },
      { title: 'Label', route: '/demo/label' },
      { title: 'Progress', route: '/demo/progress' },
      { title: 'Slider', route: '/demo/slider' },
      { title: 'Switch', route: '/demo/switch' },
    ],
  },

  {
    label: 'Panels',
    pages: [
      { title: 'Dialog', route: '/demo/dialog' },
      { title: 'Popover', route: '/demo/popover' },
      { title: 'Tooltip', route: '/demo/tooltip' },
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
      { title: 'Anchor', route: '/demo/anchor' },
      { title: 'HTML Elements', route: '/demo/html-elements' },
      { title: 'Spinner', route: '/demo/spinner' },
      { title: 'Unspaced', route: '/demo/unspaced' },
      { title: 'VisuallyHidden', route: '/demo/visually-hidden' },
    ],
  },
]
