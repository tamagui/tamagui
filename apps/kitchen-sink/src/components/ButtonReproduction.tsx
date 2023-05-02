import { Ref, forwardRef } from 'react'
import { Button, GetProps, TamaguiElement, styled } from 'tamagui'

const StyledButton = styled(Button, {
  height: '$5',
  borderRadius: '$1',
  paddingHorizontal: '$2',
  variants: {
    circular: {
      true: {
        padding: '$0',
        paddingLeft: 1,
        height: '$5',
        width: '$5',
        maxHeight: '$5',
        maxWidth: '$5',
        borderRadius: '$10',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    red: {
      true: {
        borderWidth: 1,
        theme: 'red',
      },
    },
    blue: {
      true: {
        borderWidth: 1,
        theme: 'blue',
      },
    },
    wrapper: {
      true: {
        padding: 0,
        margin: 0,
        height: 'unset',
        width: 'unset',
        borderRadius: 'unset',
        alignItems: undefined,
        justifyContent: undefined,
      },
    },
  },
})

export type ButtonProps = GetProps<typeof StyledButton>

export const CustomButton = forwardRef(
  ({ children, theme, ...props }: ButtonProps, ref: Ref<TamaguiElement>) => {
    const buttonTheme = theme || 'yellow'

    return (
      <StyledButton
        ref={ref}
        theme={buttonTheme}
        textProps={{
          fontSize: '$2',
          textTransform: 'uppercase',
          marginTop: 0,
          marginBottom: 0,
        }}
        {...props}
      >
        {children}
      </StyledButton>
    )
  }
)
