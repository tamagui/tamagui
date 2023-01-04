import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChalkboardTeacherBold } from '../bold/chalkboard-teacher-bold'
import { ChalkboardTeacherDuotone } from '../duotone/chalkboard-teacher-duotone'
import { ChalkboardTeacherFill } from '../fill/chalkboard-teacher-fill'
import { ChalkboardTeacherLight } from '../light/chalkboard-teacher-light'
import { ChalkboardTeacherRegular } from '../regular/chalkboard-teacher-regular'
import { ChalkboardTeacherThin } from '../thin/chalkboard-teacher-thin'

const weightMap = {
  regular: ChalkboardTeacherRegular,
  bold: ChalkboardTeacherBold,
  duotone: ChalkboardTeacherDuotone,
  fill: ChalkboardTeacherFill,
  light: ChalkboardTeacherLight,
  thin: ChalkboardTeacherThin,
} as const

export const ChalkboardTeacher = (props: IconProps) => {
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
