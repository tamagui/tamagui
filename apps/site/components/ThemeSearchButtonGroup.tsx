import { ThemeToggle } from '@components/ThemeToggle'
import React from 'react'
import { TooltipGroup, XGroup } from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton'
import { SearchButton } from './SearchButton'

export function ThemeSearchButtonGroup() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <XGroup bordered mah={32} bc="transparent" ai="center" size="$3">
        {/* <SearchButton borderWidth={0} chromeless iconAfter={null} /> */}
        <ThemeToggle borderWidth={0} chromeless />
        <ColorToggleButton borderWidth={0} chromeless $xxs={{ display: 'none' }} />
      </XGroup>
    </TooltipGroup>
  )
}
