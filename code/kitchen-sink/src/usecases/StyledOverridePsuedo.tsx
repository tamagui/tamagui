import { Input, TamaguiProvider, YStack, styled } from 'tamagui'

const TransparentInput = styled(Input, {
  borderColor: 'red hover:green focus:blue',
  borderWidth: '2px hover:5px focus:0px',
  outlineColor: 'transparent hover:transparent focus:transparent',
})

export function StyledOverridePsuedo() {
  return (
    <YStack gap="4">
      <TransparentInput placeholder="transparent border 0px" />
      <Input placeholder="default input" />
    </YStack>
  )
}
