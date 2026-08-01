import { XStack, YStack, styled, Text } from 'tamagui'

// Test styled component with media queries in definition
const ContainerWithMedia = styled(XStack, {
  pt: 'sm:100px',
  mx: 'sm:100px',
  height: 'sm:100px',
  width: 'sm:100px',
  background: 'sm:red',
})

// Test styled component with pseudo selectors in definition
const ContainerWithPseudo = styled(XStack, {
  background: 'hover:yellow press:orange',
  scale: 'hover:1.1 press:0.9',
})

export const StyledMediaQueryMerge = () => (
  <YStack p="4">
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
      Styled Media Query Merge Test
    </Text>

    <Text style={{ fontSize: 12, color: '#666' }}>
      Testing that styled definition media queries and pseudo selectors are properly
      merged with runtime props
    </Text>

    <YStack>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Media Query Test:</Text>

      {/* Test 1: $sm media query merge */}
      <ContainerWithMedia id="test1" background="sm:blue">
        <Text style={{ color: 'white' }}>
          Should have pt: 100, mx: 100, height: 100, width: 100, background: blue
        </Text>
      </ContainerWithMedia>

      {/* Test 2: $sm media query with different runtime override */}
      <ContainerWithMedia id="test2" background="sm:purple">
        <Text style={{ color: 'white' }}>
          Should have pt: 100, mx: 100, height: 100, width: 100, background: purple
        </Text>
      </ContainerWithMedia>

      {/* Test 3: $sm media query with runtime override */}
      <ContainerWithMedia id="test3" background="sm:blue">
        <Text style={{ color: 'white' }}>
          Should merge $sm styled definition with runtime override
        </Text>
      </ContainerWithMedia>
    </YStack>

    <YStack>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Pseudo Selector Test:</Text>

      {/* Test 4: Pseudo selector merge */}
      <ContainerWithPseudo id="test4" background="hover:cyan press:magenta">
        <Text style={{ color: 'white' }}>
          Hover: yellow + cyan, Press: orange + magenta
        </Text>
      </ContainerWithPseudo>
    </YStack>

    <YStack>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
        Direct Component Test (Control):
      </Text>

      {/* Test 5: Direct component for comparison */}
      <XStack id="test5" pt="sm:50px" mx="sm:50px" background="sm:brown">
        <Text style={{ color: 'white' }}>
          Direct XStack: pt: 50, mx: 50, background: brown
        </Text>
      </XStack>
    </YStack>

    <Text style={{ fontSize: 12, color: '#666' }}>
      Expected: All styled definition properties should be preserved and merged with
      runtime properties
    </Text>
  </YStack>
)
