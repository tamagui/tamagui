import { MotiTransitionProp } from '@tamagui/animations-moti'

import { baseColors } from './shared'

// copy from https://github.com/nandorojo/moti/blob/master/packages/moti/src/skeleton/types.ts

export type MotiSkeletonProps = {
  /**
   * Optional height of the container of the skeleton. If set, it will give a fixed height to the container.
   *
   * If not set, the container will stretch to the children.
   */
  boxHeight?: number | string
  /**
   * Optional height of the skeleton. Default to a `minHeight` of `32`
   */
  height?: number | string
  children?: React.ReactChild | null
  /**
   * `boolean` specifying whether the skeleton should be visible. By default, it shows if there are no children. This way, you can conditionally display children, and automatically hide the skeleton when they exist.
   *
   * ```tsx
   * // skeleton will hide when data exists
   * <Skeleton>
   *   {data ? <Data /> : null}
   * </Skeleton>
   * ```
   *
   * // skeleton will always show
   * <Skeleton show>
   *   {data ? <Data /> : null}
   * </Skeleton>
   *
   * // skeleton will always hide
   * <Skeleton show={false}>
   *   {data ? <Data /> : null}
   * </Skeleton>
   *
   * If you have multiple skeletons, you can use the `<Skeleton.Group show={loading} /> as a parent rather than use this prop directly.
   */
  show?: boolean
  /**
   * Width of the skeleton. Defaults to `32` as the `minWidth`. Sets the container's `minWidth` to this value if defined, falling back to 32.
   */
  width?: string | number
  /**
   * Border radius. Can be `square`, `round`, or a number. `round` makes it a circle. Defaults to `8`.
   */
  radius?: number | 'square' | 'round'
  /**
   * Background of the box that contains the skeleton. Should match the main `colors` prop color.
   *
   * Default: `'rgb(51, 51, 51, 50)'`
   */
  backgroundColor?: string
  /**
   * Gradient colors. Defaults to grayish black.
   */
  colors?: string[]
  /**
   * Default: `6`. Similar to `600%` for CSS `background-size`. Determines how much the gradient stretches.
   */
  backgroundSize?: number
  /**
   * `light` or `dark`. Default: `dark`.
   */
  colorMode?: keyof typeof baseColors
  disableExitAnimation?: boolean
  transition?: MotiTransitionProp
  Gradient: React.ComponentType<{
    colors: Array<string>
    start?: { x: number; y: number }
    end?: { x: number; y: number }
    style?: any
  }>
}
