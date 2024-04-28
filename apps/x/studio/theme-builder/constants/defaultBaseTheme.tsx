import { getUniqueId } from '../helpers/getUniqueId'
import type { BuildTheme } from '../types'

export const defaultBaseTheme: BuildTheme = {
  type: 'theme',
  name: '',
  id: getUniqueId(),
  template: 'base',
  palette: 'base',

  accent: {
    type: 'theme',
    name: 'accent',
    id: getUniqueId(),
    palette: 'accent',
    template: 'base',
  },
}
