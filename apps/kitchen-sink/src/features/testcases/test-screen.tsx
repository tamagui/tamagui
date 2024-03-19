import { ScrollView } from 'react-native'
import { createParam } from 'solito'
import { H1, YStack } from 'tamagui'

import * as UseCases from '../../usecases'

const { useParam } = createParam<{ id: string }>()

const nameMap = {
  Inputs: 'Inputs',
}

export function TestScreen() {
  const [id] = useParam('id')

  if (!id) {
    return null
  }

  const name = id
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  console.log(`Showing test ${name}`)

  const testName = `${nameMap[name] || name}`
  const DemoComponent = UseCases[testName] ?? NotFound

  return (
    <ScrollView style={{ height: '100%' }}>
      <YStack
        outlineStyle="solid"
        outlineColor="red"
        outlineWidth="$2"
        f={1}
        jc="center"
        ai="center"
        bg="$background"
        space
      >
        <YStack miw={200} maw={340} ai="center" p="$10" br="$6">
          <DemoComponent />
        </YStack>
      </YStack>
    </ScrollView>
  )
}

const NotFound = () => <H1>Not found!</H1>
