import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HouseSimpleBold } from '../bold/house-simple-bold'
import { HouseSimpleDuotone } from '../duotone/house-simple-duotone'
import { HouseSimpleFill } from '../fill/house-simple-fill'
import { HouseSimpleLight } from '../light/house-simple-light'
import { HouseSimpleRegular } from '../regular/house-simple-regular'
import { HouseSimpleThin } from '../thin/house-simple-thin'

const weightMap = {
  regular: HouseSimpleRegular,
  bold: HouseSimpleBold,
  duotone: HouseSimpleDuotone,
  fill: HouseSimpleFill,
  light: HouseSimpleLight,
  thin: HouseSimpleThin,
} as const

export const HouseSimple = (props: IconProps) => {
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
