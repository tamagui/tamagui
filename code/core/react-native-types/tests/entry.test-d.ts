import type { Ref, ComponentRef } from 'react'
import type * as RN from 'react-native'
import type * as Ours from '@tamagui/react-native-types'

type Assert<T extends true> = T
type Assignable<From, To> = [From] extends [To] ? true : false

type NativeView = ComponentRef<typeof RN.View>
type NativeText = ComponentRef<typeof RN.Text>
type NativeInput = ComponentRef<typeof RN.TextInput>

// compile through package exports with each of RN's type entry conditions.
export type _view = Assert<Assignable<Ours.ViewInstance, NativeView>>
export type _viewReverse = Assert<Assignable<NativeView, Ours.ViewInstance>>
export type _text = Assert<Assignable<Ours.TextInstance, NativeText>>
export type _textReverse = Assert<Assignable<NativeText, Ours.TextInstance>>
export type _input = Assert<Assignable<Ours.TextInputInstance, NativeInput>>
export type _inputReverse = Assert<Assignable<NativeInput, Ours.TextInputInstance>>
export type _viewRef = Assert<Assignable<Ref<Ours.ViewInstance>, Ref<NativeView>>>
export type _viewRefReverse = Assert<Assignable<Ref<NativeView>, Ref<Ours.ViewInstance>>>
export type _inputRef = Assert<Assignable<Ref<Ours.TextInputInstance>, Ref<NativeInput>>>
export type _inputRefReverse = Assert<
  Assignable<Ref<NativeInput>, Ref<Ours.TextInputInstance>>
>
export type _inputRefFitsView = Assert<
  Assignable<Ref<Ours.TextInputInstance>, Ref<Ours.ViewInstance>>
>
export type _comparisonCanFail = Assert<
  Assignable<Ref<{ focus(): void }>, Ref<NativeView>> extends false ? true : false
>
