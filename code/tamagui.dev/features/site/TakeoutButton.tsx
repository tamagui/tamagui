import { Button, type ButtonProps, YStack } from 'tamagui'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button theme="red" size="$3" rounded="$10" {...props}>
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Starter Kit
      </Button.Text>
      <Button.Icon>
        <TakeoutIcon scale={0.75} />
      </Button.Icon>
    </Button>
  )
}
