import type { GenericSizing } from '@tamagui/web'

// v5's numeric scales cannot derive the ladder, so each rung points text,
// padding and radius at v5 keys and pins the frozen geometry: v5 buttons
// keep their heights while their text and spacing go v5-native
export const defaultSizing = {
  default: 'md',
  sizes: {
    xs: {
      fontSize: '1',
      controlFontSize: '1',
      paddingInline: '2',
      paddingBlock: '1-5',
      gap: '1-5',
      radius: '1',
      px: { height: 24, icon: 12, square: 17 },
    },
    sm: {
      fontSize: '3',
      controlFontSize: '3',
      paddingInline: '3',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 32, icon: 16, square: 20 },
    },
    md: {
      fontSize: '3',
      controlFontSize: '3',
      paddingInline: '3-5',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 36, icon: 16, square: 22 },
    },
    lg: {
      fontSize: '5',
      controlFontSize: '5',
      paddingInline: '5',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 40, icon: 16, square: 25 },
    },
    xl: {
      fontSize: '6',
      controlFontSize: '6',
      paddingInline: '6',
      paddingBlock: '2-5',
      gap: '2-5',
      radius: '3',
      px: { height: 48, icon: 20, square: 28 },
    },
  },
} as const satisfies GenericSizing
