import { useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native'
import { createParam } from 'solito'
import { H1, YStack } from 'tamagui'

import * as UseCases from '../../usecases'

const { useParam } = createParam<{ id: string }>()

const nameMap = {
  Inputs: 'Inputs',
}

export function TestScreen() {
  const route = useRoute<any>()
  const [id] = useParam('id')
  const routeId = route?.params?.id
  const resolvedId = id || routeId

  if (!resolvedId) {
    return null
  }

  const name = resolvedId
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  const testName = `${nameMap[name] || name}`
  const DemoComponent = UseCases[testName] ?? NotFound

  return (
    <ScrollView style={{ height: '100%' }}>
      <YStack
        outlineStyle="solid"
        outlineColor="red"
        outlineWidth="$2"
        flex={1}
        justify="center"
        items="center"
        bg="$background"
        gap="$4"
      >
        <YStack minW={200} maxW={600} items="center" p="$4" rounded="$6">
          <DemoComponent />
        </YStack>
      </YStack>
    </ScrollView>
  )
}

const NotFound = () => <H1>Not found!</H1>
