import { XStack, YStack, styled, Text } from 'tamagui'

// Test styled component with media queries in definition
const ContainerWithMedia = styled(XStack, {
  $sm: {
    pt: 100,
    mx: 100,
    height: 100,
    width: 100,
    background: 'red',
  },
})

// Test styled component with pseudo selectors in definition
const ContainerWithPseudo = styled(XStack, {
  hoverStyle: {
    background: 'yellow',
    scale: 1.1,
  },
  pressStyle: {
    background: 'orange',
    scale: 0.9,
  },
})

export const StyledMediaQueryMerge = () => (
  <YStack p="$4">
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
      <ContainerWithMedia id="test1" $sm={{ background: 'blue' }}>
        <Text style={{ color: 'white' }}>
          Should have pt: 100, mx: 100, height: 100, width: 100, background: blue
        </Text>
      </ContainerWithMedia>

      {/* Test 2: $sm media query with different runtime override */}
      <ContainerWithMedia id="test2" $sm={{ background: 'purple' }}>
        <Text style={{ color: 'white' }}>
          Should have pt: 100, mx: 100, height: 100, width: 100, background: purple
        </Text>
      </ContainerWithMedia>

      {/* Test 3: $sm media query with runtime override */}
      <ContainerWithMedia id="test3" $sm={{ background: 'blue' }}>
        <Text style={{ color: 'white' }}>
          Should merge $sm styled definition with runtime override
        </Text>
      </ContainerWithMedia>
    </YStack>

    <YStack>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Pseudo Selector Test:</Text>

      {/* Test 4: Pseudo selector merge */}
      <ContainerWithPseudo
        id="test4"
        hoverStyle={{ background: 'cyan' }}
        pressStyle={{ background: 'magenta' }}
      >
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
      <XStack id="test5" $sm={{ pt: 50, mx: 50, background: 'brown' }}>
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
