export function getOppositeScheme(scheme: string) {
  return scheme === 'dark' ? 'light' : 'dark'
}

/**
 * Style properties that are color values and support DynamicColorIOS on iOS.
 * Non-color properties (like opacity, dimensions, etc.) must NOT be wrapped
 * with {dynamic: {...}} as React Native will throw:
 * "TypeError: expected dynamic type 'int/double/bool/string', but had type 'object'"
 *
 * See: https://reactnative.dev/docs/dynamiccolorios
 * See: https://github.com/tamagui/tamagui/issues/3096
 * See: https://github.com/tamagui/tamagui/issues/2980
 */
const colorStyleKeys: Record<string, boolean> = {
  backgroundColor: true,
  borderColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderBottomColor: true,
  borderLeftColor: true,
  borderBlockColor: true,
  borderBlockEndColor: true,
  borderBlockStartColor: true,
  color: true,
  shadowColor: true,
  textDecorationColor: true,
  textShadowColor: true,
  tintColor: true,
  outlineColor: true,
}

/**
 * Check if a style key is a color property that supports DynamicColorIOS.
 */
export function isColorStyleKey(key: string): boolean {
  return colorStyleKeys[key] === true
}

export function getDynamicVal({
  scheme,
  val,
  oppositeVal,
}: {
  scheme: string
  val: string
  oppositeVal: string
}) {
  const oppositeScheme = getOppositeScheme(scheme)
  return {
    dynamic: {
      [scheme]: val,
      [oppositeScheme]: oppositeVal,
    },
  }
}

export function extractValueFromDynamic(val: any, scheme: string) {
  if (val?.['dynamic']) {
    return val['dynamic'][scheme]
  }
  return val
}
