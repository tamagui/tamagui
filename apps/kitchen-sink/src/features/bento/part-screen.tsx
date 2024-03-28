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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    })
  }, [name, navigation])

  // console.log(Object.values(sections[name]))

  return (
    <ScrollView>
      <YStack jc="center" ai="center" bg="$background" minWidth="100%" px="$2">
        {Object.values(sections[name] ?? []).map((Component, index) => {
          const ComponentElement = Component as React.ElementType
          return <ComponentElement key={index} />
        })}
      </YStack>
    </ScrollView>
  )
}
