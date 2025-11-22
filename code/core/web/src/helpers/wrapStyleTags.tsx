import { IS_REACT_19 } from '@tamagui/constants'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
import type { StyleObject } from '../types'

// turns out this is pretty slow, creating a bunch of extra tags...

export function getStyleTags(styles: StyleObject[]) {
  if (IS_REACT_19 && process.env.TAMAGUI_TARGET !== 'native') {
    if (styles.length) {
      return (
        <>
          {styles.map((styleObject) => {
            const identifier = styleObject[StyleObjectIdentifier]
            return (
              <style
                key={identifier}
                // @ts-ignore
                href={`t_${identifier}`}
                // @ts-ignore
                precedence="default"
                // we remove after first render in favor of inserting to a global stylesheet (faster)
                suppressHydrationWarning
              >
                {styleObject[StyleObjectRules].join('\n')}
              </style>
            )
          })}
        </>
      )
    }
  }
}
