import React from 'react'
import { View, styled } from '@tamagui/ui'

const StyledView = styled(View, {
  borderColor: 'red',
  borderWidth: 5,

  variants: {
    testVariant: {
      true: {
        focusStyle: {
          borderWidth: 10,
          borderColor: 'blue',
        },
      },
    },
  } as const,
})

export function StyledViewOnFocus() {
  const [onFocus, setOnFocus] = React.useState(false)
  return (
    <StyledView
      focusable
      testVariant
      data-onfocus={onFocus}
      id="onFocus"
      onFocus={() => setOnFocus(true)}
      tabIndex={0}
    />
  )
}
