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
        if (!current) throw `❌`
        const next = applyMaskStateless(current, mask, opts)
        current = next
        theme = next.theme
      }
      return theme
    },
  }
  return mask
}
