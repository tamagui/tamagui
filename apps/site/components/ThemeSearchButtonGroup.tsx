import { ThemeToggle } from '@components/ThemeToggle'
import { TooltipGroup, XGroup } from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton'

export function ThemeSearchButtonGroup() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <XGroup boc="$color2" bw={1} mah={32} bc="transparent" ai="center" size="$3">
        <ThemeToggle borderWidth={0} chromeless />
        <ColorToggleButton borderWidth={0} chromeless $xxs={{ display: 'none' }} />
      </XGroup>
    </TooltipGroup>
  )
}
