import { Button, type ButtonProps } from '~/components/Button'
import { BentoIcon } from '../icons/BentoIcon'
import { Span } from 'tamagui'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      theme="green"
      borderColor="color6"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      size="3"
      rounded="5"
      z="hover:100"
      {...props}
    >
      <Button.Text fontSize={12}>
        <Span display="sm:none">Copy-Paste </Span>UI
      </Button.Text>
      <Button.Icon>
        <BentoIcon scale={0.8} />
      </Button.Icon>
    </Button>
  )
}
