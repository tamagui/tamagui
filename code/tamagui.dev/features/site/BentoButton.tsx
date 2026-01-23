import { Button, type ButtonProps } from 'tamagui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      theme="green"
      borderColor="$color5"
      elevation="$2"
      size="$3"
      rounded="$10"
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Copy-Paste UI
      </Button.Text>
      <Button.Icon>
        <BentoIcon scale={0.8} />
      </Button.Icon>
    </Button>
  )
}
