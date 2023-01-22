// debug 123123123 123
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { useState } from 'react'
// debug 123 1223 123 123 123 123123cxw 13
import { Stack, styled } from 'tamagui'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

// const UnSquare = styled(Square, {
//   unset: 'all',
// })

const Box = styled(Stack, {
  variants: {
    shadow: {
      sm: {
        elevation: 1,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      md: {
        elevation: 6,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      lg: {
        elevation: 12,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
    },
  } as const,
})

export const SandboxDynamicEval = () => {
  const [theme, setTheme] = useState('light')

  return <Box>hi</Box>
}
