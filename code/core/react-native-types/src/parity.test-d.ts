import type * as RN from 'react-native'
// bypass exports.types to check RN's legacy entry alongside the strict entry.
import type * as LegacyRN from '../../../../node_modules/react-native/types'
import type { Ref } from 'react'

import type * as Ours from './index'
import type * as LegacyOurs from './legacy'

/**
 * The drift alarm for `generated.ts`.
 *
 * The generated types are copied out of react-native's `.d.ts`, so they are
 * correct the day they are written and quietly wrong once react-native moves.
 * This file runs here, where react-native *is* installed, and compares the two
 * side by side. Bump the root `react-native` override without re-running
 * `bun run generate` and these go red.
 *
 * Keys are compared exactly, in both directions: a property react-native added
 * shows up as `missingFromOurs`, and one we kept after they dropped it shows up
 * as `staleInOurs`. Values are compared with the runtime-only forms stripped,
 * because those are exactly what the generator substitutes.
 */

type Assert<T extends true> = T

type SameKeys<Ours_, Theirs> = [keyof Ours_] extends [keyof Theirs]
  ? [keyof Theirs] extends [keyof Ours_]
    ? true
    : { missingFromOurs: Exclude<keyof Theirs, keyof Ours_> }
  : { staleInOurs: Exclude<keyof Ours_, keyof Theirs> }

/**
 * `AnimatedNode` is generated from the native declaration. The extracted and
 * native declarations are distinct symbols with the same structure.
 * Collapsing both to one marker keeps that out of every other comparison;
 * `_animatedNode` below checks the extracted declaration.
 *
 * The substitution sits at the leaves, inside `transform`'s entries and inside
 * `style`'s payload, so this rewrites the whole type rather than just its top
 * level. Arrays are rewritten element-wise rather than member-wise so that
 * `RecursiveArray`, which extends `Array` of itself, terminates; the depth
 * counter is the backstop for anything else that loops.
 *
 * Functions are rewritten through their return type only, which is where
 * `PressableProps.style` hides one. A parameter holding an `AnimatedNode` would
 * report drift it should not, but that fails loudly rather than passing
 * quietly, and none of the types below have one.
 */
type ErasedNode = { __erasedAnimatedNode: true }

type Prev = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8]

type Erased<T, D extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 9> = [D] extends [0]
  ? T
  : T extends RN.Animated.AnimatedNode
    ? ErasedNode
    : T extends Ours.AnimatedNode
      ? ErasedNode
      : T extends (...args: infer A) => infer R
        ? (...args: A) => Erased<R, Prev[D]>
        : T extends readonly (infer E)[]
          ? Erased<E, Prev[D]>[]
          : T extends object
            ? { [K in keyof T]: Erased<T[K], Prev[D]> }
            : T

type ValueGaps<Ours_, Theirs> = {
  [K in keyof Theirs]-?: Erased<Theirs[K]> extends Erased<Ours_[K & keyof Ours_]>
    ? never
    : K
}[keyof Theirs]

type SameValues<Ours_, Theirs> = [ValueGaps<Ours_, Theirs>] extends [never]
  ? true
  : { driftedProps: ValueGaps<Ours_, Theirs> }

//
// the prop types Tamagui's own props are declared against
//
export type _viewPropsKeys = Assert<SameKeys<Ours.ViewProps, RN.ViewProps>>
export type _viewPropsValues = Assert<SameValues<Ours.ViewProps, RN.ViewProps>>

export type _textPropsKeys = Assert<SameKeys<Ours.TextProps, RN.TextProps>>
export type _textPropsValues = Assert<SameValues<Ours.TextProps, RN.TextProps>>

export type _pressablePropsKeys = Assert<SameKeys<Ours.PressableProps, RN.PressableProps>>
export type _pressablePropsValues = Assert<
  SameValues<Ours.PressableProps, RN.PressableProps>
>

export type _imagePropsKeys = Assert<SameKeys<Ours.ImageProps, RN.ImageProps>>
export type _imagePropsValues = Assert<SameValues<Ours.ImageProps, RN.ImageProps>>

export type _switchPropsKeys = Assert<SameKeys<Ours.SwitchProps, RN.SwitchProps>>
export type _switchPropsValues = Assert<SameValues<Ours.SwitchProps, RN.SwitchProps>>

//
// the style grammar, where the substituted values actually live
//
export type _viewStyleKeys = Assert<SameKeys<Ours.ViewStyle, RN.ViewStyle>>
export type _viewStyleValues = Assert<SameValues<Ours.ViewStyle, RN.ViewStyle>>

export type _textStyleKeys = Assert<SameKeys<Ours.TextStyle, RN.TextStyle>>
export type _textStyleValues = Assert<SameValues<Ours.TextStyle, RN.TextStyle>>

export type _imageStyleKeys = Assert<SameKeys<Ours.ImageStyle, RN.ImageStyle>>
export type _imageStyleValues = Assert<SameValues<Ours.ImageStyle, RN.ImageStyle>>

/**
 * the wrapper `style` props are declared with, checked on a payload with no
 * `AnimatedNode` in it so this is about `StyleProp` itself
 */
export type _styleProp = Assert<
  Ours.StyleProp<{ a: number }> extends RN.StyleProp<{ a: number }>
    ? RN.StyleProp<{ a: number }> extends Ours.StyleProp<{ a: number }>
      ? true
      : false
    : false
>

//
// the event and measurement types handlers are typed with
//
export type _layoutChangeEvent = Assert<
  SameValues<Ours.LayoutChangeEvent, RN.LayoutChangeEvent>
>
export type _layoutRectangle = Assert<SameKeys<Ours.LayoutRectangle, RN.LayoutRectangle>>
export type _gestureResponderEvent = Assert<
  SameValues<Ours.GestureResponderEvent, RN.GestureResponderEvent>
>
export type _gestureResponderHandlers = Assert<
  SameKeys<Ours.GestureResponderHandlers, RN.GestureResponderHandlers>
>
export type _panResponderGestureState = Assert<
  SameValues<Ours.PanResponderGestureState, RN.PanResponderGestureState>
>
export type _textLayoutEventData = Assert<
  SameValues<Ours.TextLayoutEventData, RN.TextLayoutEvent['nativeEvent']>
>
export type _scaledSize = Assert<SameKeys<Ours.ScaledSize, RN.ScaledSize>>

/** the extracted AnimatedNode must remain interchangeable with the native handle */
export type _animatedNode = Assert<
  Ours.AnimatedNode extends RN.Animated.AnimatedNode
    ? RN.Animated.AnimatedNode extends Ours.AnimatedNode
      ? true
      : false
    : false
>

//
// the plain aliases, where drift would be a silently widened or narrowed union
//
export type _fontVariant = Assert<
  Erased<Ours.FontVariant> extends Erased<RN.FontVariant>
    ? Erased<RN.FontVariant> extends Erased<Ours.FontVariant>
      ? true
      : false
    : false
>
export type _imageResizeMode = Assert<
  Ours.ImageResizeMode extends RN.ImageResizeMode
    ? RN.ImageResizeMode extends Ours.ImageResizeMode
      ? true
      : false
    : false
>
export type _dimensionValue = Assert<
  Erased<Ours.DimensionValue> extends Erased<RN.DimensionValue>
    ? Erased<RN.DimensionValue> extends Erased<Ours.DimensionValue>
      ? true
      : false
    : false
>

//
// a negative control: the comparison above only means something if it can fail
//
export type _keyComparisonCanFail = Assert<
  SameKeys<{ a: 1 }, { a: 1; b: 2 }> extends true ? false : true
>
export type _valueComparisonCanFail = Assert<
  SameValues<{ a: string }, { a: number }> extends true ? false : true
>
/** and the erasure has to leave a real comparison behind, not collapse to `any` */
export type _erasureIsNotVacuous = Assert<
  Erased<{ deep: { transform: { scale: number }[] } }> extends Erased<{
    deep: { transform: { scale: string }[] }
  }>
    ? false
    : true
>

// refs must expose the same native instance contracts in both directions.
export type _viewInstance = Assert<
  Ours.ViewInstance extends RN.ViewInstance
    ? RN.ViewInstance extends Ours.ViewInstance
      ? true
      : false
    : false
>
export type _textInstance = Assert<
  Ours.TextInstance extends RN.TextInstance
    ? RN.TextInstance extends Ours.TextInstance
      ? true
      : false
    : false
>
export type _textInputInstance = Assert<
  Ours.TextInputInstance extends RN.TextInputInstance
    ? RN.TextInputInstance extends Ours.TextInputInstance
      ? true
      : false
    : false
>

// legacy apps must exchange actual component instances and refs in both directions.
type Assignable<From, To> = [From] extends [To] ? true : false
export type _legacyViewInstance = Assert<
  Assignable<LegacyOurs.ViewInstance, LegacyRN.View>
>
export type _legacyViewInstanceReverse = Assert<
  Assignable<LegacyRN.View, LegacyOurs.ViewInstance>
>
export type _legacyTextInstance = Assert<
  Assignable<LegacyOurs.TextInstance, LegacyRN.Text>
>
export type _legacyTextInstanceReverse = Assert<
  Assignable<LegacyRN.Text, LegacyOurs.TextInstance>
>
export type _legacyReadOnlyNode = Assert<
  Assignable<LegacyOurs.ReadOnlyNode, LegacyRN.ReadOnlyNode>
>
export type _legacyReadOnlyNodeReverse = Assert<
  Assignable<LegacyRN.ReadOnlyNode, LegacyOurs.ReadOnlyNode>
>
export type _legacyReactNativeElement = Assert<
  Assignable<LegacyOurs.ReactNativeElement, LegacyRN.ReactNativeElement>
>
export type _legacyReactNativeElementReverse = Assert<
  Assignable<LegacyRN.ReactNativeElement, LegacyOurs.ReactNativeElement>
>
export type _legacyViewRef = Assert<
  Assignable<Ref<LegacyOurs.ViewInstance>, Ref<LegacyRN.View>>
>
export type _legacyViewRefReverse = Assert<
  Assignable<Ref<LegacyRN.View>, Ref<LegacyOurs.ViewInstance>>
>
export type _legacyTextRef = Assert<
  Assignable<Ref<LegacyOurs.TextInstance>, Ref<LegacyRN.Text>>
>
export type _legacyTextRefReverse = Assert<
  Assignable<Ref<LegacyRN.Text>, Ref<LegacyOurs.TextInstance>>
>
export type _legacyNodeList = Assert<
  Assignable<
    LegacyOurs.NodeList<LegacyOurs.ReadOnlyNode>,
    LegacyRN.NodeList<LegacyRN.ReadOnlyNode>
  >
>
export type _legacyNodeListReverse = Assert<
  Assignable<
    LegacyRN.NodeList<LegacyRN.ReadOnlyNode>,
    LegacyOurs.NodeList<LegacyOurs.ReadOnlyNode>
  >
>

export type _legacyRefComparisonCanFail = Assert<
  Assignable<
    Ref<Pick<LegacyOurs.ViewInstance, 'focus'>>,
    Ref<LegacyRN.View>
  > extends false
    ? true
    : false
>

export type _nativeInputFitsView = Assert<
  Assignable<Ours.TextInputInstance, Ours.ViewInstance>
>
export type _nativeInputRefFitsView = Assert<
  Assignable<Ref<Ours.TextInputInstance>, Ref<Ours.ViewInstance>>
>
export type _legacyInputFitsView = Assert<
  Assignable<LegacyOurs.TextInputInstance, LegacyOurs.ViewInstance>
>
export type _legacyInputRefFitsView = Assert<
  Assignable<Ref<LegacyOurs.TextInputInstance>, Ref<LegacyOurs.ViewInstance>>
>
export type _legacyInputRef = Assert<
  Assignable<Ref<LegacyOurs.TextInputInstance>, Ref<LegacyRN.TextInput>>
>
export type _legacyInputRefReverse = Assert<
  Assignable<Ref<LegacyRN.TextInput>, Ref<LegacyOurs.TextInputInstance>>
>
