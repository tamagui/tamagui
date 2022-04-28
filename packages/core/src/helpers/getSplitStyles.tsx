import {
  mergeTransform,
  stylePropsText,
  stylePropsTransform,
  validPseudoKeys,
  validStyles,
} from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
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
import { insertStyleRule, insertedTransforms, updateInserted } from './insertStyleRule'

export type SplitStyles = ReturnType<typeof getSplitStyles>

const skipKeys = {
  // could put events in here
  animation: true,
  animated: true,
  children: true,
  key: true,
  ref: true,
}

export type ClassNamesObject = Record<string, string>

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

function normalizeStyleObject(style: any) {
  // fix flex to match web
  // see spec for flex shorthand https://developer.mozilla.org/en-US/docs/Web/CSS/flex
  if (typeof style.flex === 'number') {
    const val = style.flex
    delete style.flex
    style.flexGrow = style.flexGrow ?? val
    style.flexShrink = style.flexShrink ?? 1
  }

  if (!isWeb) {
    fixNativeShadow(style)
  }
}

type TransformNamespaceKey = 'transform' | PsuedoPropKeys | MediaQueryKey

// TODO can make a few of these objects lazy if profiling seems slow

let conf: TamaguiInternalConfig

export const getSplitStyles = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  state: SplitStyleState,
  defaultClassNames?: ClassNamesObject | null
) => {
  conf = conf || getConfig()
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const style: ViewStyle = {}
  const classNames: ClassNamesObject = {
    ...defaultClassNames,
  }
  const pseudos: PseudoStyles = {}
  const medias: Record<MediaKeys, ViewStyle> = {}
  let cur: ViewStyleWithPseudos | null = null

  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  let transforms: Record<TransformNamespaceKey, [string, string]> = {}

  function mergeClassName(key: string, val: string) {
    if (!val) return
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
      if (!transform) {
        // HMR or loaded a new chunk
        updateInserted()
      }
      transform = insertedTransforms[val]
      if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
        // prettier-ignore
        console.log('mergeClassName transform', { key, val, namespace, transform, insertedTransforms })
      }
      if (!transform || transform === 'undefined') {
        console.log('NO TRANSFORM', { key, val, transform })
        return
      }
      transforms[namespace] = transforms[namespace] || ['', '']
      transforms[namespace][0] += val.replace('_transform', '')
      transforms[namespace][1] += transform
    } else {
      classNames[key] = val
    }
  }

  function push() {
    if (!cur) return
    normalizeStyleObject(cur)

    if (isWeb && !state.noClassNames) {
      const atomic = getStylesAtomic(cur)
      for (const atomicStyle of atomic) {
        if (!state.noClassNames) {
          mergeClassName(atomicStyle.property, atomicStyle.identifier)
          insertStyleRule(atomicStyle.identifier, atomicStyle.rules[0])
        } else {
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
    const valInit = props[keyInit]

    let isMedia = keyInit[0] === '$'
    let isPseudo = validPseudoKeys[keyInit]

    if (
      // isPropClassName
      keyInit === 'className' ||
      // isExtractedClassName
      (validStyleProps[keyInit] && valInit && valInit[0] === '_')
    ) {
      push()
      mergeClassName(keyInit, valInit)
      if (cur) {
        if (cur[keyInit]) console.warn('just want to see how used')
        delete cur[keyInit]
      }
      continue
    }

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
      console.log('split style', keyInit, expanded)
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
            mergeClassName(`${style.property}-${key}`, style.identifier)
            insertStyleRule(style.identifier, style.rules[0])
          }
        }
        continue
      }

      // media
      if (isMedia) {
        const mediaKey = key

        if (!mediaQueryConfig[mediaKey.slice(1)]) {
          // this isn't a media key, pass through
          viewProps[key] = val
          continue
        }

        // dont check if media is active, we just apply *all* media styles
        // we combine the media props on top regular props, could proxy this
        // TODO test proxy here instead of merge
        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
        const mediaStyle = getSubStyle(val, staticConfig, theme, props, state, true)

        const shouldDoClasses = isWeb && !state.noClassNames
        if (shouldDoClasses) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKey.slice(1), mediaQueryConfig)
            mergeClassName(`${out.identifier}-${mediaKey}`, out.identifier)
            insertStyleRule(out.identifier, out.styleRule)
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

      // TODO
      if (key === 'style' || key.startsWith('_style')) {
        push()
        Object.assign(style, val)
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
        if (key !== 'animation' && key !== 'debug') {
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
      if (!insertedTransforms[identifier]) {
        const rule = `.${identifier} { transform: ${val}; }`
        insertStyleRule(identifier, rule)
      }
      classNames[namespace] = identifier
    }
  }

  if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
    console.log('out', { style, pseudos, medias, classNames, viewProps })
  }

  return {
    viewProps,
    style,
    medias,
    pseudos,
    classNames,
  }
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
