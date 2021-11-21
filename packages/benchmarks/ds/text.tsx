export const text = {
  lineHeight: '1',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'block',

  variants: {
    size: {
      '1': {
        fontSize: '$1',
      },
      '2': {
        fontSize: '$2',
      },
      '3': {
        fontSize: '$3',
      },
      '4': {
        fontSize: '$4',
      },
      '5': {
        fontSize: '$5',
        letterSpacing: '-.015em',
      },
      '6': {
        fontSize: '$6',
        letterSpacing: '-.016em',
      },
      '7': {
        fontSize: '$7',
        letterSpacing: '-.031em',
        textIndent: '-.005em',
      },
      '8': {
        fontSize: '$8',
        letterSpacing: '-.034em',
        textIndent: '-.018em',
      },
      '9': {
        fontSize: '$9',
        letterSpacing: '-.055em',
        textIndent: '-.025em',
      },
    },
    variant: {
      red: {
        color: '$red11',
      },
      crimson: {
        color: '$crimson11',
      },
      pink: {
        color: '$pink11',
      },
      purple: {
        color: '$purple11',
      },
      violet: {
        color: '$violet11',
      },
      indigo: {
        color: '$indigo11',
      },
      blue: {
        color: '$blue11',
      },
      cyan: {
        color: '$cyan11',
      },
      teal: {
        color: '$teal11',
      },
      green: {
        color: '$green11',
      },
      lime: {
        color: '$lime11',
      },
      yellow: {
        color: '$yellow11',
      },
      orange: {
        color: '$orange11',
      },
      gold: {
        color: '$gold11',
      },
      bronze: {
        color: '$bronze11',
      },
      gray: {
        color: '$slate11',
      },
      contrast: {
        color: '$hiContrast',
      },
    },
    gradient: {
      true: {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'red',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $red11, $crimson11)',
      },
    },
    {
      variant: 'crimson',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $crimson11, $pink11)',
      },
    },
    {
      variant: 'pink',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $pink11, $purple11)',
      },
    },
    {
      variant: 'purple',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $purple11, $violet11)',
      },
    },
    {
      variant: 'violet',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $violet11, $indigo11)',
      },
    },
    {
      variant: 'indigo',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $indigo11, $blue11)',
      },
    },
    {
      variant: 'blue',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $blue11, $cyan11)',
      },
    },
    {
      variant: 'cyan',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $cyan11, $teal11)',
      },
    },
    {
      variant: 'teal',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $teal11, $green11)',
      },
    },
    {
      variant: 'green',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $green11, $lime11)',
      },
    },
    {
      variant: 'lime',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $lime11, $yellow11)',
      },
    },
    {
      variant: 'yellow',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $yellow11, $orange11)',
      },
    },
    {
      variant: 'orange',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $orange11, $red11)',
      },
    },
    {
      variant: 'gold',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $gold11, $gold9)',
      },
    },
    {
      variant: 'bronze',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $bronze11, $bronze9)',
      },
    },
    {
      variant: 'gray',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $gray11, $gray12)',
      },
    },
    {
      variant: 'contrast',
      gradient: 'true',
      css: {
        background: 'linear-gradient(to right, $hiContrast, $gray12)',
      },
    },
  ],
  defaultVariants: {
    size: '3',
    variant: 'contrast',
  },
};
