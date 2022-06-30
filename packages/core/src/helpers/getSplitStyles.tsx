import { stylePropsText, stylePropsTransform, validPseudoKeys, validStyles } from '@tamagui/helpers'
// @ts-ignore
import { useInsertionEffect } from 'react'
import { ViewStyle } from 'react-native'

import { getConfig } from '../conf'
import { isClient, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { mediaQueryConfig, mediaState } from '../hooks/useMedia'
import {
  DebugProp,
  MediaKeys,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  SplitStyleState,
  StackProps,
  StaticConfigParsed,
  TamaguiInternalConfig,
  ThemeObject,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixNativeShadow } from './fixNativeShadow'
import { getAtomicStyle, getStylesAtomic } from './getStylesAtomic'
import {
  insertStyleRule,
  insertedTransforms,
  updateInserted,
  updateInsertedCache,
} from './insertStyleRule'
import { mergeTransform } from './mergeTransform'
import { pseudoDescriptors } from './pseudoDescriptors'

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
    boxSizing: true,
    boxShadow: true,
  }),
}

type TransformNamespaceKey = 'transform' | PseudoPropKeys | MediaQueryKey

let conf: TamaguiInternalConfig

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  state: SplitStyleState & {
    keepVariantsAsProps?: boolean
    hasTextAncestor?: boolean
  },
  defaultClassNames?: any,
  debug?: DebugProp
) => {
  pseudos: PseudoStyles
  medias: Record<MediaKeys, ViewStyle>
  style: ViewStyle
  classNames: ClassNamesObject
  rulesToInsert: [string, string][] | null
  viewProps: StackProps
}

export const PROP_SPLIT = '-'

// this is how compiler outputs psueodo identifier
// TODO remove in next refactor
export const pseudoCNInverse = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
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
  defaultClassNames,
  debug
) => {
  conf = conf || getConfig()
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const pseudos: PseudoStyles = {}
  const medias: Record<MediaKeys, ViewStyle> = {}
  const usedKeys = new Set<string>()

  let style: ViewStyle = {}
  if (state.hasTextAncestor) {
    // parity with react-native-web
    style.display = 'inline-flex' as any
  }
  let classNames: ClassNamesObject = {}
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  let transforms = null as Record<TransformNamespaceKey, [string, string]> | null

  let rulesToInsert: [string, string][] | null = null
  function addStyle(prop: string, rule: string) {
    if (process.env.IS_STATIC === 'is_static' || updateInsertedCache(prop, rule)) {
      rulesToInsert = rulesToInsert || []
      rulesToInsert.push([prop, rule])
    }
  }

  function mergeClassName(key: string, val: string, isMediaOrPseudo = false) {
    // empty classnames passed by compiler sometimes
    if (!val) return
    if (val.startsWith('_transform-')) {
      const namespace: TransformNamespaceKey = isMediaOrPseudo ? key : 'transform'

      let transform = insertedTransforms[val]
      if (isClient) {
        if (!transform) {
          // HMR or loaded a new chunk
          updateInserted()
          transform = insertedTransforms[val]
          if (process.env.NODE_ENV === 'development') {
            if (!transform) {
              console.warn('no transform, error', { insertedTransforms, val })
            }
          }
        }
        if (!transform) {
          if (isWeb && val[0] !== '_') {
            // runtime insert
            transform = val
          }
        }
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // prettier-ignore
          console.log('  » getSplitStyles mergeClassName transform', { key, val, namespace, transform, insertedTransforms })
        }
        // debugger
      }
      transforms = transforms || {}
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
  const shouldDoClasses = (isWeb || process.env.IS_STATIC === 'is_static') && !state.noClassNames

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.log('propKeys', propKeys)
  }

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
      if (!valInit) continue
      for (const cn of valInit.split(' ')) {
        if (cn[0] === '_') {
          // tamagui, merge it expanded on key, eventually this will go away with better compiler
          const [shorthand, mediaOrPseudo] = cn.slice(1).split('-')
          const isMedia = mediaOrPseudo[0] === '_'
          const isPseudo = mediaOrPseudo[0] === '0'
          const isMediaOrPseudo = isMedia || isPseudo
          let fullKey = conf.shorthands[shorthand]
          if (isMedia) {
            // is media
            let mediaShortKey = mediaOrPseudo.slice(1)
            mediaShortKey = mediaShortKey.slice(0, mediaShortKey.indexOf('_'))
            fullKey += `${PROP_SPLIT}${mediaShortKey}`
          } else if (isPseudo) {
            // is pseudo
            const pseudoShortKey = mediaOrPseudo.slice(1)
            fullKey += `${PROP_SPLIT}${pseudoShortKey}`
          }
          usedKeys.add(fullKey)
          mergeClassName(fullKey, cn, isMediaOrPseudo)
        } else {
          nonTamaguis += ' ' + cn
        }
      }
      if (nonTamaguis) {
        usedKeys.add(keyInit)
        mergeClassName(keyInit, nonTamaguis)
      }
      continue
    }

    if (valInit && valInit[0] === '_') {
      // if valid style key (or pseudo like color-hover):
      // this conditional and esp the pseudo check rarely runs so not a perf issue
      const isValidClassName = validStyles[keyInit]
      const isMediaOrPseudo =
        !isValidClassName &&
        keyInit.includes(PROP_SPLIT) &&
        validStyles[keyInit.split(PROP_SPLIT)[0]]
      if (isValidClassName || isMediaOrPseudo) {
        usedKeys.add(keyInit)
        mergeClassName(keyInit, valInit, isMediaOrPseudo)
        continue
      }
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
        : staticConfig.propMapper(keyInit, valInit, theme, props, state, undefined, debug)

    let isMediaOrPseudo = isMedia || isPseudo

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.log('  » getSplitStyles', keyInit, expanded)
    }

    if (!expanded) {
      continue
    }

    for (const [key, val] of expanded) {
      if (val === undefined) continue

      isMedia = key[0] === '$'
      isPseudo = validPseudoKeys[key]
      isMediaOrPseudo = isMedia || isPseudo

      if (!isMediaOrPseudo) {
        if (usedKeys.has(key)) continue
      }

      if (
        (staticConfig.deoptProps && staticConfig.deoptProps.has(key)) ||
        (staticConfig.inlineProps && staticConfig.inlineProps.has(key))
      ) {
        usedKeys.add(key)
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
        if (shouldDoClasses) {
          const pseudoStyles = getAtomicStyle(pseudos[key], pseudoDescriptors[key])
          for (const style of pseudoStyles) {
            const postfix = pseudoDescriptors[key]?.name || key // exitStyle/enterStyle dont have pseudoDescriptors
            const fullKey = `${style.property}${PROP_SPLIT}${postfix}`
            if (!usedKeys.has(fullKey)) {
              usedKeys.add(fullKey)
              addStyle(style.identifier, style.rules.join(';'))
              mergeClassName(fullKey, style.identifier, isMediaOrPseudo)
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
          if (!usedKeys.has(key)) {
            // this isn't a media key, pass through
            viewProps[key] = val
          }
          continue
        }

        // dont check if media is active, we just apply *all* media styles
        // we combine the media props on top regular props, could proxy this
        // TODO test proxy here instead of merge
        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
        const mediaStyle = getSubStyle(val, staticConfig, theme, props, state)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // prettier-ignore
          console.log('  » getSplitStyles mediaStyle', { mediaKey, mediaStyle, props, shouldDoClasses })
        }

        if (shouldDoClasses) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig)
            // TODO handle pseudo + media, not too hard just need to set up example case
            const fullKey = `${style.property}${PROP_SPLIT}${mediaKeyShort}`
            if (!usedKeys.has(fullKey)) {
              usedKeys.add(fullKey)
              addStyle(out.identifier, out.styleRule)
              mergeClassName(fullKey, out.identifier, true)
            }
          }
        } else {
          if (mediaState[mediaKey]) {
            if (process.env.NODE_ENV === 'development' && debug) {
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
        } else if (key in stylePropsTransform) {
          mergeTransform(style, key, val, true)
        } else {
          style[key] = val
        }
        continue
      }

      // pass to view props
      if (!staticConfig.variants || !(key in staticConfig.variants)) {
        if (!skipProps[key]) {
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

  if (shouldDoClasses) {
    const atomic = getStylesAtomic(style)
    for (const atomicStyle of atomic) {
      const key = atomicStyle.property
      if (!state.dynamicStylesInline) {
        addStyle(atomicStyle.identifier, atomicStyle.rules.join(';'))
        mergeClassName(key, atomicStyle.identifier)
      } else {
        style[key] = atomicStyle.value
      }
    }
  }

  if (transforms) {
    for (const namespace in transforms) {
      if (!transforms[namespace]) {
        console.warn('Error no transform')
        continue
      }
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

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (typeof document !== 'undefined') {
      // prettier-ignore
      console.log('  » getSplitStyles out', { style, pseudos, medias, classNames, viewProps, state })
    }
  }

  // @ts-ignore
  if (viewProps['direction'] === 'both') {
    console.warn('???????', viewProps, props)
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
  if (res.rulesToInsert) {
    for (const [prop, rule] of res.rulesToInsert) {
      insertStyleRule(prop, rule)
    }
  }
  return res
}

const effect = isWeb ? useInsertionEffect || useIsomorphicLayoutEffect : useIsomorphicLayoutEffect

export const useSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)
  effect(() => {
    if (!res.rulesToInsert) return
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
