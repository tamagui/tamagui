import { Button, type ButtonProps } from '~/components/Button'
import { AddEvenBrandIcon } from '~/features/icons/AddEvenBrandIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Button
      theme="gray"
      borderColor="$color6"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
      size="medium"
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
