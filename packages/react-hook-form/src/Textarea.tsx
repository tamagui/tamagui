import { TextArea } from 'tamagui'

import { withController } from './withController'

export const TextAreaControlled = withController(TextArea, { onChange: 'onChangeText' })
