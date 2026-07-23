import { Dices } from '@tamagui/lucide-icons-2'
import { TooltipSimple } from 'tamagui'
import { Button } from '~/components/Button'
import { themeBuilderStore } from './store/ThemeBuilderStore'

export function RandomizeButton() {
  return (
    <TooltipSimple label="Shuffle Display">
      <Button
        aria-label="Variations"
        onPress={() => {
          themeBuilderStore.randomizeDemoOptions()
        }}
        icon={Dices}
        size="small"
        rounded="$8"
        circular
        scaleIcon={1.3}
      />
    </TooltipSimple>
  )
}
