//! debug
import { YStack, styled } from 'tamagui'

export const MyComponent = styled(YStack, {
  name: 'MyComponent',
  bc: 'red',
})

export const MyComponentJSX = () => {
  return <MyComponent />
}
