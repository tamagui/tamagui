import { Input as InputDefault } from 'tamagui'

import { withController } from './withController'

export const InputControlled = withController(InputDefault, { onChange: 'onChangeText' })
