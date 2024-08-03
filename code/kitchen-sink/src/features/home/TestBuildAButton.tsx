import React from "react";import { getSize, getSpace } from '@tamagui/get-token';
import { Moon } from '@tamagui/lucide-icons';
import type {
  GetProps,
  SizeTokens } from '@tamagui/web';
import {
  Stack,
  Text,
  createStyledContext,
  styled,
  useTheme,
  withStaticProperties } from
'@tamagui/web';


export const TestBuildAButton = () => {
  return (
    <>
      {new Array(1).fill(0).map((i) =>
      <Button2 key={i}>
          <Button2.Text>hi</Button2.Text>
          <Button2.Icon>
            <Moon />
          </Button2.Icon>
        </Button2>
      )}
    </>);

};

export const ButtonContext = createStyledContext({
  size: ('$4' as SizeTokens)
});

export const ButtonFrame = styled(Stack, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  hoverStyle: {
    backgroundColor: '$backgroundHover'
  },

  pressStyle: {
    backgroundColor: '$backgroundPress'
  },

  variants: ({
    size: {
      '...size': (name, { tokens }) => {
        return {
          height: tokens.size[name],
          borderRadius: tokens.radius[name],
          gap: tokens.space[name].val * 0.2,
          paddingHorizontal: getSpace(name, {
            shift: -1
          })
        };
      }
    }
  } as const),

  defaultVariants: {
    size: '$4'
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
  // @ts-ignore
  const { size } = React.useContext(ButtonContext);
  const smaller = getSize(size, {
    shift: -2
  });
  const theme = useTheme();
  return React.cloneElement(props.children, {
    size: smaller.val * 0.5,
    color: theme.color.get()
  });
};

export const Button2 = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: ButtonIcon
});