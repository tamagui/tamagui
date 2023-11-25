import { Stack, Text } from '@tamagui/core'

import { useQuery } from './graph'

export function GratsExampleApp() {
  const query = useQuery()

  return (
    <Stack bg="limegreen" jc="center" h="100%" ai="center">
      <Text fos={50} col="#9DFFC8">
        {query.greet({
          greeting: `Nate`,
        })}
      </Text>
    </Stack>
  )
}
