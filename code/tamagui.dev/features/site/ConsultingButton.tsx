import { Button, type ButtonProps, Theme, YStack } from 'tamagui'
import { AddevenIcon } from '../icons/AddevenIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Theme name="black">
      <Button.Frame
      borderWidth={0.5}
      borderColor="$color6"
      size="$3"
      rounded="$10"
      hoverStyle={{
        borderColor: '$color7',
        bg: '$color5',
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Consulting
      </Button.Text>
      <YStack display="inline-flex" mx="$2">
        <AddevenIcon scale={0.75} />
      </YStack>
      </Button.Frame>
    </Theme>
  )
}
