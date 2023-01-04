import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StopBold } from '../bold/stop-bold'
import { StopDuotone } from '../duotone/stop-duotone'
import { StopFill } from '../fill/stop-fill'
import { StopLight } from '../light/stop-light'
import { StopRegular } from '../regular/stop-regular'
import { StopThin } from '../thin/stop-thin'

const weightMap = {
  regular: StopRegular,
  bold: StopBold,
  duotone: StopDuotone,
  fill: StopFill,
  light: StopLight,
  thin: StopThin,
} as const

export const Stop = (props: IconProps) => {
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
