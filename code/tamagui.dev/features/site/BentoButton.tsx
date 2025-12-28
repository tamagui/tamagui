import { Button, type ButtonProps, YStack } from 'tamagui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button.Frame
      borderWidth={0.5}
      borderColor="$color4"
      size="$3"
      rounded="$10"
      bg="$background01"
      hoverStyle={{
        borderColor: '$color5',
        bg: '$color5',
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Bento
      </Button.Text>
      <YStack display="inline-flex" mx="$2">
        <BentoIcon scale={0.75} />
      </YStack>
      <Button.Text
        fontFamily="$mono"
        y={-0.5}
        fontSize="$4"
        color="$color10"
        $sm={{ display: 'none' }}
      >
        more ui
      </Button.Text>
    </Button.Frame>
  )
}
