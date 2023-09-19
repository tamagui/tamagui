/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp } from '../types'
import type { ViewProps, ViewStyle } from '../View/types'

type FontWeightValue =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
type NumberOrString = number | string

export type TextStyle = {
  color?: ColorValue | null
  fontFamily?: string | null
  fontFeatureSettings?: string | null
  fontSize?: NumberOrString | null
  fontStyle?: 'italic' | 'normal'
  fontWeight?: FontWeightValue | null
  fontVariant?: ReadonlyArray<
    'small-caps' | 'oldstyle-nums' | 'lining-nums' | 'tabular-nums' | 'proportional-nums'
  >
  letterSpacing?: NumberOrString | null
  lineHeight?: NumberOrString | null
  textAlign?:
    | 'center'
    | 'end'
    | 'inherit'
    | 'justify'
    | 'justify-all'
    | 'left'
    | 'right'
    | 'start'
  textAlignVertical?: string | null
  textDecorationColor?: ColorValue | null
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through'
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed'
  textIndent?: NumberOrString | null
  textOverflow?: string | null
  textRendering?: 'auto' | 'geometricPrecision' | 'optimizeLegibility' | 'optimizeSpeed'
  textShadowColor?: ColorValue | null
  textShadowOffset?: {
    width?: number
    height?: number
  }
  textShadowRadius?: number | null
  textTransform?: 'capitalize' | 'lowercase' | 'none' | 'uppercase'
  unicodeBidi?:
    | 'normal'
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'plaintext'
  whiteSpace?: string | null
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all'
  wordWrap?: string | null
  writingDirection?: 'auto' | 'ltr' | 'rtl'
  /* @platform web */
  MozOsxFontSmoothing?: string | null
  WebkitFontSmoothing?: string | null
} & ViewStyle

export type TextProps = {
  accessibilityRole?:
    | 'button'
    | 'header'
    | 'heading'
    | 'label'
    | 'link'
    | 'listitem'
    | 'none'
    | 'text'
  dir?: 'auto' | 'ltr' | 'rtl'
  lang?: string
  numberOfLines?: number | null
  onPress?: (e: any) => void
  selectable?: boolean
  style?: GenericStyleProp<TextStyle>
  testID?: string | null
} & ViewProps
