import { Button, type ButtonProps, Theme, YStack } from 'tamagui'
import { AddevenIcon } from '../icons/AddevenIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Theme name="black">
      <Button.Frame size="$3" rounded="$10" {...props}>
        <Button.Text fontFamily="$silkscreen" fontSize={12}>
          Build
        </Button.Text>
        <YStack display="inline-flex" mx="$2">
          <AddevenIcon scale={0.75} />
        </YStack>
      </Button.Frame>
    </Theme>
  )
}
