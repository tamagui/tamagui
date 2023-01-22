import { FormsDemo } from '@tamagui/demos'
import { Separator, Text, YStack, useDidFinishSSR } from 'tamagui'

export default function Home({ animationCode, compilationExamples }) {
  return (
    <>
      {useDidFinishSSR() ? (
        <YStack>
          <FormsDemo></FormsDemo>
          <Separator />
        </YStack>
      ) : (
        <YStack>
          <Text>Test</Text>
        </YStack>
      )}
    </>
  )
}
