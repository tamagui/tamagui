import { Text } from '@tamagui/core'
import { Square } from 'tamagui'

export function Sandbox() {
  return (
    <>
      <Square size={200} bg="red" />
      <Button />
    </>
  )
}

const Style = Text as any
const style = (() => {}) as any

const buttonStyle = style('.button-child', {
  color: 'red',
})

const Button = () => {
  return (
    <>
      <Style apply={buttonStyle}>
        <Text className="button-child">hello world</Text>
        <Text className="button-child">hello world2</Text>
      </Style>

      <Style selector=".button-child" color="red">
        <Text className="button-child">hello world</Text>
        <Text className="button-child">hello world2</Text>
      </Style>
    </>
  )
}
