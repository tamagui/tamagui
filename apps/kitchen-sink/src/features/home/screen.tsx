import { variableToString } from '@tamagui/core'
import { ChevronRight, Moon, Sun } from '@tamagui/feather-icons'
import React from 'react'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { UseLinkProps, useLink } from 'solito/link'
import {
  Button,
  Card,
  Circle,
  FontLanguage,
  H1,
  H2,
  Image,
  ListItem,
  ListItemProps,
  Paragraph,
  Separator,
  Spacer,
  Square,
  Switch,
  Text,
  XStack,
  YGroup,
  YStack,
  useTheme,
} from 'tamagui'

import { useThemeControl } from '../../useTheme'

const LinkListItem = ({ children, href, as, shallow, ...props }: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })
  const theme = useTheme()
  return (
    <ListItem
      {...linkProps}
      {...props}
      iconAfter={<ChevronRight color={variableToString(theme.colorPress)} />}
    >
      {children}
    </ListItem>
  )
}

export function HomeScreen() {
  return (
    <ScrollView>
      <YStack bc="$backgroundStrong" p="$3" pt="$6" pb="$8" f={1} space>
        <H1 fontFamily="$heading" size="$9">
          Demos
        </H1>

        {/* fix media + space */}
        {/* 
        <XStack space>
          <Square size={50} bc="red" />
          <Square $sm={{ display: 'none' }} size={50} bc="red" />
          <Square size={50} bc="red" />
          <Square debug display="none" size={50} bc="red" />
          <Square size={50} bc="red" />
        </XStack> */}

        {/* <SkeletonDemo /> */}

        <YGroup size="$4">
          <ColorSchemeListItem />
        </YGroup>

        <YStack space="$4" maw={600}>
          {demos.map((group, i) => {
            return (
              <YGroup size="$4" key={i} separator={<Separator />}>
                {group.pages.map((page) => {
                  return (
                    <LinkListItem key={page.route} href={page.route} pressTheme size="$4">
                      {page.title}
                    </LinkListItem>
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

/**
 * we'll add a selector to each atomic style output within a boolean variant, so if we define:

const Circle = styled(Stack, {
  variants: {
    bl: {
      true: {
        color: 'blue'
      }
    }
  }
})


instead of just:

.color-blue { color: blue }


we generate:

.color-blue, .variant-bl .color-blue { color: blue }


and then <Variant /> is super lightweight, it adds a new internal-only context VariantContext that is only used for non-flattened views, and that's really simple it basically just overrides the prop on the way in, only a couple lines change of code total. And then it also does a <span className="display-contents variant-bl" /> on web
 */

const SkeletonDemo = () => {
  return (
    <Variant skeleton>
      <Card theme="dark" elevate size="$4" bordered>
        <Card.Header padded>
          <H2>Sony A7IV</H2>
          <Paragraph theme="alt2">Now available</Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <Circle size="$3" bc="red" />
          <XStack f={1} />
          <Button br="$10">Purchase</Button>
        </Card.Footer>
        <Card.Background>
          <Square bc="green" pos="absolute" width={400} height={500} />
        </Card.Background>
      </Card>
    </Variant>
  )
}

// web
// <div is="card" />
//
// .skeleton .card {}

const Variant = (props) => {
  return props.children
}

const ColorSchemeListItem = () => {
  const theme = useThemeControl()
  const checked = theme.value === 'light'

  return (
    <ListItem
      pressTheme
      paddingVertical={0}
      onPress={() => {
        theme.set(theme.value === 'dark' ? 'light' : 'dark')
      }}
    >
      <ListItem.Text>Theme</ListItem.Text>
      <Spacer flex />
      <Button chromeless disabled w={20} icon={Moon} />
      <Switch checked={checked} themeShallow>
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
      { title: 'Input + Textarea', route: '/demo/inputs' },
      { title: 'Label', route: '/demo/label' },
      { title: 'Progress', route: '/demo/progress' },
      { title: 'Select', route: '/demo/select' },
      { title: 'Slider', route: '/demo/slider' },
      { title: 'Switch', route: '/demo/switch' },
    ],
  },

  {
    label: 'Panels',
    pages: [
      { title: 'AlertDialog', route: '/demo/alert-dialog' },
      { title: 'Dialog', route: '/demo/dialog' },
      // { title: 'Drawer', route: '/demo/drawer' },
      { title: 'Popover', route: '/demo/popover' },
      { title: 'Sheet', route: '/demo/sheet' },
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
    pages: [{ title: 'Spinner', route: '/demo/spinner' }],
  },
]
