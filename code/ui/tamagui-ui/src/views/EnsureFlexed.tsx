import { Text, styled } from '@tamagui/core'

// expands flex elements when they should push a far as they "want" naturally

export const EnsureFlexed = styled(Text, {
  opacity: 0,
  lineHeight: 0,
  height: 0,
  display: 'flex',
  fontSize: 200,
  children: 'wwwwwwwwwwwwwwwwwww',
  pointerEvents: 'none',
})

// @tamgui/core checks for this in spacing
// @ts-ignore its ok some type setups dont like this
EnsureFlexed['isVisuallyHidden'] = true
