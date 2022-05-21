import {
  mergeTransform,
  stylePropsText,
  stylePropsTransform,
  validPseudoKeys,
  validStyles,
} from '@tamagui/helpers'
// @ts-ignore
import { useInsertionEffect } from 'react'
import { ViewStyle } from 'react-native'

import { getConfig } from '../conf'
import { isClient, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { mediaQueryConfig, mediaState } from '../hooks/useMedia'
import {
  MediaKeys,
  MediaQueryKey,
  PseudoStyles,
  PsuedoPropKeys,
  SplitStyleState,
  StackProps,
  StaticConfigParsed,
  TamaguiInternalConfig,
  ThemeObject,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixNativeShadow } from './fixNativeShadow'
import { ViewStyleWithPseudos, getStylesAtomic } from './getStylesAtomic'
import {
  insertStyleRule,
  insertedTransforms,
  updateInserted,
  updateInsertedCache,
} from './insertStyleRule'

export type SplitStyles = ReturnType<typeof getSplitStyles>
export type ClassNamesObject = Record<string, string>
export type SplitStyleResult = ReturnType<typeof getSplitStyles>

const skipProps = {
  animation: true,
  animateOnly: true,
  debug: true,

  ...(!isWeb && {
    tag: true,
    whiteSpace: true,
    wordWrap: true,
    textOverflow: true,
    textDecorationDistance: true,
    userSelect: true,
    selectable: true,
    cursor: true,
    contain: true,
    pointerEvents: true,
    boxSizing: true,
    boxShadow: true,
  }),
}

type TransformNamespaceKey = 'transform' | PsuedoPropKeys | MediaQueryKey

// TODO can make a few of these objects lazy if profiling seems slow

let conf: TamaguiInternalConfig

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  state: SplitStyleState & {
    keepVariantsAsProps?: boolean
  },
  defaultClassNames?: any
) => {
  pseudos: PseudoStyles
  medias: Record<MediaKeys, ViewStyle>
  style: ViewStyle
  classNames: ClassNamesObject
  rulesToInsert: [string, string][]
  viewProps: StackProps
}

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  state,
  defaultClassNames
) => {
  if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
    console.log('  » getSplitStyles', { props, state, defaultClassNames })
  }

  conf = conf || getConfig()
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const style: ViewStyle = {}
  const classNames: ClassNamesObject = {
    ...defaultClassNames,
  }
  const pseudos: PseudoStyles = {}
  const medias: Record<MediaKeys, ViewStyle> = {}

  const rulesToInsert: [string, string][] = []
  function addStyle(prop: string, rule: string) {
    rulesToInsert.push([prop, rule])
    updateInsertedCache(prop, rule)
  }

  let cur: ViewStyleWithPseudos | null = null

  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  let transforms: Record<TransformNamespaceKey, [string, string]> = {}

  function mergeClassName(key: string, val: string) {
    if (!val) {
      // empty classnames passed by compiler sometimes
      return
    }
    if (val.startsWith('_transform-')) {
      const isMediaOrPseudo = key !== 'transform'
      const isMedia = isMediaOrPseudo && key[11] === '_'
      const isPsuedo = (isMediaOrPseudo && key[11] === '0') || key.endsWith('Style')
      const namespace: TransformNamespaceKey = isMedia
        ? key.split('_')[2]
        : isPsuedo
        ? key.split('-')[1]
        : 'transform'

      let transform = insertedTransforms[val]
      if (isClient) {
        if (!transform) {
          // HMR or loaded a new chunk
          updateInserted()
          transform = insertedTransforms[val]
        }
        if (!transform) {
          if (isWeb && val[0] !== '_') {
            // runtime insert
            transform = val
          } else {
            // error
            console.trace('?', key, val, cur, props, state)
          }
        }
        if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
          // prettier-ignore
          console.log('  » getSplitStyles mergeClassName transform', { key, val, namespace, transform, insertedTransforms })
        }
        if (process.env.NODE_ENV === 'development') {
          if (!transform) {
            console.trace('NO TRANSFORM?', { key, val, transform })
          }
        }
      }
      transforms[namespace] = transforms[namespace] || ['', '']
      const identifier = val.replace('_transform', '')
      transforms[namespace][0] += identifier
      // ssr doesn't need to do anything just make the right classname
      if (transform) {
        transforms[namespace][1] += transform
      }
    } else {
      classNames[key] = val
    }
  }

  function push() {
    if (!cur) return
    normalizeStyleObject(cur)

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
      console.log('  » getSplitStyles push', cur, state)
    }

    if (isWeb && !state.noClassNames) {
      const atomic = getStylesAtomic(cur)
      for (const atomicStyle of atomic) {
        if (!state.dynamicStylesInline) {
          addStyle(atomicStyle.identifier, atomicStyle.rules[0])
          mergeClassName(atomicStyle.property, atomicStyle.identifier)
        } else {
          console.log('inline', atomicStyle.property, atomicStyle.property)
          style[atomicStyle.property] = atomicStyle.value
        }
      }
    }

    if (
      !isWeb ||
      state.noClassNames ||
      state.resolveVariablesAs === 'value' ||
      state.resolveVariablesAs === 'both'
    ) {
      for (const key in cur) {
        if (skipProps[key]) {
          continue
        }
        if (key in stylePropsTransform) {
          mergeTransform(style, key, cur[key])
        } else {
          style[key] = cur[key]
        }
      }
    }

    // reset it for next group of styles
    cur = null
  }

  for (const keyInit in props) {
    if (skipProps[keyInit]) {
      continue
    }
    if (!isWeb && keyInit.startsWith('data-')) {
      continue
    }

    const valInit = props[keyInit]

    // TODO
    if (keyInit === 'style' || keyInit.startsWith('_style')) {
      push()
      cur = valInit
      push()
      continue
    }

    if (keyInit === 'className' || (validStyleProps[keyInit] && valInit && valInit[0] === '_')) {
      push()
      mergeClassName(keyInit, valInit)
      continue
    }

    if (
      state.keepVariantsAsProps &&
      staticConfig.defaultVariants &&
      keyInit in staticConfig.defaultVariants
    ) {
      viewProps[keyInit] = valInit
    }

    let isMedia = keyInit[0] === '$'
    let isPseudo = validPseudoKeys[keyInit]

    if (
      !isMedia &&
      !isPseudo &&
      !staticConfig.variants?.[keyInit] &&
      !validStyleProps[keyInit] &&
      !conf.shorthands[keyInit]
    ) {
      viewProps[keyInit] = valInit
      continue
    }

    const out =
      isMedia || isPseudo
        ? true
        : staticConfig.propMapper(
            keyInit,
            valInit,
            theme,
            state.fallbackProps || props,
            state.resolveVariablesAs
          )

    const expanded = out === true || !out ? [[keyInit, valInit]] : Object.entries(out)

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
      console.log('  » getSplitStyles', keyInit, expanded)
    }

    for (const [key, val] of expanded) {
      if (val === undefined) {
        continue
      }

      if (key !== 'target' && val && val[0] === '_') {
        mergeClassName(key, val)
        continue
      }

      isMedia = key[0] === '$'
      isPseudo = validPseudoKeys[key]

      if (
        (staticConfig.deoptProps && staticConfig.deoptProps.has(key)) ||
        (staticConfig.inlineProps && staticConfig.inlineProps.has(key))
      ) {
        viewProps[key] = val
      }

      // pseudo
      if (isPseudo) {
        if (!val) continue
        if (key === 'enterStyle' && state.mounted) {
          // once mounted we can ignore enterStyle
          continue
        }
        pseudos[key] = pseudos[key] || {}
        pseudos[key] = getSubStyle(val, staticConfig, theme, props, state, true)
        if (isWeb && !state.noClassNames) {
          const pseudoStyles = getStylesAtomic({ [key]: pseudos[key] })
          for (const style of pseudoStyles) {
            addStyle(style.identifier, style.rules[0])
            mergeClassName(`${style.property}-${key}`, style.identifier)
          }
        }
        continue
      }

      // media
      if (isMedia) {
        const mediaKey = key
        const mediaKeyShort = mediaKey.slice(1)

        if (!mediaQueryConfig[mediaKeyShort]) {
          // this isn't a media key, pass through
          viewProps[key] = val
          continue
        }

        // dont check if media is active, we just apply *all* media styles
        // we combine the media props on top regular props, could proxy this
        // TODO test proxy here instead of merge
        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
        const mediaStyle = getSubStyle(val, staticConfig, theme, props, state)

        if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
          console.log('  » getSplitStyles mediaStyle', mediaKey, mediaStyle, props)
        }

        const shouldDoClasses = isWeb && !state.noClassNames
        if (shouldDoClasses) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig)
            addStyle(out.identifier, out.styleRule)
            mergeClassName(`${out.identifier}-${mediaKey}`, out.identifier)
          }
        } else {
          if (mediaState[mediaKey]) {
            push()
            if (process.env.NODE_ENV === 'development' && props['debug']) {
              console.log('apply media style', mediaKey, mediaState)
            }
            Object.assign(shouldDoClasses ? medias : style, mediaStyle)
          }
        }
        continue
      }

      if (!isWeb && key === 'pointerEvents') {
        viewProps[key] = val
        continue
      }

      if (validStyleProps[key]) {
        cur = cur || {}
        cur[key] = val
        continue
      }

      // pass to view props
      if (!staticConfig.variants || !(key in staticConfig.variants)) {
        if (!skipProps[key]) {
          push()
          viewProps[key] = val
        }
      }
    }
  }

  push()

  if (transforms) {
    for (const namespace in transforms) {
      const [hash, val] = transforms[namespace]
      const identifier = `_transform${hash}`
      if (isClient) {
        if (!insertedTransforms[identifier]) {
          const rule = `.${identifier} { transform: ${val}; }`
          addStyle(identifier, rule)
        }
      }
      classNames[namespace] = identifier
    }
  }

  if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
    console.log('  » getSplitStyles out', { style, pseudos, medias, classNames, viewProps, state })
  }

  return {
    viewProps,
    style,
    medias,
    pseudos,
    classNames,
    rulesToInsert,
  }
}

export const insertSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)
  for (const [prop, rule] of res.rulesToInsert) {
    insertStyleRule(prop, rule)
  }
  return res
}

const effect = useInsertionEffect || useIsomorphicLayoutEffect
export const useSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)
  effect(() => {
    for (const [prop, rule] of res.rulesToInsert) {
      insertStyleRule(prop, rule)
    }
  })
  return res
}

export const getSubStyle = (
  styleIn: Object,
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  props: any,
  state: SplitStyleState,
  avoidDefaultProps?: boolean
): ViewStyle => {
  const styleOut: ViewStyle = {}
  for (const key in styleIn) {
    const val = styleIn[key]
    const out = staticConfig.propMapper(
      key,
      val,
      theme,
      state.fallbackProps || props,
      state.resolveVariablesAs,
      avoidDefaultProps
    )
    const expanded = out === true || !out ? [[key, val]] : Object.entries(out)
    for (const [skey, sval] of expanded) {
      if (skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = sval
      }
    }
  }
  normalizeStyleObject(styleOut)
  return styleOut
}

export function normalizeStyleObject(style: any) {
  if (!isWeb) {
    fixNativeShadow(style)
  }
}
