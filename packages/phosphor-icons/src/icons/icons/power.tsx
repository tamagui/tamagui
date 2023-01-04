import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PowerBold } from '../bold/power-bold'
import { PowerDuotone } from '../duotone/power-duotone'
import { PowerFill } from '../fill/power-fill'
import { PowerLight } from '../light/power-light'
import { PowerRegular } from '../regular/power-regular'
import { PowerThin } from '../thin/power-thin'

const weightMap = {
  regular: PowerRegular,
  bold: PowerBold,
  duotone: PowerDuotone,
  fill: PowerFill,
  light: PowerLight,
  thin: PowerThin,
} as const

export const Power = (props: IconProps) => {
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
