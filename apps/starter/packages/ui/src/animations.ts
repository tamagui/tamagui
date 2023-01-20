import { createAnimations } from '@tamagui/animations-css'
import { AnimationDriver } from '@tamagui/core'

export const animations: AnimationDriver = createAnimations({
    quick: 'ease-in 150ms',
    bouncy: 'ease-in 300ms',
    lazy: 'ease-in 450ms'
})
