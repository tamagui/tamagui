import { BlurView as NativeBlurView } from '@react-native-community/blur'
import { styled } from '@tamagui/core'

export const BlurView = styled(NativeBlurView, {
  blurType: 'light',
  blurAmount: 10,
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})
