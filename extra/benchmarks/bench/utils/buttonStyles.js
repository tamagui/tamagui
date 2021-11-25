export const buttonStyles = {
  // Reset
  all: 'unset',
  alignItems: 'center',
  boxSizing: 'border-box',
  userSelect: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  fontFamily: 'system-ui',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  '&:disabled': {
    backgroundColor: 'gray',
    boxShadow: 'inset 0 0 0 1px gray',
    color: 'gray',
    pointerEvents: 'none',
  },
  backgroundColor: 'white',
  boxShadow: 'inset 0 0 0 1px gray',
  color: 'black',
  '&:hover': {
    boxShadow: 'inset 0 0 0 1px gray',
  },
  '&:active': {
    backgroundColor: 'gray',
    boxShadow: 'inset 0 0 0 1px gray',
  },
  '&:focus': {
    boxShadow: 'inset 0 0 0 1px gray, 0 0 0 1px gray',
  },
  '&[data-radix-popover-trigger][data-state="open"]': {
    backgroundColor: 'gray',
    boxShadow: 'inset 0 0 0 1px gray',
  },
  borderRadius: '3px',
  height: '25px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '13px',
  lineHeight: '25px',
};

export const buttonVariants = {
  variants: {
    size: {
      1: {
        borderRadius: '2',
        height: '25px',
        px: '10px',
        fontSize: '13px',
        lineHeight: '1',
      },
      2: {
        borderRadius: '3',
        height: '35px',
        px: '15px',
        fontSize: '15px',
        lineHeight: '1',
      },
    },
    variant: {
      blue: {
        backgroundColor: 'blue',
        boxShadow: 'inset 0 0 0 1px black',
        color: 'black',
        '&:hover': {
          boxShadow: 'inset 0 0 0 1px black',
        },
        '&:active': {
          backgroundColor: 'black',
          boxShadow: 'inset 0 0 0 1px black',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px black, 0 0 0 1px black',
        },
        '&[data-radix-popover-trigger][data-state="open"]': {
          backgroundColor: 'black',
          boxShadow: 'inset 0 0 0 1px black',
        },
      },
      red: {
        backgroundColor: 'red',
        boxShadow: 'inset 0 0 0 1px black',
        color: 'black',
        '&:hover': {
          boxShadow: 'inset 0 0 0 1px black',
        },
        '&:active': {
          backgroundColor: 'black',
          boxShadow: 'inset 0 0 0 1px black',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px black, 0 0 0 1px black',
        },
        '&[data-radix-popover-trigger][data-state="open"]': {
          backgroundColor: 'black',
          boxShadow: 'inset 0 0 0 1px black',
        },
      },
    },
  },
};

export const buttonInterpolatedVariants = (props) => ({
  ...(props.size === '1' ? buttonVariants.variants.size['1'] : {}),
  ...(props.size === '2' ? buttonVariants.variants.size['2'] : {}),
  ...(props.variant === 'blue' ? buttonVariants.variants.variant['blue'] : {}),
  ...(props.variant === 'red' ? buttonVariants.variants.variant['red'] : {}),
});
