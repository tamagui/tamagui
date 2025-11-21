import { type ButtonProps, SizableText, YStack } from 'tamagui'

export const ButtonSimple = ({
  color = '$color12',
  fontSize,
  fontFamily = '$mono',
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <YStack
      rounded="$4"
      px="$4"
      py="$2"
      bg="$color1"
      borderWidth={0.5}
      borderColor="$color3"
      hoverStyle={{
        bg: '$color2',
        borderColor: '$color5',
      }}
      disabled
      {...rest}
    >
      <SizableText
        cursor="default"
        text="center"
        fontSize={14}
        fontFamily={fontFamily}
        color={color}
      >
        {children}
      </SizableText>
    </YStack>
  )
}
