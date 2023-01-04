import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DropHalfBold } from '../bold/drop-half-bold'
import { DropHalfDuotone } from '../duotone/drop-half-duotone'
import { DropHalfFill } from '../fill/drop-half-fill'
import { DropHalfLight } from '../light/drop-half-light'
import { DropHalfRegular } from '../regular/drop-half-regular'
import { DropHalfThin } from '../thin/drop-half-thin'

const weightMap = {
  regular: DropHalfRegular,
  bold: DropHalfBold,
  duotone: DropHalfDuotone,
  fill: DropHalfFill,
  light: DropHalfLight,
  thin: DropHalfThin,
} as const

export const DropHalf = (props: IconProps) => {
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
