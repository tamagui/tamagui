import { ChevronRight } from '@tamagui/lucide-icons'
import { ScrollView } from 'react-native'
import type { UseLinkProps } from 'solito/link'
import { useLink } from 'solito/link'
import type { ListItemProps } from 'tamagui'
import { H2, ListItem, YGroup, YStack } from 'tamagui'

import * as TestCases from '../../usecases'

export function TestCasesScreen() {
  return (
    <ScrollView testID="test-cases-scroll-view">
      <YStack bg="$background" p="$3" pt="$6" pb="$8" flex={1} gap="$4">
        <H2>All Test Cases</H2>
        <YStack gap="$4" maxW={600}>
          <YGroup size="$4">
            {Object.keys(TestCases).map((page) => {
              return (
                <YGroup.Item key={page}>
                  <LinkListItem
                    href={`/test/${page}`}
                    size="$4"
                    testID={`test-case-${page}`}
                  >
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
