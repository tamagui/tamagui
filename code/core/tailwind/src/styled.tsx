import { createFrontendStyled } from '@tamagui/core/internal-runtime'
import { tailwindStyleFrontend } from './frontend'
import type {
  GetTailwindNonStyleProps,
  GetTailwindRef,
  GetTailwindVariantProps,
  TailwindComponent,
  TailwindStyledOptions,
  TailwindVariantDefinitions,
  TailwindVariantProps,
} from './types'

const styledWithFrontend = createFrontendStyled(tailwindStyleFrontend)

/**
 * Class-first `styled()`. The base is a class string, variant values are class
 * strings, and the resulting component accepts `className` plus its variants —
 * never Tamagui inline style props.
 *
 * The class base and variant values are parsed once per (component, config) pair
 * by the frontend's `normalizeStaticConfig`, so authoring cost is not per render.
 */
export function styled<
  Parent extends TailwindComponent<any, any, any>,
  Variants extends TailwindVariantDefinitions = {},
>(
  Component: Parent,
  baseClassName: string,
  options?: TailwindStyledOptions<Variants>
): TailwindComponent<
  GetTailwindRef<Parent>,
  GetTailwindNonStyleProps<Parent>,
  GetTailwindVariantProps<Parent> & TailwindVariantProps<Variants>
>
export function styled<
  Parent extends TailwindComponent<any, any, any>,
  Variants extends TailwindVariantDefinitions = {},
>(
  Component: Parent,
  options?: TailwindStyledOptions<Variants>
): TailwindComponent<
  GetTailwindRef<Parent>,
  GetTailwindNonStyleProps<Parent>,
  GetTailwindVariantProps<Parent> & TailwindVariantProps<Variants>
>
export function styled(
  Component: any,
  optionsOrBaseClassName?: any,
  maybeOptions?: any
): any {
  return styledWithFrontend(Component, optionsOrBaseClassName, maybeOptions)
}
