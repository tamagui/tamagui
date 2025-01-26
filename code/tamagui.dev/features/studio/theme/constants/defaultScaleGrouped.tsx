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
    keys: ['$background02'],
    name: '0.2% Opacity',
    value: base.background02,
  },
  {
    keys: ['$background04'],
    name: '0.4% Opacity',
    value: base.background04,
  },
  {
    keys: ['$background06'],
    name: '0.6% Opacity',
    value: base.background06,
  },
  {
    keys: ['$background08'],
    name: '0.8% Opacity',
    value: base.background08,
  },

  { keys: ['$color0'], name: '0% Opacity', value: base.color0 },
  { keys: ['$color02'], name: '0.2% Opacity', value: base.color02 },
  { keys: ['$color04'], name: '0.4% Opacity', value: base.color04 },
  { keys: ['$color06'], name: '0.6% Opacity', value: base.color06 },
  { keys: ['$color08'], name: '0.8% Opacity', value: base.color08 },
] as const
