import type { ReactNode } from 'react'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
import type { StyleObject } from '../types'

// turns out this is pretty slow, creating a bunch of extra tags...

const styleTagCache = new Map<
  string,
  {
    element: ReactNode
    len: number
    first: string | undefined
    last: string | undefined
  }
>()

let clearStyleTagCacheQueued = false

function queueStyleTagCacheClear() {
  if (clearStyleTagCacheQueued) return

  clearStyleTagCacheQueued = true
  queueMicrotask(() => {
    styleTagCache.clear()
    clearStyleTagCacheQueued = false
  })
}

function getCachedStyleTag(styleObject: StyleObject) {
  const identifier = styleObject[StyleObjectIdentifier]
  const rules = styleObject[StyleObjectRules]
  const cached = styleTagCache.get(identifier)

  if (
    cached &&
    cached.len === rules.length &&
    cached.first === rules[0] &&
    cached.last === rules[rules.length - 1]
  ) {
    return cached.element
  }

  const element = (
    <style
      key={identifier}
      // @ts-ignore
      href={`t_${identifier}`}
      // @ts-ignore
      precedence="default"
      // we remove after first render in favor of inserting to a global stylesheet (faster)
      suppressHydrationWarning
    >
      {rules.join('\n')}
    </style>
  )

  styleTagCache.set(identifier, {
    element,
    len: rules.length,
    first: rules[0],
    last: rules[rules.length - 1],
  })

  return element
}

export function getStyleTags(styles: StyleObject[]) {
  if (process.env.TAMAGUI_TARGET !== 'native') {
    if (styles.length) {
      queueStyleTagCacheClear()
      return <>{styles.map(getCachedStyleTag)}</>
    }
  }
}
