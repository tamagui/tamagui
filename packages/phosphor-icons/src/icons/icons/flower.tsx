import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlowerBold } from '../bold/flower-bold'
import { FlowerDuotone } from '../duotone/flower-duotone'
import { FlowerFill } from '../fill/flower-fill'
import { FlowerLight } from '../light/flower-light'
import { FlowerRegular } from '../regular/flower-regular'
import { FlowerThin } from '../thin/flower-thin'

const weightMap = {
  regular: FlowerRegular,
  bold: FlowerBold,
  duotone: FlowerDuotone,
  fill: FlowerFill,
  light: FlowerLight,
  thin: FlowerThin,
} as const

export const Flower = (props: IconProps) => {
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
