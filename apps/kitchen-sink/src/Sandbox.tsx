// debug-verbose
// import './wdyr'

import { useState } from 'react'
import { View } from 'react-native'
import { Button, H2, Label, Separator, Square, Switch, XStack, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <SwitchWithLabel size="$4" />
      </>
    </View>
  )
}
export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} alignItems="center" space="$4">
      <Label
        paddingRight="$0"
        minWidth={90}
        justifyContent="flex-end"
        size={props.size}
        htmlFor={id}
      >
        Accept
      </Label>
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size} defaultChecked={props.defaultChecked}>
        <Switch.Thumb animation="quick" />
      </Switch>
    </XStack>
  )
}
