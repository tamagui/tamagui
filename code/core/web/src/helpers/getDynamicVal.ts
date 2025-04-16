export function getOppositeScheme(scheme: string) {
  return scheme === 'dark' ? 'light' : 'dark'
}

export function getDynamicVal({
  scheme,
  val,
  oppositeVal,
}: { scheme: string; val: string; oppositeVal: string }) {
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
