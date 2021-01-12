import { LinearGradientProps } from 'expo-linear-gradient'

let exp = null

console.log(
  'process.env.SNACKUI_COMPILE_PROCESS',
  process.env.SNACKUI_COMPILE_PROCESS
)

if (!process.env.SNACKUI_COMPILE_PROCESS) {
  exp = require('expo-linear-gradient').LinearGradient
}

// TODO type
export const LinearGradient = (exp as any) as (
  props: LinearGradientProps
) => any
