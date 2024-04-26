import { defaultBaseTemplate } from './defaultTemplates'

export const defaultScaleGrouped = [
  {
    keys: ['$color1', '$background'],
    name: 'Background',
    value: defaultBaseTemplate.color1,
  },
  { keys: ['$color2'], name: 'Subtle Background', value: defaultBaseTemplate.color2 },
  { keys: ['$color3'], name: 'UI Background', value: defaultBaseTemplate.color3 },
  {
    keys: ['$color4'],
    name: 'Hover UI Background',
    value: defaultBaseTemplate.color4,
  },
  {
    keys: ['$color5'],
    name: 'Active UI Background',
    value: defaultBaseTemplate.color5,
  },
  { keys: ['$color6'], name: 'Subtle Border', value: defaultBaseTemplate.color6 },
  { keys: ['$color7'], name: 'Strong Border', value: defaultBaseTemplate.color7 },
  { keys: ['$color8'], name: 'Hover Border', value: defaultBaseTemplate.color8 },
  { keys: ['$color9'], name: 'Primary', value: defaultBaseTemplate.color9 },
  { keys: ['$color10'], name: 'Hover Primary', value: defaultBaseTemplate.color10 },
  { keys: ['$color11'], name: 'Subtle Text', value: defaultBaseTemplate.color11 },
  { keys: ['$color12', '$color'], name: 'Text', value: defaultBaseTemplate.color12 },

  {
    keys: ['$accentBackground'],
    name: 'Background',
    value: defaultBaseTemplate.accentBackground,
  },
  { keys: ['$accentColor'], name: 'Foreground', value: defaultBaseTemplate.accentColor },

  { keys: ['$background0'], name: '0% Opacity', value: defaultBaseTemplate.background0 },
  {
    keys: ['$background025'],
    name: '0.25% Opacity',
    value: defaultBaseTemplate.background025,
  },
  {
    keys: ['$background05'],
    name: '0.5% Opacity',
    value: defaultBaseTemplate.background05,
  },
  {
    keys: ['$background075'],
    name: '0.75% Opacity',
    value: defaultBaseTemplate.background075,
  },

  { keys: ['$color0'], name: '0% Opacity', value: defaultBaseTemplate.color0 },
  { keys: ['$color025'], name: '0.25% Opacity', value: defaultBaseTemplate.color025 },
  { keys: ['$color05'], name: '0.5% Opacity', value: defaultBaseTemplate.color05 },
  { keys: ['$color075'], name: '0.75% Opacity', value: defaultBaseTemplate.color075 },
] as const
