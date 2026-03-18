import { useState } from 'react'
import { Button, Text, View, XStack, YStack, styled } from 'tamagui'

const TransparentBox = styled(View, {
  width: 100,
  height: 100,

  variants: {
    faded: {
      true: {
        backgroundColor: '$customRed/50' as any,
      },
    },
  } as const,
})

export function OpacityModifierCase() {
  const [toggled, setToggled] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      {/* static background colors with opacity modifiers */}
      <XStack gap="$2">
        <View
          data-testid="opacity-bg-red-50"
          backgroundColor={'$customRed/50' as any}
          width={100}
          height={100}
        />
        <View
          data-testid="opacity-bg-blue-75"
          backgroundColor={'$customBlue/75' as any}
          width={100}
          height={100}
        />
        <View
          data-testid="opacity-bg-green-25"
          backgroundColor={'$customGreen/25' as any}
          width={100}
          height={100}
        />
      </XStack>

      {/* text color with opacity */}
      <View data-testid="opacity-text-container">
        <Text data-testid="opacity-text" color={'$customRed/50' as any} fontSize="$6">
          50% red text
        </Text>
      </View>

      {/* border color with opacity */}
      <View
        data-testid="opacity-border"
        borderColor={'$customRed/30' as any}
        borderWidth={2}
        width={100}
        height={100}
      />

      {/* $token/100 should be same as no modifier */}
      <View
        data-testid="opacity-bg-full"
        backgroundColor={'$customRed/100' as any}
        width={100}
        height={100}
      />

      {/* $token/0 should be fully transparent */}
      <View
        data-testid="opacity-bg-zero"
        backgroundColor={'$customRed/0' as any}
        width={100}
        height={100}
      />

      {/* variant with opacity modifier */}
      <TransparentBox data-testid="opacity-variant" faded={true as any} />

      {/* hover state with opacity modifier */}
      <View
        data-testid="opacity-hover"
        backgroundColor={'$customBlue/100' as any}
        hoverStyle={{
          backgroundColor: '$customBlue/50' as any,
        }}
        width={100}
        height={100}
      />

      {/* animated color with opacity modifier */}
      <View
        {...({
          'data-testid': 'opacity-animated',
          animation: '500ms',
          backgroundColor: toggled ? '$customBlue/75' : '$customRed/50',
          width: 100,
          height: 100,
        } as any)}
      />
      <Button data-testid="opacity-toggle" onPress={() => setToggled((v) => !v)}>
        Toggle
      </Button>

      {/* theme value with opacity modifier */}
      <View
        data-testid="opacity-theme-bg"
        backgroundColor={'$background/50' as any}
        width={100}
        height={100}
      />
    </YStack>
  )
}
