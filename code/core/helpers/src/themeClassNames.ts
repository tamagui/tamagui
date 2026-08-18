const schemePrefix = /^(dark|light)_/

/**
 * The theme classes a `<Theme>` span carries for a resolved theme name.
 *
 * Every level of a compound name gets its own class so CSS variables inherit
 * through the whole chain ("red_surface1" is `t_red t_red_surface1`). The zero
 * compiler emits these directly, so this has to be the only implementation:
 * a compiled span that spells its classes differently would resolve different
 * variables than the runtime does for the same authored tree.
 */
export function getThemeClassNames(name: string, isRoot = false): string {
  const themeClassName = name.replace(schemePrefix, '')
  const fullThemeClassName = name === themeClassName ? '' : ` t_${name}`

  const themeNameParts = themeClassName.split('_')
  let themeClasses = `t_${themeClassName}${fullThemeClassName}`

  if (themeNameParts.length > 1) {
    const hierarchyClasses: string[] = []
    for (let i = 1; i <= themeNameParts.length; i++) {
      hierarchyClasses.push(`t_${themeNameParts.slice(0, i).join('_')}`)
    }
    themeClasses = `${hierarchyClasses.join(' ')}${fullThemeClassName}`
  }

  return `${isRoot ? '' : 't_sub_theme'} ${themeClasses}`
}
