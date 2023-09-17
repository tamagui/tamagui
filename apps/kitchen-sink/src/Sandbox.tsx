// import './wdyr'

import { CheckboxDemo, RadioGroupDemo } from '@tamagui/demos'
import { Stack, styled } from '@tamagui/web'
import { Anchor, SizableText } from 'tamagui'

const X = styled(SizableText, {
  size: '$10',
})

const ChangeWeight = styled(Stack, {
  backgroundColor: 'red',
})

export const MyAnchor = styled(Anchor, {
  name: 'Link',
  cursor: 'pointer',
  fontWeight: '700',
  textDecorationLine: 'underline',
})

export const Sandbox = () => {
  return (
    <>
      <CheckboxDemo />
      <ChangeWeight />
    </>
  )
}
