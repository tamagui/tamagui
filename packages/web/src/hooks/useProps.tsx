import { useMediaPropsActive } from './useMedia'

/**
 * Will flatten any media styles down + expand all shorthands.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries.
 *
 * */
export function useProps<A extends Object>(
  props: A,
  opts?: {
    disableExpandShorthands?: boolean
  }
): {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
} {
  return useMediaPropsActive(props, {
    expandShorthands: !opts?.disableExpandShorthands,
  })
}
