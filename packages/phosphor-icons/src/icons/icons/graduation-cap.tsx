import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GraduationCapBold } from '../bold/graduation-cap-bold'
import { GraduationCapDuotone } from '../duotone/graduation-cap-duotone'
import { GraduationCapFill } from '../fill/graduation-cap-fill'
import { GraduationCapLight } from '../light/graduation-cap-light'
import { GraduationCapRegular } from '../regular/graduation-cap-regular'
import { GraduationCapThin } from '../thin/graduation-cap-thin'

const weightMap = {
  regular: GraduationCapRegular,
  bold: GraduationCapBold,
  duotone: GraduationCapDuotone,
  fill: GraduationCapFill,
  light: GraduationCapLight,
  thin: GraduationCapThin,
} as const

export const GraduationCap = (props: IconProps) => {
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
