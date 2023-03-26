import { Input } from 'tamagui'

import { withController } from './withController'

export const InputControlled = withController(Input, { onChange: 'onChangeText' })
