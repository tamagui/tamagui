import React from 'react'
import { Pressable } from 'react-native'
import { UseLinkProps, useLink } from 'solito/link'
import { Group, ListItem, Separator, XStack, YStack } from 'tamagui'

const Link = ({ children, ...props }: UseLinkProps & { children?: any }) => {
  const linkProps = useLink(props)
  return <Pressable {...linkProps}>{children}</Pressable>
}

export function HomeScreen() {
  return (
    <YStack f={1}>
      <YStack space="$4" maw={600} p="$3">
        <Group vertical bordered separator={<Separator />}>
          <Link href="/demo/one">
            <ListItem pressable size="$4">
              Hello world
            </ListItem>
          </Link>
          <Link href="/demo/one">
            <ListItem pressable size="$4">
              Hello world
            </ListItem>
          </Link>
          <Link href="/demo/one">
            <ListItem pressable size="$4">
              Hello world
            </ListItem>
          </Link>
        </Group>
      </YStack>

      <XStack als="center"></XStack>
    </YStack>
  )
}
