/**
 * The slice of react-native's type surface Tamagui uses on web, inlined.
 *
 * Tamagui's props are typed against react-native's, but on web nothing imports
 * react-native at runtime. Without this package a web-only app has to install
 * react-native purely so `tsc` can resolve those types, and any non-`.native`
 * file that imports them is tied to it. Everything here is copied from
 * react-native's own `.d.ts` by `bun run generate`, so it is the same type, not
 * a re-description of one.
 *
 * Anything genuinely native-only stays where it is: `.native.ts` files keep
 * importing react-native directly, because they only ever run where it exists.
 *
 * `generated.d.ts` is regenerated wholesale and must not be hand-edited. Put
 * Tamagui-owned types here instead.
 */

export type * from './generated'
