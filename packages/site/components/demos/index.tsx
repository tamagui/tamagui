import dynamic from 'next/dynamic'

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
export { default as ProgressDemo } from './ProgressDemo'

export const TooltipDemo = dynamic(() => import('./TooltipDemo'))
export const DrawerDemo = dynamic(() => import('./DrawerDemo'))
export const MenuDemo = dynamic(() => import('./MenuDemo'))
export const PopoverDemo = dynamic(() => import('./PopoverDemo'))
export const AnimationsHoverDemo = dynamic(() => import('./AnimationsHoverDemo'))
export const AnimationsEnterDemo = dynamic(() => import('./AnimationsEnterDemo'))
export const AnimationsPresenceDemo = dynamic(() => import('./AnimationsPresenceDemo'))
export const SwitchDemo = dynamic(() => import('./SwitchDemo'))
export const SliderDemo = dynamic(() => import('./SliderDemo'))
export const SpinnerDemo = dynamic(() => import('./SpinnerDemo'))
export const FeatherIconsDemo = dynamic(() => import('./FeatherIconsDemo'))
