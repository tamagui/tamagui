import type { Animated, TextStyle as RNTextStyle, ViewStyle } from 'react-native'

import type { StackStyleBase, TextStylePropsBase, Variable } from '../types'
import type { TamaguiStyleProps } from './styleTypes'

/**
 * The drift alarm for `styleTypes.ts`.
 *
 * `@tamagui/core/dom` has to typecheck in a project with no react-native
 * installed, so the web style contract behind `style()` and `html.*` is
 * defined from scratch there. This file keeps that definition honest: it runs
 * here, where react-native *is* available, and checks the owned property set
 * against both react-native's and Tamagui's own. The owned set is the
 * react-native-typed reference set minus the react-native-only keys the web
 * contract removes (`RemovedWebKeys`): add a property to `types.tsx` without
 * adding it here, or re-add a removed key to `styleTypes.ts`, and one of these
 * assertions goes red.
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
 * The react-native-only keys the web contract removes rather than deprecates.
 * `html.*` and `style()` author `boxShadow`, the logical box props,
 * `direction` and `verticalAlign` instead.
 */
type RemovedWebKeys =
  | 'elevation'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'textAlignVertical'
  | 'includeFontPadding'
  | 'writingDirection'

/** the reference set as the web contract sees it: everything but the removed keys */
type WebReferenceStyle = Omit<ReferenceStyle, RemovedWebKeys>

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
// 1. the owned type has exactly the web reference properties: nothing else
//    missing, nothing invented
//
export type _sameKeysAsWebReference = Assert<
  SameKeys<TamaguiStyleProps, WebReferenceStyle>
>

//
// 2. and it covers react-native's own two style types minus the removed keys,
//    which is what matters to anyone writing `style({ ... })` against a
//    react-native mental model
//
export type _coversViewStyle = Assert<
  Covers<TamaguiStyleProps, Omit<ViewStyle, RemovedWebKeys>>
>
export type _coversTextStyle = Assert<
  Covers<TamaguiStyleProps, Omit<RNTextStyle, RemovedWebKeys>>
>

//
// 3. every value the regular Tamagui style props accept (on the keys the web
//    contract keeps) is accepted here too,
//    minus the runtime-only forms above. react-native's own value types are
//    covered by this rather than asserted separately: where they differ from
//    the reference (`filter` arrays, `transformOrigin` arrays, `DimensionValue`
//    on the logical box props) the regular props already rejected them, and
//    matching the reference is the point.
//
export type _acceptsReferenceValues = Assert<
  AcceptsValues<TamaguiStyleProps, StaticStyle<WebReferenceStyle>>
>

//
// 4. spot checks in the direction a mapped type cannot express: what the owned
//    type must still reject
//
declare const check: (definition: TamaguiStyleProps) => void

check({ padding: 16, backgroundColor: 'surface hover:surface-hover', display: 'flex' })
check({ transform: [{ scale: 2 }, { rotate: '45deg' }] })
check({ position: 'fixed', overflowX: 'auto', gridTemplateColumns: '1fr 1fr' })
check({ fontSize: 20, lineHeight: 1.5 })
check({ lineHeight: '24px' })
check({ lineHeight: '1.5' })

// @ts-expect-error not a style property
check({ notAStyleProperty: 1 })
// @ts-expect-error padding takes a length, not a boolean
check({ padding: true })
// @ts-expect-error one transform function per entry
check({ transform: [{ scale: 2, rotate: '45deg' }] })
// @ts-expect-error fontStyle has a fixed set of values
check({ fontStyle: 'oblique' })

// the removed keys are absent, not deprecated and not optional
// @ts-expect-error marginHorizontal is marginInline on web
check({ marginHorizontal: 4 })
// @ts-expect-error marginVertical is marginBlock on web
check({ marginVertical: 4 })
// @ts-expect-error paddingHorizontal is paddingInline on web
check({ paddingHorizontal: 4 })
// @ts-expect-error paddingVertical is paddingBlock on web
check({ paddingVertical: 4 })
// @ts-expect-error elevation is boxShadow on web
check({ elevation: 4 })
// @ts-expect-error the 4-part shadow is one boxShadow string on web
check({ shadowColor: 'red', shadowOpacity: 0.5, shadowRadius: 4 })
// @ts-expect-error the 4-part shadow is one boxShadow string on web
check({ shadowOffset: { width: 0, height: 2 } })
// @ts-expect-error textAlignVertical is verticalAlign on web
check({ textAlignVertical: 'center' })
// @ts-expect-error includeFontPadding has no web spelling
check({ includeFontPadding: false })
// @ts-expect-error writingDirection is direction on web
check({ writingDirection: 'ltr' })
