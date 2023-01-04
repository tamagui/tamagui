import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PeaceBold } from '../bold/peace-bold'
import { PeaceDuotone } from '../duotone/peace-duotone'
import { PeaceFill } from '../fill/peace-fill'
import { PeaceLight } from '../light/peace-light'
import { PeaceRegular } from '../regular/peace-regular'
import { PeaceThin } from '../thin/peace-thin'

const weightMap = {
  regular: PeaceRegular,
  bold: PeaceBold,
  duotone: PeaceDuotone,
  fill: PeaceFill,
  light: PeaceLight,
  thin: PeaceThin,
} as const

export const Peace = (props: IconProps) => {
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
