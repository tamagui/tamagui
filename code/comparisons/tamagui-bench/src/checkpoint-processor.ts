import { validStyles } from '@tamagui/helpers'
import { getSplitStyles, setConfig } from '@tamagui/web'

const color = {
  isVar: true,
  key: '$brand',
  name: 'color-brand',
  val: '#2563eb',
  variable: 'var(--color-brand)',
}
const space = {
  isVar: true,
  key: '$2',
  name: 'space-2',
  val: 8,
  variable: 'var(--space-2)',
}

const config: any = {
  animations: {
    animations: { quick: '120ms ease' },
    outputStyle: 'css',
  },
  defaultFontToken: 'body',
  fonts: {},
  fontsParsed: {},
  inverseShorthands: { backgroundColor: 'bg', padding: 'p' },
  media: { sm: { maxWidth: 800 } },
  settings: { defaultFont: 'body', styleCompat: 'web' },
  shorthands: { bg: 'backgroundColor', p: 'padding' },
  themes: { light: { brand: color }, dark: { brand: color } },
  tokens: {},
  tokensParsed: {
    color: { $brand: color },
    radius: {},
    size: {},
    space: { $2: space },
    zIndex: {},
  },
}
setConfig(config)

const staticConfig: any = {
  acceptsClassName: true,
  compoundVariants: [
    {
      tone: 'warm',
      elevated: true,
      style: {
        borderColor: 'rgb(154,52,18) web:rgb(124,45,18)',
        borderWidth: '1px sm:2px',
      },
    },
  ],
  validStyles,
  variants: {
    elevated: {
      true: { y: '0 hover:-2', scale: '1 press:0.98' },
    },
    tone: {
      warm: { backgroundColor: '$brand hover:rgb(234,88,12)' },
      cool: { backgroundColor: 'rgb(147,197,253) hover:rgb(37,99,235)' },
    },
  },
}

const props = (globalThis as any).__checkpoint0ProcessorInput ?? {
  tone: 'warm',
  elevated: true,
  group: 'card',
  containerName: 'card',
  bg: '$brand hover:rgb(29,78,216) sm:rgb(30,64,175)',
  p: '$2',
  width: '24px sm:32px @sm/card:40px',
  height: { default: 24, hover: 30 },
  opacity: '1 enter:0.2 disabled:0.5',
  rotate: '0deg hover:3deg',
  transition: 'quick',
}

;(globalThis as any).__checkpoint0ProcessorResult = getSplitStyles(
  props,
  staticConfig,
  config.themes.light,
  'light',
  {
    disabled: false,
    focus: false,
    focusVisible: false,
    focusWithin: false,
    hover: true,
    press: false,
    pressIn: false,
    unmounted: false,
  } as any,
  {
    isAnimated: true,
    mediaState: { sm: true },
    noClass: false,
    resolveValues: 'auto',
  } as any,
  {},
  {
    animationDriver: config.animations,
    groups: { state: {} },
  } as any,
  {
    '@card': {
      state: { layout: { height: 100, width: 640 }, pseudo: {} },
      subscribe: () => () => {},
    },
    card: {
      state: { layout: { height: 100, width: 640 }, pseudo: { hover: true } },
      subscribe: () => () => {},
    },
  } as any,
  'div',
  false
)
