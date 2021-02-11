import { LinearGradientProps } from 'expo-linear-gradient'
import React from 'react'
import { render } from 'react-dom'

type LinearGradientComponent = (
  props: LinearGradientProps
) => JSX.Element | null

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
