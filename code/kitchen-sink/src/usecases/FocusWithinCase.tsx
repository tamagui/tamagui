import { useRef } from 'react'
import { Input, Text, YStack, styled } from 'tamagui'

const FocusWithinContainer = styled(YStack, {
  borderColor: '#ddd focus-within:blue',
  borderWidth: '1px focus-within:2px',
  padding: 20,
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
        borderColor="#ddd focus-within:red"
        borderWidth="1px focus-within:2px"
        padding={20}
      >
        <RenderCounter id="direct" />
        <Text>Direct prop</Text>
        <Input data-testid="direct-input" placeholder="Focus me" />
      </YStack>

      {/* styled() path — exercises a focus-within clause in a styled definition */}
      <FocusWithinContainer data-testid="styled-parent">
        <RenderCounter id="styled" />
        <Text>Styled component</Text>
        <Input data-testid="styled-input" placeholder="Focus me" />
      </FocusWithinContainer>

      {/* animated path — exercises JS state via animation driver */}
      <YStack
        data-testid="animated-parent"
        borderColor="#ddd focus-within:green"
        borderWidth="1px focus-within:2px"
        padding={20}
        transition="quick"
      >
        <RenderCounter id="animated" />
        <Text>Animated</Text>
        <Input data-testid="animated-input" placeholder="Focus me" />
      </YStack>
    </YStack>
  )
}
