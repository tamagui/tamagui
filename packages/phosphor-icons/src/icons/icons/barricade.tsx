import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BarricadeBold } from '../bold/barricade-bold'
import { BarricadeDuotone } from '../duotone/barricade-duotone'
import { BarricadeFill } from '../fill/barricade-fill'
import { BarricadeLight } from '../light/barricade-light'
import { BarricadeRegular } from '../regular/barricade-regular'
import { BarricadeThin } from '../thin/barricade-thin'

const weightMap = {
  regular: BarricadeRegular,
  bold: BarricadeBold,
  duotone: BarricadeDuotone,
  fill: BarricadeFill,
  light: BarricadeLight,
  thin: BarricadeThin,
} as const

export const Barricade = (props: IconProps) => {
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
