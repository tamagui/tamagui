import * as Demos from '@tamagui/demos'
import React from 'react'
import { createParam } from 'solito'
import { H1, YStack } from 'tamagui'

const { useParam } = createParam<{ id: string }>()

const nameMap = {
  Inputs: 'Forms',
}

export function DemoScreen() {
  const [id] = useParam('id')
  const name = id
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')
  const demoName = `${nameMap[name] || name}Demo`
  const DemoComponent = Demos[demoName] ?? NotFound

  return (
    <YStack bc="$backgroundStrong" f={1} jc="center" ai="center" space>
      <YStack miw={200} maw={300} ai="center">
        <DemoComponent />
      </YStack>
    </YStack>
  )
}

const NotFound = () => <H1>Not found!</H1>
