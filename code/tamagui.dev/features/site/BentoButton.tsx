import { Button, type ButtonProps, Text, YStack } from 'tamagui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      borderWidth={0.5}
      borderColor="$color6"
      size="$3"
      rounded="$10"
      fontFamily="$silkscreen"
      fontSize={12}
      hoverStyle={{
        borderColor: '$color7',
        bg: '$color5',
      }}
      {...props}
    >
      Bento
      <YStack display="inline-flex" mx={4}>
        <BentoIcon scale={0.75} />
      </YStack>
      <Text
        fontFamily="$mono"
        y={-0.5}
        fontSize="$4"
        color="$color10"
        $sm={{ display: 'none' }}
      >
        more ui
      </Text>
    </Button>
  )
}
