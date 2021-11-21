export const button = {
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

  // Custom reset?
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  lineHeight: '1',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',

  // Custom
  height: '$5',
  px: '$2',
  fontFamily: '$untitled',
  fontSize: '$2',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',

  '&:disabled': {
    backgroundColor: '$slate2',
    boxShadow: 'inset 0 0 0 1px $colors$slate7',
    color: '$slate8',
    pointerEvents: 'none',
  },

  variants: {
    size: {
      '1': {
        borderRadius: '$1',
        height: '$5',
        px: '$2',
        fontSize: '$1',
        lineHeight: '$sizes$5',
      },
      '2': {
        borderRadius: '$2',
        height: '$6',
        px: '$3',
        fontSize: '$3',
        lineHeight: '$sizes$6',
      },
      '3': {
        borderRadius: '$2',
        height: '$7',
        px: '$4',
        fontSize: '$4',
        lineHeight: '$sizes$7',
      },
    },
    variant: {
      gray: {
        backgroundColor: '$loContrast',
        boxShadow: 'inset 0 0 0 1px $colors$slate7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$slate8',
          },
        },
        '&:active': {
          backgroundColor: '$slate2',
          boxShadow: 'inset 0 0 0 1px $colors$slate8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$slate4',
          boxShadow: 'inset 0 0 0 1px $colors$slate8',
        },
      },
      blue: {
        backgroundColor: '$blue2',
        boxShadow: 'inset 0 0 0 1px $colors$blue7',
        color: '$blue11',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$blue8',
          },
        },
        '&:active': {
          backgroundColor: '$blue3',
          boxShadow: 'inset 0 0 0 1px $colors$blue8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$blue4',
          boxShadow: 'inset 0 0 0 1px $colors$blue8',
        },
      },
      green: {
        backgroundColor: '$green2',
        boxShadow: 'inset 0 0 0 1px $colors$green7',
        color: '$green11',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$green8',
          },
        },
        '&:active': {
          backgroundColor: '$green3',
          boxShadow: 'inset 0 0 0 1px $colors$green8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$green8, 0 0 0 1px $colors$green8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$green4',
          boxShadow: 'inset 0 0 0 1px $colors$green8',
        },
      },
      red: {
        backgroundColor: '$loContrast',
        boxShadow: 'inset 0 0 0 1px $colors$slate7',
        color: '$red11',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$slate8',
          },
        },
        '&:active': {
          backgroundColor: '$red3',
          boxShadow: 'inset 0 0 0 1px $colors$red8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$red8, 0 0 0 1px $colors$red8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$red4',
          boxShadow: 'inset 0 0 0 1px $colors$red8',
        },
      },
      transparentWhite: {
        backgroundColor: 'hsla(0,100%,100%,.2)',
        color: 'white',
        '@hover': {
          '&:hover': {
            backgroundColor: 'hsla(0,100%,100%,.25)',
          },
        },
        '&:active': {
          backgroundColor: 'hsla(0,100%,100%,.3)',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px hsla(0,100%,100%,.35), 0 0 0 1px hsla(0,100%,100%,.35)',
        },
      },
      transparentBlack: {
        backgroundColor: 'hsla(0,0%,0%,.2)',
        color: 'black',
        '@hover': {
          '&:hover': {
            backgroundColor: 'hsla(0,0%,0%,.25)',
          },
        },
        '&:active': {
          backgroundColor: 'hsla(0,0%,0%,.3)',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px hsla(0,0%,0%,.35), 0 0 0 1px hsla(0,0%,0%,.35)',
        },
      },
    },
    state: {
      active: {
        backgroundColor: '$slate4',
        boxShadow: 'inset 0 0 0 1px $colors$slate8',
        color: '$slate11',
        '@hover': {
          '&:hover': {
            backgroundColor: '$slate5',
            boxShadow: 'inset 0 0 0 1px $colors$slate8',
          },
        },
        '&:active': {
          backgroundColor: '$slate5',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8',
        },
      },
      waiting: {
        backgroundColor: '$slate4',
        boxShadow: 'inset 0 0 0 1px $colors$slate8',
        color: 'transparent',
        pointerEvents: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$slate5',
            boxShadow: 'inset 0 0 0 1px $colors$slate8',
          },
        },
        '&:active': {
          backgroundColor: '$slate5',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$slate8',
        },
      },
    },
    ghost: {
      true: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'gray',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$slate3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$slate4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$slate4',
          boxShadow: 'none',
        },
      },
    },
    {
      variant: 'blue',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$blue3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$blue4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$blue4',
          boxShadow: 'none',
        },
      },
    },
    {
      variant: 'green',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$green3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$green4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$green8, 0 0 0 1px $colors$green8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$green4',
          boxShadow: 'none',
        },
      },
    },
    {
      variant: 'red',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$red3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$red4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$red8, 0 0 0 1px $colors$red8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]': {
          backgroundColor: '$red4',
          boxShadow: 'none',
        },
      },
    },
  ],
  defaultVariants: {
    size: '1',
    variant: 'gray',
  },
};
