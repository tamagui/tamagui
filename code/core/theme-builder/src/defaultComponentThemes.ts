import type { SimpleThemesDefinition } from './createThemes'

export const defaultComponentThemes = {
  ListItem: { template: 'surface1' },
  SelectItem: { template: 'surface1' },
  SelectTrigger: { template: 'surface1' },
  Card: { template: 'surface1' },
  Button: { template: 'surface3' },
  Checkbox: { template: 'surface2' },
  Switch: { template: 'surface2' },
  SwitchThumb: { template: 'inverse' },
  TooltipContent: { template: 'surface2' },
  Progress: { template: 'surface1' },
  RadioGroupItem: { template: 'surface2' },
  TooltipArrow: { template: 'surface1' },
  SliderTrackActive: { template: 'inverse' },
  SliderTrack: { template: 'surface3' },
  SliderThumb: { template: 'inverse' },
  Tooltip: { template: 'inverse' },
  ProgressIndicator: { template: 'inverse' },
  Input: { template: 'surface1' },
  TextArea: { template: 'surface1' },
} satisfies SimpleThemesDefinition
