import { config } from '@tamagui/config-base'
import { InferTamaguiConfig } from '@tamagui/core'

export type Conf = InferTamaguiConfig<typeof config>

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export { default as StacksDemo } from './StacksDemo'
export { default as ShapesDemo } from './ShapesDemo'
export { default as TextDemo } from './TextDemo'
export { default as ButtonDemo } from './ButtonDemo'
export { default as ThemeInverseDemo } from './ThemeInverseDemo'
export { default as FormsDemo } from './FormsDemo'
export { default as LinearGradientDemo } from './LinearGradientDemo'
export { default as HeadingsDemo } from './HeadingsDemo'
export { default as SeparatorDemo } from './SeparatorDemo'
export { default as ImageDemo } from './ImageDemo'
export { default as AnimationsDemo } from './AnimationsDemo'
export { default as LabelDemo } from './LabelDemo'
export { default as GroupDemo } from './GroupDemo'
export { default as CardDemo } from './CardDemo'
export { default as AvatarDemo } from './AvatarDemo'
export { default as ProgressDemo } from './ProgressDemo'
export { default as ListItemDemo } from './ListItemDemo'
export { default as TooltipDemo } from './TooltipDemo'
// gorhom bottom-sheet giving kitchen-sink problems
// export { default as DrawerDemo } from './DrawerDemo'
// export { default as MenuDemo } from './MenuDemo'
export { default as PopoverDemo } from './PopoverDemo'
export { default as DialogDemo } from './DialogDemo'
export { default as AnimationsHoverDemo } from './AnimationsHoverDemo'
export { default as AnimationsEnterDemo } from './AnimationsEnterDemo'
export { default as AnimationsPresenceDemo } from './AnimationsPresenceDemo'
export { default as SwitchDemo } from './SwitchDemo'
export { default as SliderDemo } from './SliderDemo'
export { default as SpinnerDemo } from './SpinnerDemo'
export { default as FeatherIconsDemo } from './FeatherIconsDemo'
export * from './useOnIntersecting'
export * from './TamaguiLogo'
