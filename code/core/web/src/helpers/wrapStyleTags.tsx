import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
import type { StyleObject } from '../types'

export function wrapStyleTags(styles: StyleObject[], content?: any) {
  if (process.env.TAMAGUI_REACT_19 && process.env.TAMAGUI_TARGET !== 'native') {
    if (styles.length) {
      return (
        <>
          {content}
          {/* lets see if we can put a single style tag per rule for optimal de-duping */}
          {styles.map((styleObject) => {
            const identifier = styleObject[StyleObjectIdentifier]
            return (
              <style
                key={identifier}
                // @ts-ignore
                href={`t_${identifier}`}
                // @ts-ignore
                precedence="default"
              >
                {styleObject[StyleObjectRules].join('\n')}
              </style>
            )
          })}
        </>
      )
    }
  }

  return content
}
