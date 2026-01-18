import { type ButtonProps, type ColorTokens, SizableText, YStack } from 'tamagui'

type ButtonSimpleProps = ButtonProps & {
  color?: ColorTokens
  fontSize?: number
  fontFamily?: string
  icon?: any
}

export const ButtonSimple = ({
  color = '$color12',
  fontSize,
  fontFamily = '$mono',
  children,
  disabled,
  ...rest
}: ButtonSimpleProps) => {
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
        fontFamily={fontFamily as any}
        color={color}
      >
        {children}
      </SizableText>
    </YStack>
  )
}
