import { stylePropsAll } from '@tamagui/helpers'

import { getConfig } from '../config'
import type { Shorthands } from '../types'

type StringKey<Props> = Extract<keyof Props, string>
type Simplify<Value> = { [Key in keyof Value]: Value[Key] }

type ExpandedShorthandKey<
  Key extends PropertyKey,
  ShorthandMap extends object = Shorthands,
> = Key extends keyof ShorthandMap
  ? ShorthandMap[Key] extends PropertyKey
    ? ShorthandMap[Key]
    : Key
  : Key

type ShorthandKeysMatchingFilter<
  Filter extends object,
  ShorthandMap extends object = Shorthands,
> = {
  [Key in keyof ShorthandMap]-?: ShorthandMap[Key] extends keyof Filter ? Key : never
}[keyof ShorthandMap]

type KeysMatchingFilter<Filter extends object, ShorthandMap extends object = Shorthands> =
  | keyof Filter
  | ShorthandKeysMatchingFilter<Filter, ShorthandMap>

type StyleKeys = KeysMatchingFilter<typeof stylePropsAll>

type ExpandedProps<
  Props extends object,
  Keys extends keyof Props,
  ShorthandMap extends object,
> = Simplify<
  {
    [Key in Extract<Keys, keyof ShorthandMap> as ExpandedShorthandKey<
      Key,
      ShorthandMap
    >]: Props[Key]
  } & Omit<Pick<Props, Keys>, keyof ShorthandMap>
>

type SelectedProps<
  Props extends object,
  Keys extends keyof Props,
  ExpandShorthands extends boolean,
  ShorthandMap extends object = Shorthands,
> = ExpandShorthands extends true
  ? ExpandedProps<Props, Keys, ShorthandMap>
  : Pick<Props, Keys>

export type SplitStylePropsResult<
  Props extends object,
  Keys extends PropertyKey,
  ExpandShorthands extends boolean = false,
  ShorthandMap extends object = Shorthands,
> = [
  SelectedProps<Props, Extract<keyof Props, Keys>, ExpandShorthands, ShorthandMap>,
  Omit<Props, Keys>,
]

export type SplitStylePropsFilterCallback<Props extends object> = (
  key: string,
  value: Props[StringKey<Props>],
  originalKey: StringKey<Props>,
  isStyleProp: boolean
) => boolean

export type SplitStylePropsFilter<Props extends object> =
  | Readonly<Record<string, unknown>>
  | SplitStylePropsFilterCallback<Props>

export type SplitStylePropsOptions<Props extends object> = {
  expandShorthands?: boolean
  filter?: SplitStylePropsFilter<Props>
}

/** partitions authored props in one pass without resolving style values */
export function splitStyleProps<
  Props extends object,
  const ExpandShorthands extends boolean = false,
>(
  props: Props,
  options?: { expandShorthands?: ExpandShorthands }
): SplitStylePropsResult<Props, StyleKeys, ExpandShorthands>

export function splitStyleProps<
  Props extends object,
  const Filter extends Readonly<Record<string, unknown>>,
  const ExpandShorthands extends boolean = false,
>(
  props: Props,
  options: { expandShorthands?: ExpandShorthands; filter: Filter }
): SplitStylePropsResult<Props, KeysMatchingFilter<Filter>, ExpandShorthands>

export function splitStyleProps<
  Props extends object,
  SelectedKey extends StringKey<Props>,
  const ExpandShorthands extends boolean = false,
>(
  props: Props,
  options: {
    expandShorthands?: ExpandShorthands
    filter: (
      key: string,
      value: Props[StringKey<Props>],
      originalKey: StringKey<Props>,
      isStyleProp: boolean
    ) => originalKey is SelectedKey
  }
): SplitStylePropsResult<Props, SelectedKey, ExpandShorthands>

export function splitStyleProps<
  Props extends object,
  const ExpandShorthands extends boolean = false,
>(
  props: Props,
  options: {
    expandShorthands?: ExpandShorthands
    filter: SplitStylePropsFilterCallback<Props>
  }
): [Partial<SelectedProps<Props, keyof Props, ExpandShorthands>>, Partial<Props>]

export function splitStyleProps(
  props: object,
  options: {
    expandShorthands?: boolean
    filter?:
      | Readonly<Record<string, unknown>>
      | ((
          key: string,
          value: unknown,
          originalKey: string,
          isStyleProp: boolean
        ) => boolean)
  } = {}
) {
  const styleProps: Record<string, unknown> = {}
  const regularProps: Record<string, unknown> = {}
  const { expandShorthands = false, filter } = options
  const shorthands = getConfig().shorthands
  const filterIsFunction = typeof filter === 'function'
  const propsRecord = props as Record<string, unknown>

  for (const originalKey in props) {
    if (!Object.hasOwn(props, originalKey)) continue

    const value = propsRecord[originalKey]
    const key = shorthands[originalKey] || originalKey
    const isStyleProp = key in stylePropsAll
    const selected = filter
      ? filterIsFunction
        ? filter(key, value, originalKey, isStyleProp)
        : Object.hasOwn(filter, key)
      : isStyleProp

    if (selected) {
      styleProps[expandShorthands ? key : originalKey] = value
    } else {
      regularProps[originalKey] = value
    }
  }

  return [styleProps, regularProps]
}
