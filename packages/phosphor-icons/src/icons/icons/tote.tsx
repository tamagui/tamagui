import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToteBold } from '../bold/tote-bold'
import { ToteDuotone } from '../duotone/tote-duotone'
import { ToteFill } from '../fill/tote-fill'
import { ToteLight } from '../light/tote-light'
import { ToteRegular } from '../regular/tote-regular'
import { ToteThin } from '../thin/tote-thin'

const weightMap = {
  regular: ToteRegular,
  bold: ToteBold,
  duotone: ToteDuotone,
  fill: ToteFill,
  light: ToteLight,
  thin: ToteThin,
} as const

export const Tote = (props: IconProps) => {
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
