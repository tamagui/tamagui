import { ThemeToggle } from '@components/ThemeToggle'
import { Group, TooltipGroup } from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton'
import { SearchButton } from './SearchButton'

export function ThemeSearchButtonGroup() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <Group bordered borderColor="$borderColorHover" ai="center" size="$3">
        <SearchButton iconAfter={null} />
        <ThemeToggle />
        <ColorToggleButton $sm={{ display: 'none' }} />
      </Group>
    </TooltipGroup>
  )
}
