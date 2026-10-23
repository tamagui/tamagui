/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// native config evaluation uses the native color values without loading a native
// runtime. keep this separate from the web entry, whose colors are css values.
export function getNativeColorFactories(platform: string) {
  return {
    PlatformColor(...args: Array<string | { fallback: string }>) {
      const last = args[args.length - 1]
      const fallback =
        last && typeof last === 'object' && typeof last.fallback === 'string'
          ? last.fallback
          : undefined
      const names = args.filter((name): name is string => typeof name === 'string')
      const color =
        platform === 'android' ? { resource_paths: names } : { semantic: names }
      return fallback === undefined ? color : { ...color, fallback }
    },
    DynamicColorIOS(colors: Record<string, unknown>) {
      if (platform === 'android') {
        throw new Error('DynamicColorIOS is not available on this platform.')
      }
      return {
        dynamic: {
          light: colors.light,
          dark: colors.dark,
          highContrastLight: colors.highContrastLight,
          highContrastDark: colors.highContrastDark,
        },
      }
    },
  }
}
