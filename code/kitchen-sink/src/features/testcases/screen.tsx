import { ChevronRight } from '@tamagui/lucide-icons'
import { ScrollView } from 'react-native'
import type { UseLinkProps } from 'solito/link'
import { useLink } from 'solito/link'
import type { ListItemProps } from 'tamagui'
import { H2, ListItem, Separator, YGroup, YStack } from 'tamagui'

import * as TestCases from '../../usecases'

export function TestCasesScreen() {
  return (
    <ScrollView>
      <YStack bg="$background" p="$3" pt="$6" pb="$8" f={1} space>
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
