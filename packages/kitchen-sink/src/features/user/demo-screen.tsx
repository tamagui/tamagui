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
  const name = id[0].toUpperCase() + id.slice(1)
  const demoName = `${nameMap[name] || name}Demo`
  const DemoComponent = Demos[demoName] ?? NotFound

  return (
    <YStack f={1} jc="center" ai="center" space>
      <YStack miw={200} maw={210} ai="center">
        <DemoComponent />
      </YStack>
    </YStack>
  )
}

const NotFound = () => <H1>Not found!</H1>
