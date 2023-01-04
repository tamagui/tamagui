import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CirclesFourBold } from '../bold/circles-four-bold'
import { CirclesFourDuotone } from '../duotone/circles-four-duotone'
import { CirclesFourFill } from '../fill/circles-four-fill'
import { CirclesFourLight } from '../light/circles-four-light'
import { CirclesFourRegular } from '../regular/circles-four-regular'
import { CirclesFourThin } from '../thin/circles-four-thin'

const weightMap = {
  regular: CirclesFourRegular,
  bold: CirclesFourBold,
  duotone: CirclesFourDuotone,
  fill: CirclesFourFill,
  light: CirclesFourLight,
  thin: CirclesFourThin,
} as const

export const CirclesFour = (props: IconProps) => {
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
