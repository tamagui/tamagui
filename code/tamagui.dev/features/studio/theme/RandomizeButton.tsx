import { Button, TooltipSimple } from 'tamagui'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'
import { Dices } from '@tamagui/lucide-icons'

export function RandomizeButton() {
  const store = useThemeBuilderStore()

  return (
    <TooltipSimple label="Shuffle Display">
      <Button
        aria-label="Variations"
        onPress={() => {
          store.randomizeDemoOptions()
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
