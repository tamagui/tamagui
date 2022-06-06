import { AnimationsDemo as AnimationsDemoBase } from '@tamagui/demos'
import dynamic from 'next/dynamic'

import { useTint } from './ColorToggleButton'

export { StacksDemo } from '@tamagui/demos'
export { ShapesDemo } from '@tamagui/demos'
export { TextDemo } from '@tamagui/demos'
export { ButtonDemo } from '@tamagui/demos'
export { ThemeInverseDemo } from '@tamagui/demos'
export { FormsDemo } from '@tamagui/demos'
export { LinearGradientDemo } from '@tamagui/demos'
export { HeadingsDemo } from '@tamagui/demos'
export { SeparatorDemo } from '@tamagui/demos'
export { ImageDemo } from '@tamagui/demos'
export { LabelDemo } from '@tamagui/demos'
export { GroupDemo } from '@tamagui/demos'
export { CardDemo } from '@tamagui/demos'
export { AvatarDemo } from '@tamagui/demos'
export { ProgressDemo } from '@tamagui/demos'
export { ListItemDemo } from '@tamagui/demos'

export const DrawerDemo = dynamic(() => import('./DrawerDemo'))

export const TooltipDemo = dynamic(() => import('@tamagui/demos/dist/jsx/TooltipDemo'))
export const PopoverDemo = dynamic(() => import('@tamagui/demos/dist/jsx/PopoverDemo'))
export const DialogDemo = dynamic(() => import('@tamagui/demos/dist/jsx/DialogDemo'))
export const AnimationsHoverDemo = dynamic(
  () => import('@tamagui/demos/dist/jsx/AnimationsHoverDemo')
)
export const AnimationsEnterDemo = dynamic(
  () => import('@tamagui/demos/dist/jsx/AnimationsEnterDemo')
)
export const AnimationsPresenceDemo = dynamic(
  () => import('@tamagui/demos/dist/jsx/AnimationsPresenceDemo')
)
export const SwitchDemo = dynamic(() => import('@tamagui/demos/dist/jsx/SwitchDemo'))
export const SliderDemo = dynamic(() => import('@tamagui/demos/dist/jsx/SliderDemo'))
export const SpinnerDemo = dynamic(() => import('@tamagui/demos/dist/jsx/SpinnerDemo'))
export const FeatherIconsDemo = dynamic(() => import('@tamagui/demos/dist/jsx/FeatherIconsDemo'))

export const AnimationsDemo = (props) => {
  const { tint } = useTint()
  return <AnimationsDemoBase tint={tint} {...props} />
}
