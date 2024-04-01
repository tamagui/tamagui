import * as rscSafeReact from '@tamagui/rsc-safe'
const { createContext } = rscSafeReact
console.log('rscSafeReact: ', rscSafeReact)

export const ThemeManagerIDContext = createContext<number>(1)
