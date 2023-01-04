import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LaptopBold } from '../bold/laptop-bold'
import { LaptopDuotone } from '../duotone/laptop-duotone'
import { LaptopFill } from '../fill/laptop-fill'
import { LaptopLight } from '../light/laptop-light'
import { LaptopRegular } from '../regular/laptop-regular'
import { LaptopThin } from '../thin/laptop-thin'

const weightMap = {
  regular: LaptopRegular,
  bold: LaptopBold,
  duotone: LaptopDuotone,
  fill: LaptopFill,
  light: LaptopLight,
  thin: LaptopThin,
} as const

export const Laptop = (props: IconProps) => {
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
