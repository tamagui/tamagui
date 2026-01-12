export type GrandChildrenThemeDefinition = {
  template: string
}

/** Default grandchildren theme names */
export type DefaultGrandChildrenThemeName =
  | 'accent'
  | 'alt1'
  | 'alt2'
  | 'surface1'
  | 'surface2'
  | 'surface3'

/**
 * Default grandchildren themes for v5.
 * These create sub-theme variants using different templates.
 */
export const defaultGrandChildrenThemes = {
  accent: { template: 'inverse' },
  alt1: { template: 'alt1' },
  alt2: { template: 'alt2' },
  surface1: { template: 'surface1' },
  surface2: { template: 'surface2' },
  surface3: { template: 'surface3' },
} satisfies Record<DefaultGrandChildrenThemeName, GrandChildrenThemeDefinition>

export type DefaultGrandChildrenThemes = typeof defaultGrandChildrenThemes
