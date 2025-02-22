import React from 'react'
import { styled, View } from 'tamagui'

const StyleableView = React.memo(
  View.styleable(function StyleableView(props, forwardRef) {
    return <View x={15} y={15} w={50} h={50} bg="blue" {...props} ref={forwardRef} />
  })
)

const StyledView = styled(StyleableView, {})

export function GetParentStaticConfigOfStyledComponentWrappedByMemo() {
  return (
    <View bg="red" w={150} h={150}>
      <StyledView pressStyle={{ scale: 1.2 }} id="styled-view-wrapped-by-memo" />
    </View>
  )
}
