export const config = {
  theme: {
    colors: {
      // semantic colors
      hiContrast: '$slate1000',
      loContrast: 'white',

      slate000: 'hsl(206 30% 98.8%)',
      slate100: 'hsl(210 16.7% 97.6%)',
      slate200: 'hsl(209 13.3% 95.3%)',
      slate300: 'hsl(209 12.2% 93.2%)',
      slate400: 'hsl(208 11.7% 91.1%)',
      slate500: 'hsl(208 11.3% 88.9%)',
      slate600: 'hsl(207 11.1% 85.9%)',
      slate700: 'hsl(205 10.7% 78%)',
      slate800: 'hsl(206 6% 56.1%)',
      slate900: 'hsl(206 6% 43.5%)',
      slate1000: 'hsl(206 24% 9%)',

      blue000: 'hsl(206 100% 99.2%)',
      blue100: 'hsl(204 100% 98%)',
      blue200: 'hsl(204 87.1% 95.7%)',
      blue300: 'hsl(205 82.9% 92.6%)',
      blue400: 'hsl(205 81.3% 88.4%)',
      blue500: 'hsl(206 80.9% 83.1%)',
      blue600: 'hsl(206 81.1% 76%)',
      blue700: 'hsl(206 81.9% 65.3%)',
      blue800: 'hsl(206 100% 50%)',
      blue900: 'hsl(211 100% 43.2%)',
      blue1000: 'hsl(211 100% 15%)',

      green000: 'hsl(136 50% 98.9%)',
      green100: 'hsl(138 62.5% 96.9%)',
      green200: 'hsl(139 49.8% 94.1%)',
      green300: 'hsl(140 44.4% 90.4%)',
      green400: 'hsl(141 41.6% 85.4%)',
      green500: 'hsl(143 40% 78.7%)',
      green600: 'hsl(146 39.4% 69%)',
      green700: 'hsl(151 40.2% 54.1%)',
      green800: 'hsl(151 55% 41.5%)',
      green900: 'hsl(153 67% 28.5%)',
      green1000: 'hsl(155 40% 14%)',

      red000: 'hsl(359 100% 99.4%)',
      red100: 'hsl(359 100% 98.6%)',
      red200: 'hsl(360 91.4% 96.5%)',
      red300: 'hsl(360 87.2% 94.2%)',
      red400: 'hsl(360 83.6% 91.5%)',
      red500: 'hsl(360 79.8% 87.8%)',
      red600: 'hsl(359 74.9% 82.1%)',
      red700: 'hsl(359 69.5% 74.3%)',
      red800: 'hsl(358 75% 59%)',
      red900: 'hsl(358 65% 48.7%)',
      red1000: 'hsl(354 50% 14.6%)',
    },
    fonts: {},
    space: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '35px',
      7: '45px',
      8: '65px',
      9: '80px',
    },
    sizes: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '35px',
      7: '45px',
      8: '65px',
      9: '80px',
    },
    fontSizes: {
      1: '12px',
      2: '13px',
      3: '15px',
      4: '17px',
      5: '19px',
      6: '21px',
      7: '27px',
      8: '35px',
      9: '59px',
    },
    radii: {
      1: '4px',
      2: '6px',
      3: '8px',
      4: '12px',
      round: '50%',
      pill: '9999px',
    },
    zIndices: {
      1: '100',
      2: '200',
      3: '300',
      4: '400',
      max: '999',
    },
  },
  media: {
    bp1: '(min-width: 520px)',
    bp2: '(min-width: 900px)',
    bp3: '(min-width: 1200px)',
    bp4: '(min-width: 1800px)',
    motion: '(prefers-reduced-motion)',
    hover: '(any-hover: hover)',
    dark: '(prefers-color-scheme: dark)',
    light: '(prefers-color-scheme: light)',
  },
  utils: {
    p: (config) => (value: any) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: (config) => (value: any) => ({
      paddingTop: value,
    }),
    pr: (config) => (value: any) => ({
      paddingRight: value,
    }),
    pb: (config) => (value: any) => ({
      paddingBottom: value,
    }),
    pl: (config) => (value: any) => ({
      paddingLeft: value,
    }),
    px: (config) => (value: any) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (config) => (value: any) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    m: (config) => (value: any) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: (config) => (value: any) => ({
      marginTop: value,
    }),
    mr: (config) => (value: any) => ({
      marginRight: value,
    }),
    mb: (config) => (value: any) => ({
      marginBottom: value,
    }),
    ml: (config) => (value: any) => ({
      marginLeft: value,
    }),
    mx: (config) => (value: any) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (config) => (value: any) => ({
      marginTop: value,
      marginBottom: value,
    }),

    ta: (config) => (value: any) => ({ textAlign: value }),

    fd: (config) => (value: any) => ({ flexDirection: value }),
    fw: (config) => (value: any) => ({ flexWrap: value }),

    ai: (config) => (value: any) => ({ alignItems: value }),
    ac: (config) => (value: any) => ({ alignContent: value }),
    jc: (config) => (value: any) => ({ justifyContent: value }),
    as: (config) => (value: any) => ({ alignSelf: value }),
    fg: (config) => (value: any) => ({ flexGrow: value }),
    fs: (config) => (value: any) => ({ flexShrink: value }),
    fb: (config) => (value: any) => ({ flexBasis: value }),

    bc: (config) => (value: any) => ({
      backgroundColor: value,
    }),

    br: (config) => (value: any) => ({
      borderRadius: value,
    }),
    btrr: (config) => (value: any) => ({
      borderTopRightRadius: value,
    }),
    bbrr: (config) => (value: any) => ({
      borderBottomRightRadius: value,
    }),
    bblr: (config) => (value: any) => ({
      borderBottomLeftRadius: value,
    }),
    btlr: (config) => (value: any) => ({
      borderTopLeftRadius: value,
    }),

    bs: (config) => (value: any) => ({ boxShadow: value }),

    lh: (config) => (value: any) => ({ lineHeight: value }),

    ox: (config) => (value: any) => ({ overflowX: value }),
    oy: (config) => (value: any) => ({ overflowY: value }),

    pe: (config) => (value: any) => ({ pointerEvents: value }),
    us: (config) => (value: any) => ({ WebkitUserSelect: value, userSelect: value }),

    size: (config) => (value: any) => ({
      width: value,
      height: value,
    }),

    linearGradient: (config) => (value: any) => ({
      backgroundImage: `linear-gradient(${value})`,
    }),

    appearance: (config) => (value) => ({
      WebkitAppearance: value,
      appearance: value,
    }),
    userSelect: (config) => (value) => ({
      WebkitUserSelect: value,
      userSelect: value,
    }),
    backgroundClip: (config) => (value) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value,
    }),
  },
}

export const darkThemeConfig = {
  colors: {
    hiContrast: '$slate1000',
    loContrast: '$slate000',

    slate000: 'hsl(200 7% 8.4%)',
    slate100: 'hsl(200 6.1% 9.6%)',
    slate200: 'hsl(200 6.2% 11.5%)',
    slate300: 'hsl(201 6.2% 13.6%)',
    slate400: 'hsl(201 6.3% 16.2%)',
    slate500: 'hsl(202 6.3% 19.6%)',
    slate600: 'hsl(203 6.3% 24.4%)',
    slate700: 'hsl(204 6.3% 31%)',
    slate800: 'hsl(206 6% 43.9%)',
    slate900: 'hsl(205 5% 52.9%)',
    slate1000: 'hsl(210 6% 93%)',

    blue000: 'hsl(212 25% 8.7%)',
    blue100: 'hsl(212 50% 10.2%)',
    blue200: 'hsl(211 57.9% 12.9%)',
    blue300: 'hsl(210 65.1% 15.7%)',
    blue400: 'hsl(209 72.5% 18.6%)',
    blue500: 'hsl(208 81.1% 22.1%)',
    blue600: 'hsl(207 92.7% 27.3%)',
    blue700: 'hsl(208 93.1% 40%)',
    blue800: 'hsl(206 100% 50%)',
    blue900: 'hsl(210 100% 66.1%)',
    blue1000: 'hsl(206 98% 95.8%)',

    red000: 'hsl(353 23% 9.4%)',
    red100: 'hsl(353 34.6% 10.2%)',
    red200: 'hsl(352 38.8% 11.9%)',
    red300: 'hsl(352 43.6% 14%)',
    red400: 'hsl(352 48.4% 16.7%)',
    red500: 'hsl(351 53.7% 20.2%)',
    red600: 'hsl(352 59.9% 25.2%)',
    red700: 'hsl(353 70.2% 36.9%)',
    red800: 'hsl(358 75% 59%)',
    red900: 'hsl(358 100% 68%)',
    red1000: 'hsl(351 89% 96%)',

    green000: 'hsl(146 30% 7.4%)',
    green100: 'hsl(147 42.9% 8.2%)',
    green200: 'hsl(147 43.8% 9.9%)',
    green300: 'hsl(148 45.7% 11.9%)',
    green400: 'hsl(148 47.8% 14.3%)',
    green500: 'hsl(149 50.4% 17.5%)',
    green600: 'hsl(150 53.7% 22.6%)',
    green700: 'hsl(151 59.8% 35.1%)',
    green800: 'hsl(151 55% 41.5%)',
    green900: 'hsl(136 50% 55.1%)',
    green1000: 'hsl(137 72% 94%)',
  },
}
