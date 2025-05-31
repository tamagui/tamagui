import { type ButtonProps, SizableText, YStack } from '@tamagui/ui'

export const ButtonSimple = ({
  color = '$color12',
  fontSize,
  fontFamily = '$mono',
  children,
  ...rest
}: ButtonProps) => {
  return (
    <YStack
      br="$4"
      px="$4"
      py="$2"
      bg="$color1"
      bw={0.5}
      bc="$color3"
      hoverStyle={{
        bg: '$color2',
        bc: '$color5',
      }}
      {...rest}
    >
      <SizableText
        cur="default"
        textAlign="center"
        fontSize={14}
        fontFamily={fontFamily}
        color={color}
      >
        {children}
      </SizableText>
    </YStack>
  )
}
