// import './wdyr'

import {
  SpecificTokens,
  SpecificTokensSpecial,
  Stack,
  StackStyleProps,
  StackStylePropsBase,
  TamaguiSettings,
  Token,
  Tokens,
  styled,
} from '@tamagui/web'

type asdasd = TamaguiSettings extends { autocompleteSpecificTokens: any } ? 'abc' : 'bce'
type x = StackStylePropsBase['margin']
type z = StackStyleProps['margin']
type zzz = Tokens['space']

const y = <Stack m={0} />

const ChangeWeight = styled(Stack, {
  backgroundColor: 'red',
})

export const Sandbox = () => {
  return (
    <>
      <ChangeWeight />
    </>
  )
}
