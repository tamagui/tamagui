import { isWeb } from '@tamagui/constants'

// "hide logs during second invocation in strict mode" messing things up
// this actually didn't really fix it at all

export const groupEnd = console.groupEnd.bind(console)
export const gc = console.groupCollapsed.bind(console)
export const groupCollapsed = isWeb ? gc : console.info
