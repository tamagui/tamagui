import { stylePropsText, stylePropsTransform, validPseudoKeys, validStyles } from '@tamagui/helpers'
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
import { ViewStyleWithPseudos, getStylesAtomic, psuedoCNInverse } from './getStylesAtomic'
import {
  insertStyleRule,
  insertedTransforms,
  updateInserted,
  updateInsertedCache,
} from './insertStyleRule'
import { mergeTransform } from './mergeTransform'

export type SplitStyles = ReturnType<typeof getSplitStyles>
export type ClassNamesObject = Record<string, string>
export type SplitStyleResult = ReturnType<typeof getSplitStyles>

const skipProps = {
  animation: true,
  animateOnly: true,
  debug: true,
  componentName: true,

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

// loop props backwards
//   track used keys:
//     const keys = new Set<string>()
//   keep classnames and styles separate:
//     const styles = {}
//     const classNames = {}

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  state,
  defaultClassNames
) => {
  conf = conf || getConfig()
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const pseudos: PseudoStyles = {}
  const medias: Record<MediaKeys, ViewStyle> = {}

  let style: ViewStyle = {}
  let classNames: ClassNamesObject = {}

  const usedKeys = new Set<string>()

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
            if (process.env.NODE_ENV === 'development') {
              // error
              console.trace('?', key, val, cur, props, state)
            }
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

  const propKeys = Object.keys(props)

  for (let i = propKeys.length - 1; i >= 0; i--) {
    const keyInit = propKeys[i]

    if (usedKeys.has(keyInit)) continue
    if (skipProps[keyInit]) continue
    if (!isWeb && keyInit.startsWith('data-')) continue

    const valInit = props[keyInit]

    if (keyInit === 'style' || keyInit.startsWith('_style')) {
      if (!valInit) continue
      for (const key in valInit) {
        if (usedKeys.has(key)) continue
        if (valInit && typeof valInit === 'object') {
          // newer react native versions return a full object instead of ID
          for (const skey in valInit) {
            if (usedKeys.has(skey)) continue
            usedKeys.add(skey)
            style[skey] = valInit[skey]
          }
        } else {
          usedKeys.add(key)
          style[key] = valInit
        }
      }
      continue
    }

    if (keyInit === 'className') {
      let nonTamaguis = ''
      if (!valInit) {
        continue
      }
      for (const cn of valInit.split(' ')) {
        if (cn[0] === '_') {
          // tamagui, merge it expanded on key, eventually this will go away with better compiler
          const [shorthand, mediaOrPsuedo, rest] = cn.slice(1).split('-')
          let fullKey = conf.shorthands[shorthand]
          if (mediaOrPsuedo[0] === '_') {
            // is media
            let mediaShortKey = mediaOrPsuedo.slice(1)
            mediaShortKey = mediaShortKey.slice(0, mediaShortKey.indexOf('_'))
            fullKey += `-${mediaShortKey}`
          } else if (mediaOrPsuedo[0] === '0') {
            // is psuedo
            const pseudoShortKey = mediaOrPsuedo.slice(1)
            fullKey += `-${psuedoCNInverse[pseudoShortKey]}`
          }
          usedKeys.add(fullKey)
          mergeClassName(fullKey, cn)
        } else {
          nonTamaguis += ' ' + cn
        }
      }
      if (nonTamaguis) {
        mergeClassName(keyInit, nonTamaguis)
      }
      continue
    }

    if (validStyleProps[keyInit] && valInit && valInit[0] === '_') {
      usedKeys.add(keyInit)
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
      usedKeys.add(keyInit)
      viewProps[keyInit] = valInit
      continue
    }

    const expanded =
      isMedia || isPseudo
        ? [[keyInit, valInit]]
        : staticConfig.propMapper(keyInit, valInit, theme, props, state)

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
      console.log('  » getSplitStyles', keyInit, expanded)
    }

    if (!expanded) {
      continue
    }

    for (const [key, val] of expanded) {
      if (val === undefined) continue
      if (usedKeys.has(key)) continue

      if (key !== 'target' && val && val[0] === '_') {
        usedKeys.add(key)
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
            const fullKey = `${style.property}-${key}`
            if (!usedKeys.has(fullKey)) {
              usedKeys.add(fullKey)
              addStyle(style.identifier, style.rules[0])
              mergeClassName(fullKey, style.identifier)
            }
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
        const shouldDoClasses = isWeb && !state.noClassNames

        if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
          // prettier-ignore
          console.log('  » getSplitStyles mediaStyle', { mediaKey, mediaStyle, props, shouldDoClasses })
        }

        if (shouldDoClasses) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig)
            // TODO handle psuedo + media, not too hard just need to set up example case
            const fullKey = `${style.property}-${mediaKeyShort}`
            if (!usedKeys.has(fullKey)) {
              usedKeys.add(fullKey)
              addStyle(out.identifier, out.styleRule)
              mergeClassName(fullKey, out.identifier)
            }
          }
        } else {
          if (mediaState[mediaKey]) {
            // push()
            if (process.env.NODE_ENV === 'development' && props['debug']) {
              console.log('apply media style', mediaKey, mediaState)
            }
            Object.assign(shouldDoClasses ? medias : style, mediaStyle)
          }
        }
        continue
      }

      if (!isWeb && key === 'pointerEvents') {
        usedKeys.add(key)
        viewProps[key] = val
        continue
      }

      if (validStyleProps[key]) {
        usedKeys.add(key)
        if (val && val[0] === '_') {
          classNames[key] = val
        } else {
          // const avoidMergeTransform =
          //   !isWeb ||
          //   state.noClassNames ||
          //   state.resolveVariablesAs === 'value' ||
          //   state.resolveVariablesAs === 'both'
          if (key in stylePropsTransform) {
            mergeTransform(style, key, val, true)
          } else {
            style[key] = val
          }
        }

        continue
      }

      // pass to view props
      if (!staticConfig.variants || !(key in staticConfig.variants)) {
        if (!skipProps[key]) {
          // push()
          viewProps[key] = val
          usedKeys.add(key)
        }
      }
    }
  }

  // add in defaults if not set:
  if (defaultClassNames) {
    classNames = {
      ...defaultClassNames,
      ...classNames,
    }
  }

  if (isWeb && !state.noClassNames) {
    const atomic = getStylesAtomic(style)
    for (const atomicStyle of atomic) {
      const key = atomicStyle.property
      if (!state.dynamicStylesInline) {
        addStyle(atomicStyle.identifier, atomicStyle.rules[0])
        mergeClassName(key, atomicStyle.identifier)
      } else {
        style[key] = atomicStyle.value
      }
    }
  }

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
    if (typeof document !== 'undefined') {
      // prettier-ignore
      console.log('  » getSplitStyles out', { style, pseudos, medias, classNames, viewProps, state })
    }
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

const effect = isWeb ? useInsertionEffect || useIsomorphicLayoutEffect : useIsomorphicLayoutEffect

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
    const expanded = staticConfig.propMapper(key, val, theme, props, state, avoidDefaultProps)
    if (!expanded) continue
    for (const [skey, sval] of expanded) {
      if (skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = sval
      }
    }
  }
  return styleOut
}

export function normalizeStyleObject(style: any) {
  if (!isWeb) {
    fixNativeShadow(style)
  }
}
