// import './wdyr'

import { Stack, styled } from '@tamagui/web'
import { Anchor, SizableText, createSwitch } from 'tamagui'

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
      <Stack
        w={100}
        h={100}
        bc="red"
        onPress={() => console.log('hi')}
        onLongPress={() => console.log('asdas')}
      />
    </>
  )
}
