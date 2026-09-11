import { Text, ZStack } from 'tamagui'

const runtimeFont = (globalThis as any).__fixtureFont as string

export function Beta() {
  return (
    <ZStack data-testid="beta">
      <Text fontFamily={runtimeFont}>beta</Text>
    </ZStack>
  )
}
