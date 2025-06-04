import { lazy } from 'react'
import { getNameFromPath } from '~/utils/getFromPath'

const AllTestsByPath = import.meta.glob('../use-cases/*')

export const AllTests = Object.fromEntries(
  Object.entries(AllTestsByPath).map(([key, value]) => {
    return [getNameFromPath('test', key), lazy(nameExportToDefault(value) as any)]
  })
)

// export const AllBentoByPath = import.meta.glob('../../bento/src/components/**/*.tsx')

// export const AllBento = Object.fromEntries(
//   Object.entries(AllBentoByPath).map(([key, value]) => {
//     return [getNameFromPath('test', key), lazy(nameExportToDefault(value) as any)]
//   })
// )

function nameExportToDefault(maybeNamed: () => Promise<any>) {
  return async () => {
    const out = await maybeNamed()
    const found = out.default ?? out[Object.keys(out)[0]]
    return {
      default: found,
    }
  }
}
