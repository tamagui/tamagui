type TamaguiFactories = {
  createFont: any
  createTamagui: any
  createTokens: any
}

export function createNativeBenchConfig({
  createFont,
  createTamagui,
  createTokens,
}: TamaguiFactories) {
  const sizes = {
    0: 0,
    1: 20,
    2: 28,
    3: 36,
    4: 44,
    5: 52,
    6: 64,
  }
  const font = createFont({
    family: 'System',
    size: { 1: 12, 2: 14, 3: 16, 4: 18, true: 16 },
    lineHeight: { 1: 16, 2: 20, 3: 24, 4: 26, true: 24 },
    weight: { 1: '400', 2: '500', 3: '600', 4: '700', true: '400' },
    letterSpacing: { 1: 0, 2: 0, 3: 0, 4: 0, true: 0 },
    transform: {},
    color: { 1: 'color', true: 'color' },
  })
  const tokens = createTokens({
    color: {
      white: '#ffffff',
      black: '#111827',
      blue3: '#bfdbfe',
      blue5: '#60a5fa',
      blue7: '#2563eb',
      blue8: '#1d4ed8',
      blue9: '#1e40af',
      green5: '#4ade80',
      pink5: '#f472b6',
      orange5: '#fb923c',
      gray1: '#f9fafb',
      gray2: '#f3f4f6',
      gray3: '#e5e7eb',
      gray4: '#d1d5db',
      gray6: '#9ca3af',
      gray8: '#6b7280',
      gray11: '#1f2937',
    },
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24 },
    size: sizes,
    radius: { 0: 0, 1: 3, 2: 5, 3: 7, 4: 9 },
    zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400 },
  })

  return createTamagui({
    tokens,
    themes: {
      light: {
        background: '#ffffff',
        backgroundHover: '#f3f4f6',
        backgroundPress: '#e5e7eb',
        borderColor: '#d1d5db',
        borderColorHover: '#9ca3af',
        color: '#111827',
        colorHover: '#111827',
        colorPress: '#111827',
      },
      light_blue: {
        background: '#60a5fa',
        backgroundHover: '#2563eb',
        backgroundPress: '#1d4ed8',
        borderColor: '#2563eb',
        borderColorHover: '#1d4ed8',
        color: '#ffffff',
        colorHover: '#ffffff',
        colorPress: '#ffffff',
      },
      light_blue_Button: {
        background: '#60a5fa',
        backgroundHover: '#2563eb',
        backgroundPress: '#1d4ed8',
        borderColor: '#2563eb',
        borderColorHover: '#1d4ed8',
        color: '#ffffff',
        colorHover: '#ffffff',
        colorPress: '#ffffff',
      },
    },
    fonts: { body: font, heading: font },
    media: {},
    shorthands: {},
    settings: { defaultFont: 'body', defaultSize: '4' },
  })
}
