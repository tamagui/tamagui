import { Button, type ButtonProps } from 'tamagui'
import { BentoIcon } from '../icons/BentoIcon'
import { Span } from 'tamagui'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      theme="green"
      borderColor="$color6"
      elevation="$2"
      size="$3"
      rounded="$10"
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        <Span $sm={{ display: 'none' }}>Copy-Paste</Span> UI
      </Button.Text>
      <Button.Icon>
        <BentoIcon scale={0.8} />
      </Button.Icon>
    </Button>
  )
}
