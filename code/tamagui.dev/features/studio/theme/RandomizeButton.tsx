import { Dices } from '@tamagui/lucide-icons'
import { Button, TooltipSimple } from 'tamagui'
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
        size="$2"
        br="$8"
        circular
        scaleIcon={1.3}
      />
    </TooltipSimple>
  )
}
