import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileVueBold } from '../bold/file-vue-bold'
import { FileVueDuotone } from '../duotone/file-vue-duotone'
import { FileVueFill } from '../fill/file-vue-fill'
import { FileVueLight } from '../light/file-vue-light'
import { FileVueRegular } from '../regular/file-vue-regular'
import { FileVueThin } from '../thin/file-vue-thin'

const weightMap = {
  regular: FileVueRegular,
  bold: FileVueBold,
  duotone: FileVueDuotone,
  fill: FileVueFill,
  light: FileVueLight,
  thin: FileVueThin,
} as const

export const FileVue = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
