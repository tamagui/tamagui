import React from "react";
import { Input, styled } from 'tamagui';

const StyledInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 5,

  variants: ({
    test: {
      true: {
        focusStyle: {
          borderWidth: 10,
          borderColor: 'blue'
        }
      }
    }
  } as const)
});

export function StyledInputOnFocus() {
  const [onFocus, setOnFocus] = React.useState(false);
  return (
    <StyledInput
      test
      data-onfocus={onFocus}
      id="onFocus"
      onFocus={() => setOnFocus(true)} />);


}