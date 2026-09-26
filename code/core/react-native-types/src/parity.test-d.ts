import type * as RN from 'react-native'

import type * as Ours from './index'

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
 * `AnimatedNode` is the one shape hand-copied rather than generated, so the two
 * declarations are distinct symbols even though they are structurally the same.
 * Collapsing both to one marker keeps that out of every other comparison;
 * `_animatedNode` below is where the copy itself is checked.
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
  SameKeys<Ours.TextLayoutEventData, RN.TextLayoutEventData>
>
export type _scaledSize = Assert<SameKeys<Ours.ScaledSize, RN.ScaledSize>>

/**
 * `AnimatedNode` is copied by hand rather than generated, and everything above
 * leans on the copy being interchangeable with react-native's: without this,
 * a `.native` file could not pass a style built from these types to a real
 * react-native component.
 */
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
