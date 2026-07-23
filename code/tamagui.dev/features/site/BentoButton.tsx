import { Button, type ButtonProps } from '~/components/Button'
import { BentoIcon } from '../icons/BentoIcon'
import { Span } from 'tamagui'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      theme="green"
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
        <Span $sm={{ display: 'none' }}>Copy-Paste</Span> UI
      </Button.Text>
      <Button.Icon>
        <BentoIcon scale={0.8} />
      </Button.Icon>
    </Button>
  )
}
