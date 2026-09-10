import { Button, type ButtonProps } from '~/components/Button'
import { AddEvenBrandIcon } from '~/features/icons/AddEvenBrandIcon'

export const ConsultingButton = (props: ButtonProps) => {
  return (
    <Button
      theme="gray"
      borderColor="color-6"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      size="3"
      rounded="5"
      z="hover:100"
      {...props}
    >
      <Button.Text fontSize={12}>Hire Us</Button.Text>
      <Button.Icon>
        <AddEvenBrandIcon scale={1} />
      </Button.Icon>
    </Button>
  )
}
