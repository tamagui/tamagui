import { Sheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Button, Text, useTheme, useThemeName, View } from 'tamagui'

/**
 * Reads the theme the portal actually put its subtree in.
 *
 * The computed CSS says the classes landed. This says the island's JavaScript
 * theme state carries the same thing, which is what a full-runtime component
 * inside the portal reads when it resolves `$background` itself.
 */
function PortalThemeProbe() {
  const name = useThemeName()
  const theme = useTheme()
  return (
    <Text data-testid="island-portal-theme-state" color="$color">
      {`${name}|${theme.background?.val}`}
    </Text>
  )
}

/**
 * The island: a full-runtime component that needs portals, measurement, and the
 * animation runtime, which is exactly what the zero graph cannot contain.
 */
export default function SheetIsland() {
  const [open, setOpen] = useState(false)
  return (
    <View data-testid="island-root">
      <Button data-testid="island-open" onPress={() => setOpen(true)}>
        open sheet
      </Button>
      <Sheet
        data-testid="island-sheet"
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[60]}
        transition="quick"
      >
        <Sheet.Overlay />
        <Sheet.Container data-testid="island-portal-frame" backgroundColor="$background">
          <View padding={20} gap={8}>
            <Text data-testid="island-portal-text" color="$color">
              portaled island content
            </Text>
            <PortalThemeProbe />
            <View data-testid="island-unique" width={137} height={19} />
            <Button data-testid="island-close" onPress={() => setOpen(false)}>
              close sheet
            </Button>
          </View>
        </Sheet.Container>
      </Sheet>
    </View>
  )
}
