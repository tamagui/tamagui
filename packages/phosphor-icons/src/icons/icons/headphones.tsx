import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeadphonesBold } from '../bold/headphones-bold'
import { HeadphonesDuotone } from '../duotone/headphones-duotone'
import { HeadphonesFill } from '../fill/headphones-fill'
import { HeadphonesLight } from '../light/headphones-light'
import { HeadphonesRegular } from '../regular/headphones-regular'
import { HeadphonesThin } from '../thin/headphones-thin'

const weightMap = {
  regular: HeadphonesRegular,
  bold: HeadphonesBold,
  duotone: HeadphonesDuotone,
  fill: HeadphonesFill,
  light: HeadphonesLight,
  thin: HeadphonesThin,
} as const

export const Headphones = (props: IconProps) => {
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
