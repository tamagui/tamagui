import React from 'react'
import { UseLinkProps, useLink } from 'solito/link'
import { Group, ListItem, ListItemProps, Separator, XStack, YStack } from 'tamagui'

const LinkListItem = ({ children, href, as, shallow, ...props }: UseLinkProps & ListItemProps) => {
  const linkProps = useLink({ href, as, shallow })
  return (
    <ListItem {...linkProps} {...props}>
      {children}
    </ListItem>
  )
}

export function HomeScreen() {
  return (
    <YStack f={1}>
      <YStack space="$4" maw={600} p="$3">
        <Group vertical bordered separator={<Separator />}>
          <LinkListItem href="/demo/one" pressable size="$4">
            Hello world
          </LinkListItem>
          <LinkListItem href="/demo/one" pressable size="$4">
            Hello world
          </LinkListItem>
          <LinkListItem href="/demo/one" pressable size="$4">
            Hello world
          </LinkListItem>
        </Group>
      </YStack>

      <XStack als="center"></XStack>
    </YStack>
  )
}
