import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BinocularsBold } from '../bold/binoculars-bold'
import { BinocularsDuotone } from '../duotone/binoculars-duotone'
import { BinocularsFill } from '../fill/binoculars-fill'
import { BinocularsLight } from '../light/binoculars-light'
import { BinocularsRegular } from '../regular/binoculars-regular'
import { BinocularsThin } from '../thin/binoculars-thin'

const weightMap = {
  regular: BinocularsRegular,
  bold: BinocularsBold,
  duotone: BinocularsDuotone,
  fill: BinocularsFill,
  light: BinocularsLight,
  thin: BinocularsThin,
} as const

export const Binoculars = (props: IconProps) => {
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
