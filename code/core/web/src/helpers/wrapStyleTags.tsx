import type { ReactNode } from 'react'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
import type { StyleObject } from '../types'
import { getConfigMaybe } from '../config'
import { isTailwindStyleMode, wrapWithTamaguiLayer } from './hybridStyle'

// turns out this is pretty slow, creating a bunch of extra tags...

const styleTagCache = new Map<
  string,
  {
    element: ReactNode
    len: number
    first: string | undefined
    last: string | undefined
    hybrid: boolean
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
  const hybrid = isTailwindStyleMode(getConfigMaybe())

  if (
    cached &&
    cached.len === rules.length &&
    cached.first === rules[0] &&
    cached.last === rules[rules.length - 1] &&
    cached.hybrid === hybrid
  ) {
    return cached.element
  }

  const css = rules.join('\n')
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
      {hybrid ? wrapWithTamaguiLayer(css) : css}
    </style>
  )

  styleTagCache.set(identifier, {
    element,
    len: rules.length,
    first: rules[0],
    last: rules[rules.length - 1],
    hybrid,
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
