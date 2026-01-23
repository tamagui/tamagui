import { Button, type ButtonProps } from 'tamagui'
import { AddevenIcon } from '~/features/icons/AddevenIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Button
      theme="black"
      borderColor="$color5"
      elevation="$2"
      size="$3"
      rounded="$10"
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Hire Us!
      </Button.Text>
      <Button.Icon>
        <AddevenIcon scale={0.75} />
      </Button.Icon>
    </Button>
  )
}
