import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HouseLineBold } from '../bold/house-line-bold'
import { HouseLineDuotone } from '../duotone/house-line-duotone'
import { HouseLineFill } from '../fill/house-line-fill'
import { HouseLineLight } from '../light/house-line-light'
import { HouseLineRegular } from '../regular/house-line-regular'
import { HouseLineThin } from '../thin/house-line-thin'

const weightMap = {
  regular: HouseLineRegular,
  bold: HouseLineBold,
  duotone: HouseLineDuotone,
  fill: HouseLineFill,
  light: HouseLineLight,
  thin: HouseLineThin,
} as const

export const HouseLine = (props: IconProps) => {
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
