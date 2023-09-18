// import './wdyr'

import { CheckboxDemo, RadioGroupDemo, SwitchDemo } from '@tamagui/demos'
import { Trash2 } from '@tamagui/lucide-icons'
import { Stack, getTokens, styled } from '@tamagui/web'
import { Anchor, SizableText, Switch, createSwitch } from 'tamagui'

const StyledTrash = styled(Trash2, {
  acceptsClassName: true,
})

export const MyAnchor = styled(Anchor, {
  name: 'Link',
  cursor: 'pointer',
  fontWeight: '700',
  textDecorationLine: 'underline',
})

const tokens = getTokens()

export const Sandbox = () => {
  console.log('Test color', tokens.color['blue6Light']?.val)
  return (
    <>
      <Trash2 color={'$blue6Light'} size="$3" />
      <StyledTrash color={'$blue6Light'} size="$3" />
      <Trash2 color={tokens.color['$blue6Light']?.variable} size="$3" />
      {/* This is the example I have in my codebase */}
      <StyledTrash
        color={tokens.color['$blue6Light']?.variable}
        size="$3"
        $sm={{ width: 16, height: 16 }}
        $gtLg={{ width: 50, height: 50 }}
      />
    </>
  )
}
