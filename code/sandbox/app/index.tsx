import { Link } from 'one'
import { ListItem, YStack } from 'tamagui'
import { getTestUrlFromPath } from '~/utils/getTestPath'

const AllTests = import.meta.glob('../use-cases/*')

export function HomePage() {
  return (
    <YStack>
      {Object.keys(AllTests).map((test) => {
        return (
          <Link key={test} href={getTestUrlFromPath(test)}>
            <ListItem title={test} />
          </Link>
        )
      })}
    </YStack>
  )
}
