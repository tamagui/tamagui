import React from 'react'
import { render } from 'react-dom'
import { View } from 'react-native'

export type LinearGradientPoint =
  | {
      x: number
      y: number
    }
  | [number, number]

export type LinearGradientProps = {
  colors: string[]
  /**
   * An array that contains `number`s ranging from 0 to 1, inclusive, and is the same length as the `colors` property.
   * Each number indicates a color-stop location where each respective color should be located.
   *
   * For example, `[0.5, 0.8]` would render:
   * - the first color, solid, from the beginning of the gradient view to 50% through (the middle);
   * - a gradient from the first color to the second from the 50% point to the 80% point; and
   * - the second color, solid, from the 80% point to the end of the gradient view.
   *
   * The color-stop locations must be ascending from least to greatest.
   */
  locations?: number[] | null
  /**
   * An object `{ x: number; y: number }` or array `[x, y]` that represents the point
   * at which the gradient starts, as a fraction of the overall size of the gradient ranging from 0 to 1, inclusive.
   *
   * For example, `{ x: 0.1, y: 0.2 }` means that the gradient will start `10%` from the left and `20%` from the top.
   *
   * **On web**, this only changes the angle of the gradient because CSS gradients don't support changing the starting position.
   */
  start?: LinearGradientPoint | null
  /**
   * An object `{ x: number; y: number }` or array `[x, y]` that represents the point
   * at which the gradient ends, as a fraction of the overall size of the gradient ranging from 0 to 1, inclusive.
   *
   * For example, `{ x: 0.1, y: 0.2 }` means that the gradient will end `10%` from the left and `20%` from the bottom.
   *
   * **On web**, this only changes the angle of the gradient because CSS gradients don't support changing the end position.
   */
  end?: LinearGradientPoint | null
} & React.ComponentProps<typeof View>

type LinearGradientComponent = (props: LinearGradientProps) => JSX.Element | null
let exp: LinearGradientComponent = () => null

// we dont export it in the snackui-static process
// expo-linear-gradient is a flow file :/
// TODO compile it ourselves for now so we can test

if (!process.env.SNACKUI_COMPILE_PROCESS) {
  exp = require('expo-linear-gradient').LinearGradient
}

export const LinearGradient = exp

// TODO revisit this, need a way to test so need to have this support native...
// if (process.env.IS_STATIC) {
//   // @ts-expect-error
//   LinearGradient.staticConfig = {
//     extract: (props, config) => {
//       if (config.env === 'web') {
//         const node = document.createElement('div')
//         render(<LinearGradient {...props} />, node)
//         // read styles from dom node...
//         console.log('what is', node)
//         return {
//           styles: {},
//         }
//       }
//     },
//   }
// }
