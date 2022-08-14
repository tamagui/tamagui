import React from 'react'
import { TooltipGroup, XGroup } from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton.client'
import { SearchButton } from './SearchButton.client'
import { ThemeToggleButton } from './ThemeToggleButton.client'

export function HeaderButtonsGroup() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <XGroup bordered bc="transparent" borderColor="$borderColorHover" ai="center" size="$3">
        <SearchButton chromeless iconAfter={null} />
        <ThemeToggleButton chromeless />
        <ColorToggleButton chromeless $sm={{ display: 'none' }} />
      </XGroup>
    </TooltipGroup>
  )
}
