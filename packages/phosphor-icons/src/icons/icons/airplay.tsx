import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplayBold } from '../bold/airplay-bold'
import { AirplayDuotone } from '../duotone/airplay-duotone'
import { AirplayFill } from '../fill/airplay-fill'
import { AirplayLight } from '../light/airplay-light'
import { AirplayRegular } from '../regular/airplay-regular'
import { AirplayThin } from '../thin/airplay-thin'

const weightMap = {
  regular: AirplayRegular,
  bold: AirplayBold,
  duotone: AirplayDuotone,
  fill: AirplayFill,
  light: AirplayLight,
  thin: AirplayThin,
} as const

export const Airplay = (props: IconProps) => {
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
