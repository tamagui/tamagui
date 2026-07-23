import React from 'react'
import { Input, createStyledHOC, styled } from 'tamagui'

const StyledInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 5,

  variants: {
    test: {
      true: {
        focusStyle: {
          borderWidth: 10,
          borderColor: 'blue',
        },
      },
    },
  } as const,
})

const MyComponent = createStyledHOC(StyledInput)((props, ref) => (
  <StyledInput ref={ref as any} {...props} />
))

export function StyledStyleableInputOnFocus() {
  const [onFocus, setOnFocus] = React.useState(false)
  return (
    <MyComponent
      test
      data-onfocus={onFocus}
      id="onFocus"
      onFocus={() => setOnFocus(true)}
    />
  )
}
