import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StudentBold } from '../bold/student-bold'
import { StudentDuotone } from '../duotone/student-duotone'
import { StudentFill } from '../fill/student-fill'
import { StudentLight } from '../light/student-light'
import { StudentRegular } from '../regular/student-regular'
import { StudentThin } from '../thin/student-thin'

const weightMap = {
  regular: StudentRegular,
  bold: StudentBold,
  duotone: StudentDuotone,
  fill: StudentFill,
  light: StudentLight,
  thin: StudentThin,
} as const

export const Student = (props: IconProps) => {
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
