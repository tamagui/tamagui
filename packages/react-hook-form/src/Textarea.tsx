import { TextArea as TextAreaDefault } from 'tamagui'

import { withController } from './withController'

export const TextAreaControlled = withController(TextAreaDefault, { onChange: 'onChangeText' })
