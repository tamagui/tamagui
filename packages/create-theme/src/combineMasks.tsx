import { applyMaskStateless } from './applyMask'
import { CreateMask } from './createThemeTypes'
import { getThemeInfo } from './themeInfo'

export const combineMasks = (...masks: CreateMask[]) => {
  const mask: CreateMask = {
    name: 'combine-mask',
    mask: (template, opts) => {
      let current = getThemeInfo(template, opts.parentName)
      let theme: any
      for (const mask of masks) {
        if (!current)
          if (process.env.NODE_ENV === 'development') {
            throw new Error(
              `After applying mask, nothing returned: ${current}, for template: ${template} and mask: ${mask.toString()}, given opts ${JSON.stringify(
                opts,
                null,
                2
              )}`
            )
          } else {
            throw `❌`
          }
        const next = applyMaskStateless(current, mask, opts)
        current = next
        theme = next.theme
      }
      return theme
    },
  }
  return mask
}
