import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WheelchairBold } from '../bold/wheelchair-bold'
import { WheelchairDuotone } from '../duotone/wheelchair-duotone'
import { WheelchairFill } from '../fill/wheelchair-fill'
import { WheelchairLight } from '../light/wheelchair-light'
import { WheelchairRegular } from '../regular/wheelchair-regular'
import { WheelchairThin } from '../thin/wheelchair-thin'

const weightMap = {
  regular: WheelchairRegular,
  bold: WheelchairBold,
  duotone: WheelchairDuotone,
  fill: WheelchairFill,
  light: WheelchairLight,
  thin: WheelchairThin,
} as const

export const Wheelchair = (props: IconProps) => {
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
