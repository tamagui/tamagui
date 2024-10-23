import { useParams } from 'one'
import { lazy } from 'react'
import { H1, YStack } from 'tamagui'
import { getTestNameFromPath } from '~/utils/getTestPath'

const AllTestsByPath = import.meta.glob('../../use-cases/*')
const AllTests = Object.fromEntries(
  Object.entries(AllTestsByPath).map(([key, value]) => {
    return [getTestNameFromPath(key), lazy(value as any)]
  })
)

export function TestPage() {
  const params = useParams<any>()
  const Component = AllTests[params.slug]

  if (!Component) {
    return <H1>No Test!</H1>
  }

  return (
    <YStack f={1}>
      <Component />
    </YStack>
  )
}
