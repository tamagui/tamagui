import * as Demos from '@tamagui/demos'
import React from 'react'
import { createParam } from 'solito'
import { H1, YStack } from 'tamagui'

const { useParam } = createParam<{ id: string }>()

const nameMap = {
  'Input + Textarea': 'Forms',
}

export function DemoScreen() {
  const [id] = useParam('id')
  const name = id[0].toUpperCase() + id.slice(1)
  const demoName = `${name}Demo`
  const DemoComponent = Demos[nameMap[demoName] || demoName] ?? NotFound

  return (
    <YStack f={1} jc="center" ai="center" space>
      <YStack maw={210} ai="center">
        <DemoComponent />
      </YStack>
    </YStack>
  )
}

const NotFound = () => <H1>Not found!</H1>
