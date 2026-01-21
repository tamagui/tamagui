import { Button, type ButtonProps, YStack } from 'tamagui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button.Frame size="$3" rounded="$10" {...props}>
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Bento
      </Button.Text>
      <YStack display="inline-flex" mx="$2">
        <BentoIcon scale={0.75} />
      </YStack>
    </Button.Frame>
  )
}
