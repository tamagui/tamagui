export const TEST_IDS = {
  themeInfo: 'theme-info',
  staticSquare: 'static-square',
  dynamicSquare: 'dynamic-square',
  changeThemeButton: 'change-theme-button',
  // Theme Reset test IDs
  resetButton1: 'reset-button-1',
  resetButton2: 'reset-button-2',
  resetSquare1: 'reset-square-1',
  resetSquare2: 'reset-square-2',
  darkButton: 'dark-button',
  // Nested Theme test IDs (Issue #3673)
  nestedThemeDirect: 'nested-theme-direct',
  nestedThemeNested: 'nested-theme-nested',
  nestedThemeWithParent: 'nested-theme-with-parent',
  nestedThemeRedDirect: 'nested-theme-red-direct',
  nestedThemeRedNested: 'nested-theme-red-nested',
  nestedThemeNoColor: 'nested-theme-no-color',
  // Color Token Fallback test IDs (Issue #3620)
  colorTokenFallbackThemeValue: 'color-token-fallback-theme-value',
  colorTokenFallbackTokenValue: 'color-token-fallback-token-value',
  // Theme Component Resolution test IDs (commit 5839319146 goals)
  // Goal 1a: Explicit scheme override
  themeExplicitSchemeDirect: 'theme-explicit-scheme-direct',
  themeExplicitSchemeNested: 'theme-explicit-scheme-nested',
  // Goal 1b: Inherit scheme for component
  themeInheritSchemeDirect: 'theme-inherit-scheme-direct',
  themeInheritSchemeNested: 'theme-inherit-scheme-nested',
  // Goal 2: Component-only preserves sub-theme (no backtracking)
  themeAlt1Direct: 'theme-alt1-direct',
  themeAlt1WithComponent: 'theme-alt1-with-component',
  // Nested Surface test IDs
  nestedSurface1To3Direct: 'nested-surface-1-to-3-direct',
  nestedSurface1To3Nested: 'nested-surface-1-to-3-nested',
  // Theme Mutation test IDs (DynamicColorIOS force update fix)
  themeMutationSquare: 'theme-mutation-square',
  themeMutationButton: 'theme-mutation-button',
  themeMutationColorText: 'theme-mutation-color-text',
  // Theme Component Resolution test IDs
  themeExplicitSchemeDirect: 'theme-explicit-scheme-direct',
  themeExplicitSchemeNested: 'theme-explicit-scheme-nested',
  themeInheritSchemeDirect: 'theme-inherit-scheme-direct',
  themeInheritSchemeNested: 'theme-inherit-scheme-nested',
  themeAlt1Direct: 'theme-alt1-direct',
  themeAlt1WithComponent: 'theme-alt1-with-component',
  // Nested Surface test IDs
  nestedSurface1To3Direct: 'nested-surface-1-to-3-direct',
  nestedSurface1To3Nested: 'nested-surface-1-to-3-nested',
} as const
