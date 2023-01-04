import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BathtubBold } from '../bold/bathtub-bold'
import { BathtubDuotone } from '../duotone/bathtub-duotone'
import { BathtubFill } from '../fill/bathtub-fill'
import { BathtubLight } from '../light/bathtub-light'
import { BathtubRegular } from '../regular/bathtub-regular'
import { BathtubThin } from '../thin/bathtub-thin'

const weightMap = {
  regular: BathtubRegular,
  bold: BathtubBold,
  duotone: BathtubDuotone,
  fill: BathtubFill,
  light: BathtubLight,
  thin: BathtubThin,
} as const

export const Bathtub = (props: IconProps) => {
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
