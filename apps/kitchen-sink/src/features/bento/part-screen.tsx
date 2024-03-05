import { H1, ScrollView, Spacer, YStack } from 'tamagui'
import { createParam } from 'solito'
import * as sections from '@tamagui/bento'
import { useLayoutEffect } from 'react'

const { useParam } = createParam<{ id: string }>()
export function BentoPartScreen({ navigation }) {
  const [id] = useParam('id')
  const name = id!
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  console.log('name', name)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    })
  }, [name, navigation])

  return (
    <ScrollView>
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
          {Object.values(sections[name] ?? []).map((Component, index) => {
            const ComponentElement = Component as React.ElementType
            return <ComponentElement key={index} />
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
