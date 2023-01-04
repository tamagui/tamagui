import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EarBold } from '../bold/ear-bold'
import { EarDuotone } from '../duotone/ear-duotone'
import { EarFill } from '../fill/ear-fill'
import { EarLight } from '../light/ear-light'
import { EarRegular } from '../regular/ear-regular'
import { EarThin } from '../thin/ear-thin'

const weightMap = {
  regular: EarRegular,
  bold: EarBold,
  duotone: EarDuotone,
  fill: EarFill,
  light: EarLight,
  thin: EarThin,
} as const

export const Ear = (props: IconProps) => {
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
