import { type ComponentType, useState } from 'react'
import { Button, View, YStack } from 'tamagui'

/**
 * Program block delivery under code splitting.
 *
 * The program block encoding claims that because cross-program order is
 * irrelevant, appending a block at the end of the sheet is always safe and any
 * interleaving of code-split bundles is safe too. That is a claim about what
 * the browser *resolves*, so it cannot be checked by reading rule text — it
 * needs a real browser, real chunks, and computed styles before and after.
 *
 * The shell below renders two programs. Pressing the button dynamically imports
 * a second module, which is a genuine separate chunk, and that module brings one
 * program the shell already inserted and one it has never seen. If late
 * insertion disturbed anything, the shell's computed styles would move.
 */
export function ProgramBlockDeliveryCase() {
  const [Late, setLate] = useState<ComponentType | null>(null)

  return (
    <YStack gap="$4" p="$4">
      <View
        data-testid="early-shared"
        width={80}
        height={80}
        backgroundColor="rgb(10, 20, 30) hover:rgb(40, 50, 60)"
      />
      <View
        data-testid="early-only"
        width={80}
        height={80}
        backgroundColor="rgb(150, 150, 150)"
        color="rgb(70, 80, 90) hover:rgb(100, 110, 120)"
      />

      <Button
        data-testid="load-late"
        onPress={async () => {
          const loaded = await import('./ProgramBlockDeliveryLate')
          setLate(() => loaded.ProgramBlockDeliveryLate)
        }}
      >
        load late chunk
      </Button>

      {Late ? <Late /> : null}
    </YStack>
  )
}
