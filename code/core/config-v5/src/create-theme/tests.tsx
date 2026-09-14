import { applyMask } from './applyMask'
import { createTheme } from './createTheme'
import { createStrengthenMask, createWeakenMask } from './masks'

// --- tests ---
if (process.env.NODE_ENV === 'development') {
  const palette = ['0', '1', '2', '3', '-3', '-2', '-1', '-0']
  const template = { bg: 1, fg: -1 }

  const stongerMask = createStrengthenMask()
  const weakerMask = createWeakenMask()

  const theme = createTheme(palette, template)
  if (theme.bg !== '1') throw `❌`
  if (theme.fg !== '-1') throw `❌`

  const str = applyMask(theme, stongerMask)
  if (str.bg !== '0') throw `❌`
  if (str.fg !== '-0') throw `❌`

  const weak = applyMask(theme, weakerMask)
  if (weak.bg !== '2') throw `❌`
  if (weak.fg !== '-2') throw `❌`

  const weak2 = applyMask(theme, weakerMask, { strength: 2 })
  if (weak2.bg !== '3') throw `❌`
  if (weak2.fg !== '-3') throw `❌`
}
