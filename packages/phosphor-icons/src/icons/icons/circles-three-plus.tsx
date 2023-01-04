import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CirclesThreePlusBold } from '../bold/circles-three-plus-bold'
import { CirclesThreePlusDuotone } from '../duotone/circles-three-plus-duotone'
import { CirclesThreePlusFill } from '../fill/circles-three-plus-fill'
import { CirclesThreePlusLight } from '../light/circles-three-plus-light'
import { CirclesThreePlusRegular } from '../regular/circles-three-plus-regular'
import { CirclesThreePlusThin } from '../thin/circles-three-plus-thin'

const weightMap = {
  regular: CirclesThreePlusRegular,
  bold: CirclesThreePlusBold,
  duotone: CirclesThreePlusDuotone,
  fill: CirclesThreePlusFill,
  light: CirclesThreePlusLight,
  thin: CirclesThreePlusThin,
} as const

export const CirclesThreePlus = (props: IconProps) => {
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
