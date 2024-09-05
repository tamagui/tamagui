import React from "react";import { getSize, getSpace } from '@tamagui/get-token';
import type { GetProps, SizeTokens } from '@tamagui/web';
import {
  View,
  Text,
  createStyledContext,
  styled,
  useTheme,
  withStaticProperties } from
'@tamagui/web';


export const ButtonContext = createStyledContext({
  size: ('$md' as SizeTokens)
});
export const ButtonFrame = styled(View, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  // Here is the issue: <---------------------------------------------------
  height: 'auto',
  animation: 'bouncy',
  pressStyle: {
    scale: 0.97,
    opacity: 0.9
  },

  variants: ({
    size: {
      '...size': (name, { tokens }) => {
        return {
          height: tokens.size[name],

          borderRadius: tokens.radius[name],

          // note the getSpace and getSize helpers will let you shift down/up token sizes

          // whereas with gap we just multiply by 0.2

          // this is a stylistic choice, and depends on your design system values

          gap: tokens.space[name].val * 0.2,

          paddingHorizontal: getSpace(name, {
            shift: -1
          })
        };
      }
    }
  } as const),

  defaultVariants: {
    size: '$5'
  }
});
type ButtonProps = GetProps<typeof ButtonFrame>;
export const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: ButtonContext,
  color: '$color',
  userSelect: 'none',
  variants: ({
    size: {
      '...fontSize': (name, { font }) => ({
        fontSize: font?.size[name]
      })
    }
  } as const)
});

const ButtonIcon = (props: {children: any;}) => {
  const { size } = React.useContext(ButtonContext.context);

  const smaller = getSize(size, {
    shift: -2
  });

  const theme = useTheme();

  return React.cloneElement(props.children, {
    size: smaller.val * 0.5,
    color: theme.color.get()
  });
};

const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: ButtonIcon
});

export const StyledButtonAnimationAuto = () =>
<Button id="test">
    <Button.Text>test</Button.Text>
  </Button>;