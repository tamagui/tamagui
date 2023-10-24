// import './wdyr'

import { View } from 'react-native'
import { GetProps, Stack, styled } from 'tamagui'

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>{/* ok */}</>
    </View>
  )
}

const MyStyledComponent = styled(Stack, {
  variants: {
    rootBackground: {
      blue: { backgroundColor: 'red' },
    },
  } as const,
})

export type MyStyledProps = GetProps<typeof MyStyledComponent>
type MyProps = {
  myCustomProp?: string
}

const MyComponent = MyStyledComponent.styleable<MyProps>((props, ref) => {
  return <MyStyledComponent ref={ref} {...props} />
})

const NewComponent = styled(MyComponent, {
  variants: {
    newBackground: { blue: { backgroundColor: 'red' } },
  } as const,
})

const a = <MyStyledComponent rootBackground="blue" />
const b = <MyComponent myCustomProp="sdasds" />
const x = <NewComponent newBackground="blue" myCustomProp="asdsa" />

// NewComponent won't have `myCustomProp` anymore, unless you remove variants on MyStyledComponent or NewComponent
