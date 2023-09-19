// import './wdyr'

import { CheckboxDemo, RadioGroupDemo, SwitchDemo } from '@tamagui/demos'
import { Stack, styled } from '@tamagui/web'
import { Anchor, SizableText, Switch, createSwitch } from 'tamagui'

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

const StyledSwitch = createSwitch({})

export const Sandbox = () => {
  return (
    <>
      <StyledSwitch>
        <StyledSwitch.Thumb animation="quick" />
      </StyledSwitch>
    </>
  )
}
