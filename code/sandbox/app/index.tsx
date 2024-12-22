import { Link } from 'one'
import { H4, ListItem, ScrollView, XStack, YStack } from 'tamagui'
import { AllBento, AllTests } from '~/components/allComponents'
import { getUrlFromPath } from '~/utils/getFromPath'

export function HomePage() {
  return (
    <ScrollView horizontal minHeight="100%">
      <XStack>
        <YStack maw={250}>
          <H4>Test Cases</H4>
          {Object.keys(AllTests).map((path) => {
            return (
              <Link key={path} href={getUrlFromPath('test', path)}>
                <ListItem title={path} />
              </Link>
            )
          })}
        </YStack>

        <YStack maw={250}>
          <H4>Bento</H4>
          {Object.keys(AllBento).map((path) => {
            return (
              <Link key={path} href={getUrlFromPath('bento', path)}>
                <ListItem title={path} />
              </Link>
            )
          })}
        </YStack>
      </XStack>
    </ScrollView>
  )
}
