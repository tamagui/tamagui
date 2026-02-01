import { Text, XStack, YStack, Square } from 'tamagui'

export default function RNStylePropsTest() {
  return (
    <YStack p="$4" gap="$4" bg="$background">
      <Text fontSize="$8" fontWeight="bold">
        RN 0.76+ Style Props Test
      </Text>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxShadow (string)
        </Text>
        <Square size={100} bg="$blue10" boxShadow="0px 4px 12px rgba(0,0,0,0.3)" />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxShadow (object)
        </Text>
        <Square
          size={100}
          bg="$green10"
          boxShadow={{
            offsetX: 0,
            offsetY: 4,
            blurRadius: 12,
            spreadDistance: 0,
            color: 'rgba(0,0,0,0.3)',
          }}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxShadow with tokens
        </Text>
        <Square size={100} bg="$red10" boxShadow="$2 $4 $8 $shadowColor" />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxShadow object with tokens
        </Text>
        <Square
          size={100}
          bg="$blue10"
          boxShadow={{
            offsetX: '$2',
            offsetY: '$4',
            blurRadius: '$8',
            color: '$shadowColor',
          }}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxShadow inset
        </Text>
        <Square
          size={100}
          bg="$yellow10"
          boxShadow={{
            offsetX: 0,
            offsetY: 2,
            blurRadius: 8,
            color: 'rgba(0,0,0,0.5)',
            inset: true,
          }}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          filter (brightness)
        </Text>
        <Square size={100} bg="$blue10" filter={{ brightness: 1.3 }} />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          filter (multiple)
        </Text>
        <Square
          size={100}
          bg="$green10"
          filter={[{ brightness: 1.2 }, { contrast: 1.1 }]}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          mixBlendMode
        </Text>
        <XStack>
          <Square size={100} bg="$red10" />
          <Square size={100} bg="$blue10" ml={-50} mixBlendMode="multiply" />
        </XStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          isolation
        </Text>
        <XStack isolation="isolate">
          <Square size={100} bg="$red10" />
          <Square size={100} bg="$blue10" ml={-50} mixBlendMode="multiply" />
        </XStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          boxSizing
        </Text>
        <XStack gap="$2">
          <Square
            width={100}
            height={100}
            bg="$yellow10"
            p="$2"
            borderWidth={10}
            borderColor="$gray10"
            boxSizing="border-box"
          >
            <Text fontSize="$1">border-box</Text>
          </Square>
          <Square
            width={100}
            height={100}
            bg="$yellow10"
            p="$2"
            borderWidth={10}
            borderColor="$gray10"
            boxSizing="content-box"
          >
            <Text fontSize="$1">content-box</Text>
          </Square>
        </XStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          outline props
        </Text>
        <Square
          size={100}
          bg="$red10"
          outlineWidth={2}
          outlineStyle="solid"
          outlineColor="$blue10"
          outlineOffset={4}
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="bold">
          display: contents
        </Text>
        <XStack gap="$2" bg="$gray5" p="$2">
          <Square size={50} bg="$red10" />
          <YStack display="contents">
            <Square size={50} bg="$green10" />
            <Square size={50} bg="$blue10" />
          </YStack>
          <Square size={50} bg="$blue10" />
        </XStack>
      </YStack>
    </YStack>
  )
}
