import {
  addRule,
  stylePropsText,
  stylePropsTransform,
  validPseudoKeys,
  validStyles,
} from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { isWeb } from '../constants/platform'
import { ComponentState } from '../defaultComponentState'
import { mediaQueryConfig, mediaState } from '../hooks/useMedia'
import { MediaKeys, StackProps, StaticConfigParsed, ThemeObject } from '../types'
import { createMediaStyle } from './createMediaStyle'
import { ResolveVariableTypes } from './createPropMapper'
import { fixNativeShadow } from './fixNativeShadow'
import { getStylesAtomic } from './getStylesAtomic'
import { insertStyleRule } from './insertStyleRule'

export type SplitStyles = ReturnType<typeof getSplitStyles>

const skipKeys = {
  // could put events in here
  animation: true,
  animated: true,
  children: true,
  key: true,
  ref: true,
}

export type PseudoStyles = {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
  enterStyle?: ViewStyle
  exitStyle?: ViewStyle
}

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

export const getSplitStyles = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  state: Partial<ComponentState>,
  resolveVariablesAs?: ResolveVariableTypes
) => {
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const style: ViewStyle = {}

  let cur: ViewStyle | null = null
  let classNames: string[] | null = null
  const pseudos: PseudoStyles = {}

  const medias: {
    [key in MediaKeys]: ViewStyle
  } = {}

  for (const keyInit in props) {
    // be sure to sync next few lines below to getSubStyle (*1)
    const valInit = props[keyInit]

    if (skipKeys[keyInit]) {
      viewProps[keyInit] = valInit
      continue
    }

    let isMedia = keyInit[0] === '$'
    let isPseudo = validPseudoKeys[keyInit]

    const out =
      isMedia || isPseudo
        ? true
        : staticConfig.propMapper(keyInit, valInit, theme, props, staticConfig, resolveVariablesAs)

    const expanded = out === true || !out ? [[keyInit, valInit]] : Object.entries(out)

    for (const [key, val] of expanded) {
      if (val === undefined) {
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
        const out = getSubStyle(val, staticConfig, theme, props)
        Object.assign(pseudos[key], out)

        // Object.assign(style, out)
        continue
      }

      // media
      if (isMedia) {
        const mediaKey = key.slice(1)

        if (!mediaQueryConfig[mediaKey]) {
          // this isn't a media key, pass through
          viewProps[key] = valInit
          continue
        }

        // dont check if media is active, we just apply *all* media styles
        // we combine the media props on top regular props, could proxy this
        // TODO test proxy here instead of merge
        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
        const mediaStyle = getSubStyle(valInit, staticConfig, theme, valInit, undefined, true)

        if (isWeb) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          if (process.env.NODE_ENV === 'development') {
            if (props['debug'])
              console.log('mediaStyles', key, mediaStyles, { valInit, mediaStyle })
          }
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKey, mediaQueryConfig)
            classNames = classNames || []
            classNames.push(out.identifier)
            addRule(out.styleRule)
            insertStyleRule(out.identifier, out.styleRule)
          }
          if (mediaState[mediaKey]) {
            Object.assign(medias, mediaStyle)
          }
        } else {
          if (mediaState[mediaKey]) {
            // TODO i think media + pseudo needs handling here
            Object.assign(style, mediaStyle)
          }
        }
        continue
      }

      if (key === 'style' || key.startsWith('_style')) {
        if (cur) {
          // process last
          fixNativeShadow(cur)
          Object.assign(style, cur)
          cur = null
        }
        fixNativeShadow(val)
        Object.assign(style, val)
        continue
      }
      // expand flex so it merged with flexShrink etc properly
      // TODO this shouldn't be here...
      if (key === 'flex') {
        cur = cur || {}
        // see spec for flex shorthand https://developer.mozilla.org/en-US/docs/Web/CSS/flex
        // TODO this fixed a behavior but need to find / document / test
        Object.assign(cur, {
          flexGrow: val,
          flexShrink: 1,
        })
        continue
      }
      if (!isWeb && key === 'pointerEvents') {
        viewProps[key] = val
        continue
      }
      if (validStyleProps[key]) {
        // transforms
        if (key in stylePropsTransform) {
          cur = cur || {}
          mergeTransform(cur, key, val)
          continue
        }
        cur = cur || {}
        cur[key] = val
        continue
      }

      // pass to view props
      if (!staticConfig.variants || !(key in staticConfig.variants)) {
        if (key !== 'animation' && key !== 'debug') {
          viewProps[key] = val
        }
      }
    }
  }

  // push last style
  if (cur) {
    fixNativeShadow(cur)
    Object.assign(style, cur)
  }

  return {
    viewProps,
    style,
    medias,
    pseudos,
    classNames,
  }
}

const getSubStyle = (
  styleIn: Object,
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  props: any,
  resolveVariablesAs?: ResolveVariableTypes,
  avoidDefaultProps?: boolean
): ViewStyle => {
  const styleOut: ViewStyle = {}
  for (const key in styleIn) {
    // be sure to sync next few lines below to loop above (*1)
    const val = styleIn[key]
    const out = staticConfig.propMapper(
      key,
      val,
      theme,
      props,
      staticConfig,
      resolveVariablesAs,
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
  fixNativeShadow(styleOut)
  return styleOut
}

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const mergeTransform = (obj: ViewStyle, key: string, val: any) => {
  const transform: any[] = obj.transform
    ? Array.isArray(obj.transform)
      ? obj.transform
      : [obj.transform]
    : []
  transform.push({ [mapTransformKeys[key] || key]: val })
  obj.transform = transform
}
