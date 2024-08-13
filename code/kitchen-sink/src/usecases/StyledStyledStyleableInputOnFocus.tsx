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

const AnotherStyled = styled(StyledInput);

const MyComponent = AnotherStyled.styleable((props, ref) =>
<StyledInput ref={ref} {...props} />
);

export function StyledStyledStyleableInputOnFocus() {
  const [onFocus, setOnFocus] = React.useState(false);
  return (
    <MyComponent
      test
      data-onfocus={onFocus}
      id="onFocus"
      onFocus={() => setOnFocus(true)} />);


}