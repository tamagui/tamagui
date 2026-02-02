import { Button, type ButtonProps } from 'tamagui'
import { AddEvenBrandIcon } from '~/features/icons/AddEvenBrandIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Button
      theme="gray"
      borderColor="$color6"
      elevation="$2"
      size="$3"
      rounded="$10"
      hoverStyle={{
        z: 100,
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Hire Us
      </Button.Text>
      <Button.Icon>
        <AddEvenBrandIcon scale={1} />
      </Button.Icon>
    </Button>
  )
}
