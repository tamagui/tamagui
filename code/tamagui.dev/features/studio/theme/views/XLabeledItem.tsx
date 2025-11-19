import { Label, XStack } from 'tamagui'

export const XLabeledItem = ({ label, children }: { label: any; children: any }) => {
  return (
    <XStack m="$-3" p="$3" f={1} ov="hidden" ai="center" gap="$3">
      <Label pe="none" maw={50} miw={40} jc="flex-end" size="$1" col="$color10">
        {label}
      </Label>

      <XStack ai="center" gap="$2" f={1}>
        {children}
      </XStack>
    </XStack>
  )
}
