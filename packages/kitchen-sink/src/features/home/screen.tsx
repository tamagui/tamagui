import { ChevronRight, Moon, Sun } from '@tamagui/feather-icons'
import React from 'react'
import { ScrollView } from 'react-native'
import { UseLinkProps, useLink } from 'solito/link'
import {
  Button,
  Group,
  H1,
  ListItem,
  ListItemProps,
  Separator,
  Spacer,
  Switch,
  YStack,
  useTheme,
} from 'tamagui'

import { useThemeControl } from '../../useTheme'

const LinkListItem = ({ children, href, as, shallow, ...props }: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })
  const theme = useTheme()
  return (
    <ListItem {...linkProps} {...props} iconAfter={<ChevronRight color={theme.colorPress} />}>
      {children}
    </ListItem>
  )
}

export function HomeScreen() {
  return (
    // @ts-ignore
    <ScrollView>
      <YStack bc="$backgroundStrong" p="$3" pb="$8" f={1} space>
        <H1 size="$9">Demos</H1>

        <Group size="$4" vertical>
          <ColorSchemeListItem />
        </Group>

        <YStack space="$4" maw={600}>
          {demos.map((group, i) => {
            return (
              <Group size="$4" key={i} vertical separator={<Separator />}>
                {group.pages.map((page) => {
                  return (
                    <LinkListItem key={page.route} href={page.route} pressTheme size="$4">
                      {page.title}
                    </LinkListItem>
                  )
                })}
              </Group>
            )
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}

const ColorSchemeListItem = () => {
  const theme = useThemeControl()
  const checked = theme.value === 'light'

  return (
    <ListItem
      pressTheme
      onPress={() => {
        theme.set(theme.value === 'dark' ? 'light' : 'dark')
      }}
    >
      <ListItem.Text>Theme</ListItem.Text>
      <Spacer flex />
      <Button chromeless disabled w={20} icon={Moon} />
      <Switch checked={checked} bc="$blue10">
        <Switch.Thumb animation="bouncy" />
      </Switch>
      <Button chromeless disabled w={20} icon={Sun} />
    </ListItem>
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

  // {
  //   label: 'Panels',
  //   pages: [
  //     { title: 'Dialog', route: '/demo/dialog' },
  //     { title: 'Popover', route: '/demo/popover' },
  //   ],
  // },

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
    pages: [{ title: 'Spinner', route: '/demo/spinner' }],
  },
]
