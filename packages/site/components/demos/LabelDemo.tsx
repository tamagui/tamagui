import { Input, Label, XStack } from 'tamagui'

export default function LabelDemo() {
  return (
    <XStack p="$3" space="$2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" defaultValue="Nate Wienert" />
    </XStack>
  )
}
