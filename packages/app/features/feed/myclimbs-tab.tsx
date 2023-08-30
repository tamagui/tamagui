import { H5, Paragraph, YStack } from '@my/ui'
import { api } from 'app/utils/api'

export function MyClimbsTab() {
  // TODO: Get Climbs
  const climbsQuery = api.me.climbs.useQuery()
  console.log(climbsQuery)
  return (
    <YStack>
      <H5>Climbs</H5>
      <Paragraph>{JSON.stringify(climbsQuery, null, 2)}</Paragraph>
    </YStack>
  )
}
