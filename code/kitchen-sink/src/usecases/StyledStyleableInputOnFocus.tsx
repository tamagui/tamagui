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

const MyComponent = StyledInput.styleable((props, ref) =>
<StyledInput ref={ref} {...props} />
);

export function StyledStyleableInputOnFocus() {
  const [onFocus, setOnFocus] = React.useState(false);
  return (
    <MyComponent
      test
      data-onfocus={onFocus}
      id="onFocus"
      onFocus={() => setOnFocus(true)} />);


}