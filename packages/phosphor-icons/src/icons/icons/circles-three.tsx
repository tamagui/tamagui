import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CirclesThreeBold } from '../bold/circles-three-bold'
import { CirclesThreeDuotone } from '../duotone/circles-three-duotone'
import { CirclesThreeFill } from '../fill/circles-three-fill'
import { CirclesThreeLight } from '../light/circles-three-light'
import { CirclesThreeRegular } from '../regular/circles-three-regular'
import { CirclesThreeThin } from '../thin/circles-three-thin'

const weightMap = {
  regular: CirclesThreeRegular,
  bold: CirclesThreeBold,
  duotone: CirclesThreeDuotone,
  fill: CirclesThreeFill,
  light: CirclesThreeLight,
  thin: CirclesThreeThin,
} as const

export const CirclesThree = (props: IconProps) => {
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
