import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WindBold } from '../bold/wind-bold'
import { WindDuotone } from '../duotone/wind-duotone'
import { WindFill } from '../fill/wind-fill'
import { WindLight } from '../light/wind-light'
import { WindRegular } from '../regular/wind-regular'
import { WindThin } from '../thin/wind-thin'

const weightMap = {
  regular: WindRegular,
  bold: WindBold,
  duotone: WindDuotone,
  fill: WindFill,
  light: WindLight,
  thin: WindThin,
} as const

export const Wind = (props: IconProps) => {
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
