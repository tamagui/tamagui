import type { SimpleThemesDefinition } from './createThemes'

/**
 * @deprecated component themes are no longer recommended - configure component styles directly via themes or component defaultProps instead
 */
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
  SliderTrackActive: { template: 'surface2' },
  SliderTrack: { template: 'inverse' },
  SliderThumb: { template: 'inverse' },
  Tooltip: { template: 'inverse' },
  ProgressIndicator: { template: 'inverse' },
  Input: { template: 'surface1' },
  TextArea: { template: 'surface1' },
} satisfies SimpleThemesDefinition
