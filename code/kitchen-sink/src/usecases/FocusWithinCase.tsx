import { useRef } from 'react'
import { Input, Text, YStack, styled } from 'tamagui'

const FocusWithinContainer = styled(YStack, {
  borderColor: '#ddd',
  borderWidth: 1,
  padding: 20,
  focusWithinStyle: { borderColor: 'blue', borderWidth: 2 },
})

function RenderCounter({ id }: { id: string }) {
  const count = useRef(0)
  count.current++
  return <Text data-testid={`${id}-renders`}>{count.current}</Text>
}

export function FocusWithinCase() {
  return (
    <YStack gap={20}>
      {/* direct prop path */}
      <YStack
        data-testid="direct-parent"
        focusWithinStyle={{ borderColor: 'red', borderWidth: 2 }}
        padding={20}
        borderColor="#ddd"
        borderWidth={1}
      >
        <RenderCounter id="direct" />
        <Text>Direct prop</Text>
        <Input data-testid="direct-input" placeholder="Focus me" />
      </YStack>

      {/* styled() path — exercises pseudos?.focusWithinStyle condition */}
      <FocusWithinContainer data-testid="styled-parent">
        <RenderCounter id="styled" />
        <Text>Styled component</Text>
        <Input data-testid="styled-input" placeholder="Focus me" />
      </FocusWithinContainer>

      {/* animated path — exercises JS state via animation driver */}
      <YStack
        data-testid="animated-parent"
        focusWithinStyle={{ borderColor: 'green', borderWidth: 2 }}
        padding={20}
        borderColor="#ddd"
        borderWidth={1}
        transition="quick"
      >
        <RenderCounter id="animated" />
        <Text>Animated</Text>
        <Input data-testid="animated-input" placeholder="Focus me" />
      </YStack>
    </YStack>
  )
}
