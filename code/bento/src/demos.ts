import type { ComponentType } from 'react'

import * as AnimatedAvatars from './animation/avatars'
import * as AnimatedButtons from './animation/buttons'
import * as Microinteractions from './animation/microinteractions'
import * as Slide from './animation/slide'
import * as Payment from './ecommerce/payment'
import * as ProductPage from './ecommerce/productpage'
import * as Avatars from './elements/avatars'
import * as Chips from './elements/chips'
import * as DatePickers from './elements/datepickers'
import * as Dialogs from './elements/dialogs'
import * as Lists from './elements/list'
import * as Pickers from './elements/pickers'
import * as Tables from './elements/tables'
import * as Checkboxes from './forms/checkboxes'
import * as Inputs from './forms/inputs'
import * as Layouts from './forms/layouts'
import * as RadioGroups from './forms/radiogroups'
import * as Switches from './forms/switches'
import * as TextAreas from './forms/textareas'
import * as Navbars from './shells/navbars'
import * as Tabbars from './shells/tabbars'
import * as Preferences from './user/preferences'

// each registry group's module, keyed `<section>/<group>`. demos read their
// export by the registry's `component` name; sizable ones take `size`.
export const bentoDemos: Record<string, Record<string, ComponentType<any>>> = {
  'animation/avatars': AnimatedAvatars,
  'animation/buttons': AnimatedButtons,
  'animation/microinteractions': Microinteractions,
  'animation/slide': Slide,
  'ecommerce/payment': Payment,
  'ecommerce/productpage': ProductPage,
  'elements/avatars': Avatars,
  'elements/chips': Chips,
  'elements/datepickers': DatePickers,
  'elements/dialogs': Dialogs,
  'elements/list': Lists,
  'elements/pickers': Pickers,
  'elements/tables': Tables,
  'forms/checkboxes': Checkboxes,
  'forms/inputs': Inputs,
  'forms/layouts': Layouts,
  'forms/radiogroups': RadioGroups,
  'forms/switches': Switches,
  'forms/textareas': TextAreas,
  'shells/navbars': Navbars,
  'shells/tabbars': Tabbars,
  'user/preferences': Preferences,
}
