import { defaultTemplates } from '@tamagui/theme-builder'

const base = defaultTemplates.light_base

export const defaultScaleGrouped = [
  {
    keys: ['$color1', '$background'],
    name: 'Background',
    value: base.color1,
  },
  { keys: ['$color2'], name: 'Subtle Background', value: base.color2 },
  { keys: ['$color3'], name: 'UI Background', value: base.color3 },
  {
    keys: ['$color4'],
    name: 'Hover UI Background',
    value: base.color4,
  },
  {
    keys: ['$color5'],
    name: 'Active UI Background',
    value: base.color5,
  },
  { keys: ['$color6'], name: 'Subtle Border', value: base.color6 },
  { keys: ['$color7'], name: 'Strong Border', value: base.color7 },
  { keys: ['$color8'], name: 'Hover Border', value: base.color8 },
  { keys: ['$color9'], name: 'Primary', value: base.color9 },
  { keys: ['$color10'], name: 'Hover Primary', value: base.color10 },
  { keys: ['$color11'], name: 'Subtle Text', value: base.color11 },
  { keys: ['$color12', '$color'], name: 'Text', value: base.color12 },

  {
    keys: ['$accentBackground'],
    name: 'Background',
    value: base.accentBackground,
  },
  {
    keys: ['$accentColor'],
    name: 'Foreground',
    value: base.accentColor,
  },

  {
    keys: ['$background0'],
    name: '0% Opacity',
    value: base.background0,
  },
  {
    keys: ['$background025'],
    name: '0.25% Opacity',
    value: base.background025,
  },
  {
    keys: ['$background05'],
    name: '0.5% Opacity',
    value: base.background05,
  },
  {
    keys: ['$background075'],
    name: '0.75% Opacity',
    value: base.background075,
  },

  { keys: ['$color0'], name: '0% Opacity', value: base.color0 },
  { keys: ['$color025'], name: '0.25% Opacity', value: base.color025 },
  { keys: ['$color05'], name: '0.5% Opacity', value: base.color05 },
  { keys: ['$color075'], name: '0.75% Opacity', value: base.color075 },
] as const
