import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SunglassesBold } from '../bold/sunglasses-bold'
import { SunglassesDuotone } from '../duotone/sunglasses-duotone'
import { SunglassesFill } from '../fill/sunglasses-fill'
import { SunglassesLight } from '../light/sunglasses-light'
import { SunglassesRegular } from '../regular/sunglasses-regular'
import { SunglassesThin } from '../thin/sunglasses-thin'

const weightMap = {
  regular: SunglassesRegular,
  bold: SunglassesBold,
  duotone: SunglassesDuotone,
  fill: SunglassesFill,
  light: SunglassesLight,
  thin: SunglassesThin,
} as const

export const Sunglasses = (props: IconProps) => {
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
