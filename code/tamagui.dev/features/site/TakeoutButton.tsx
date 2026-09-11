import { Button, type ButtonProps } from '~/components/Button'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button
      theme="red"
      borderColor="color-6"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      size="3"
      rounded="5"
      z="hover:100"
      {...props}
    >
      <Button.Text fontSize={12}>Starter Kit</Button.Text>
      <Button.Icon>
        <TakeoutIcon scale={0.75} />
      </Button.Icon>
    </Button>
  )
}
