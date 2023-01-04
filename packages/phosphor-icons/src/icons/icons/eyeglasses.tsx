import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyeglassesBold } from '../bold/eyeglasses-bold'
import { EyeglassesDuotone } from '../duotone/eyeglasses-duotone'
import { EyeglassesFill } from '../fill/eyeglasses-fill'
import { EyeglassesLight } from '../light/eyeglasses-light'
import { EyeglassesRegular } from '../regular/eyeglasses-regular'
import { EyeglassesThin } from '../thin/eyeglasses-thin'

const weightMap = {
  regular: EyeglassesRegular,
  bold: EyeglassesBold,
  duotone: EyeglassesDuotone,
  fill: EyeglassesFill,
  light: EyeglassesLight,
  thin: EyeglassesThin,
} as const

export const Eyeglasses = (props: IconProps) => {
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
