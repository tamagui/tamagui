import { YStack } from 'tamagui'
import { Text } from '@tamagui/core'

export function StyleCompatCase() {
  return (
    <YStack gap="4" p="4" width={240}>
      <YStack
        testID="style-compat-flex-parent"
        height={80}
        width={120}
        borderWidth={1}
        borderColor="border-color"
      >
        <YStack testID="style-compat-flex-child" flex={1} minH={20} />
      </YStack>
      {[false, true].map((inline) => (
        <YStack key={String(inline)} gap="2">
          <Text
            disableClassName={inline}
            fontSize={20}
            lineHeight={1.5}
            testID={`leading-ratio-${inline}`}
          >
            Ratio leading
            <Text
              disableClassName={inline}
              fontSize={10}
              testID={`leading-child-${inline}`}
            >
              Small child
            </Text>
          </Text>
          <Text
            disableClassName={inline}
            fontSize={20}
            lineHeight="24px"
            testID={`leading-pixels-${inline}`}
          >
            Pixel leading
          </Text>
          <Text
            disableClassName={inline}
            fontFamily="body"
            fontSize={20}
            lineHeight="base"
            testID={`leading-font-${inline}`}
          >
            Font leading
          </Text>
          <Text
            disableClassName={inline}
            fontSize={20}
            lineHeight={24}
            testID={`leading-large-${inline}`}
          >
            Large ratio
          </Text>
          <Text
            disableClassName={inline}
            fontSize={20}
            style={{ lineHeight: 1.5 }}
            testID={`leading-style-${inline}`}
          >
            Style ratio
          </Text>
        </YStack>
      ))}
    </YStack>
  )
}
