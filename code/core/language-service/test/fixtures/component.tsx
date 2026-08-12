import { LogoIcon } from '@tamagui/logo'
import { styled as styledTailwind } from '@tamagui/tailwind'
import { styled, Text, View } from 'tamagui'

const Frame = styled(View, {
  padding: '',
})

styled(View, {
  fontSize: '',
})

styledTailwind(View, {
  variants: {
    roomy: {
      padding: '',
    },
  },
})

export function CompletionFixture() {
  return (
    <>
      <Frame bg="" />
      <Frame bg="blue hover:" />
      <Frame bg="blue hover:b" />
      <Frame bg="blue " />
      <Frame bg="blue s" />
      <Frame bg="blue sm:" />
      <Frame bg="blue sm:h" />
      <Frame bg={'\x62lue'} />
      <Frame bg={`\x62lue`} />
      <Frame bg={'blue hover\x3ared'} />
      <Text fontSize="" />
      <View display="" />
      <View fontSize="" />
      <View shadowColor="hover:" />
      <LogoIcon color="" />
      <div color="" />
    </>
  )
}
