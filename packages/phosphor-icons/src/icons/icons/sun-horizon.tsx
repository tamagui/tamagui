import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SunHorizonBold } from '../bold/sun-horizon-bold'
import { SunHorizonDuotone } from '../duotone/sun-horizon-duotone'
import { SunHorizonFill } from '../fill/sun-horizon-fill'
import { SunHorizonLight } from '../light/sun-horizon-light'
import { SunHorizonRegular } from '../regular/sun-horizon-regular'
import { SunHorizonThin } from '../thin/sun-horizon-thin'

const weightMap = {
  regular: SunHorizonRegular,
  bold: SunHorizonBold,
  duotone: SunHorizonDuotone,
  fill: SunHorizonFill,
  light: SunHorizonLight,
  thin: SunHorizonThin,
} as const

export const SunHorizon = (props: IconProps) => {
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
