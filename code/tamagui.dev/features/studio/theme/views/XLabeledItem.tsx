import { Label, XStack } from 'tamagui'

export const XLabeledItem = ({ label, children }: { label: any; children: any }) => {
  return (
    <XStack
      m="$-3"
      p="$3"
      flex={1}
      flexBasis="auto"
      overflow="hidden"
      items="center"
      gap="$3"
    >
      <Label
        pointerEvents="none"
        maxW={50}
        minW={40}
        justify="flex-end"
        size="$1"
        color="$color10"
      >
        {label}
      </Label>

      <XStack items="center" gap="$2" flex={1}>
        {children}
      </XStack>
    </XStack>
  )
}
