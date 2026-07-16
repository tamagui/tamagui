import { Button, type ButtonProps } from '~/components/Button'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button
      theme="red"
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
        Starter Kit
      </Button.Text>
      <Button.Icon>
        <TakeoutIcon scale={0.75} />
      </Button.Icon>
    </Button>
  )
}
