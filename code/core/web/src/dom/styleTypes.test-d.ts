import type { Animated, TextStyle as RNTextStyle, ViewStyle } from 'react-native'

import type { StackStyleBase, TextStylePropsBase, Variable } from '../types'
import type { TamaguiStyleProps } from './styleTypes'

/**
 * The drift alarm for `styleTypes.ts`.
 *
 * `@tamagui/core/dom` has to typecheck in a project with no react-native
 * installed, so the style grammar behind `style()` is defined from scratch
 * there. This file keeps that definition honest: it runs here, where
 * react-native *is* available, and checks the owned property set against both
 * react-native's and Tamagui's own. Add a property to `types.tsx` without adding
 * it to `styleTypes.ts` and one of these assertions goes red.
 *
 * `tsc` checks all of it through `vitest --typecheck`, so a drift is a build
 * failure rather than a message nobody reads.
 */

type Assert<T extends true> = T

type SameKeys<A, B> = [keyof A] extends [keyof B]
  ? [keyof B] extends [keyof A]
    ? true
    : { missingFromA: Exclude<keyof B, keyof A> }
  : { invented: Exclude<keyof A, keyof B> }

type Covers<Whole, Part> = [keyof Part] extends [keyof Whole]
  ? true
  : { uncovered: Exclude<keyof Part, keyof Whole> }

type ValueGaps<Owned, Source> = {
  [K in keyof Source]-?: Source[K] extends Owned[K & keyof Owned] ? never : K
}[keyof Source]

type AcceptsValues<Owned, Source> = [ValueGaps<Owned, Source>] extends [never]
  ? true
  : { narrowedProps: ValueGaps<Owned, Source> }

/** what `StyleDefinition` was before it stopped importing `../types` */
type ReferenceStyle = StackStyleBase & TextStylePropsBase

/**
 * The three value forms `style()` deliberately does not accept: they exist only
 * at runtime, and a `style()` call is resolved by the compiler, so there is
 * nothing for it to read. Stripping them here is what makes the value
 * comparison below a real check rather than a list of allowed failures.
 */
type RuntimeOnlyValue =
  | Animated.AnimatedNode
  | (symbol & { __TYPE__: 'Color' })
  | Variable<any>

type StaticValue<T> = T extends RuntimeOnlyValue
  ? never
  : T extends string | number | bigint | boolean | symbol | null | undefined
    ? T
    : T extends (...args: any[]) => any
      ? T
      : { [K in keyof T]: StaticValue<T[K]> }

type StaticStyle<T> = { [K in keyof T]-?: StaticValue<Exclude<T[K], undefined>> }

//
// 1. the owned type has exactly the properties the react-native-typed one has:
//    nothing missing, nothing invented
//
export type _sameKeysAsReference = Assert<SameKeys<TamaguiStyleProps, ReferenceStyle>>

//
// 2. and it covers react-native's own two style types outright, which is what
//    matters to anyone writing `style({ ... })` against a react-native mental
//    model
//
export type _coversViewStyle = Assert<Covers<TamaguiStyleProps, ViewStyle>>
export type _coversTextStyle = Assert<Covers<TamaguiStyleProps, RNTextStyle>>
export type _coversReferenceKeys = Assert<Covers<TamaguiStyleProps, ReferenceStyle>>

//
// 3. every value the regular Tamagui style props accept is accepted here too,
//    minus the runtime-only forms above. react-native's own value types are
//    covered by this rather than asserted separately: where they differ from
//    the reference (`filter` arrays, `transformOrigin` arrays, `DimensionValue`
//    on the logical box props) the regular props already rejected them, and
//    matching the reference is the point.
//
export type _acceptsReferenceValues = Assert<
  AcceptsValues<TamaguiStyleProps, StaticStyle<ReferenceStyle>>
>

//
// 4. spot checks in the direction a mapped type cannot express: what the owned
//    type must still reject
//
declare const check: (definition: TamaguiStyleProps) => void

check({ padding: 16, backgroundColor: 'surface hover:surface-hover', display: 'flex' })
check({ transform: [{ scale: 2 }, { rotate: '45deg' }] })
check({ position: 'fixed', overflowX: 'auto', gridTemplateColumns: '1fr 1fr' })

// @ts-expect-error not a style property
check({ notAStyleProperty: 1 })
// @ts-expect-error padding takes a length, not a boolean
check({ padding: true })
// @ts-expect-error one transform function per entry
check({ transform: [{ scale: 2, rotate: '45deg' }] })
// @ts-expect-error fontStyle has a fixed set of values
check({ fontStyle: 'oblique' })
