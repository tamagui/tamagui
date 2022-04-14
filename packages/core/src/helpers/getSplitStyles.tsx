import {
  mergeTransform,
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
import { ViewStyleWithPseudos, getStylesAtomic } from './getStylesAtomic'
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

export const getSplitStyles = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject,
  state: Partial<ComponentState> & {
    noClassNames?: boolean
    resolveVariablesAs?: ResolveVariableTypes
  },
  defaultClassNames?: ClassNamesObject | null
) => {
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: StackProps = {}
  const style: ViewStyle = {}
  const classNames: ClassNamesObject = {
    ...defaultClassNames,
  }
  const pseudos: PseudoStyles = {}
  const medias: Record<MediaKeys, ViewStyle> = {}
  let cur: ViewStyleWithPseudos | null = null

  function push() {
    if (!cur) return
    normalizeStyleObject(cur)
    if (isWeb) {
      const atomic = getStylesAtomic(cur)
      for (const atomicStyle of atomic) {
        if (atomicStyle.property === 'transform' && classNames.transform) {
          console.log('TODO figure out merging transforms..........')
        }
        if (!state.noClassNames) {
          classNames[atomicStyle.property] = atomicStyle.identifier
          insertStyleRule(atomicStyle.identifier, atomicStyle.rules[0])
        } else {
          style[atomicStyle.property] = atomicStyle.value
        }
      }
    } else {
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
    // be sure to sync next few lines below to getSubStyle (*1)
    const valInit = props[keyInit]

    if (skipKeys[keyInit]) {
      viewProps[keyInit] = valInit
      continue
    }

    if (
      // isPropClassName
      keyInit === 'className' ||
      // isExtractedClassName
      (valInit && valInit[0] === '_')
    ) {
      if (keyInit === 'className' || validStyleProps[keyInit]) {
        push()
        classNames[keyInit] = valInit
        if (cur) {
          delete cur[keyInit]
        }
        continue
      } else {
        // target="_blank" etc
      }
    }

    let isMedia = keyInit[0] === '$'
    let isPseudo = validPseudoKeys[keyInit]

    const out =
      isMedia || isPseudo
        ? true
        : staticConfig.propMapper(
            keyInit,
            valInit,
            theme,
            props,
            staticConfig,
            state.resolveVariablesAs
          )

    const expanded = out === true || !out ? [[keyInit, valInit]] : Object.entries(out)

    for (const [key, val] of expanded) {
      if (val === undefined) {
        continue
      }

      if (val[0] === '_') {
        classNames[key] = val
        continue
      }

      isMedia = key[0] === '$'
      isPseudo = validPseudoKeys[key]

      if (
        (staticConfig.deoptProps && staticConfig.deoptProps.has(key)) ||
        (staticConfig.inlineProps && staticConfig.inlineProps.has(key))
      ) {
        viewProps[key] = val
        // continue (?)
      }

      // pseudo
      if (isPseudo) {
        if (!val) continue
        if (key === 'enterStyle' && state.mounted) {
          // once mounted we can ignore enterStyle
          continue
        }
        pseudos[key] = pseudos[key] || {}
        if (state.noClassNames) {
          pseudos[key] = val
        } else {
          const pseudoStyles = getStylesAtomic({ [key]: val })
          for (const style of pseudoStyles) {
            classNames[`${style.property}-${key}`] = style.identifier
            insertStyleRule(style.identifier, style.rules[0])
          }
        }
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
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKey, mediaQueryConfig)
            classNames[`${out.identifier}-${mediaKey}`] = out.identifier
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
        console.log('what is', 'media', mediaState, key)
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
  normalizeStyleObject(styleOut)
  return styleOut
}
