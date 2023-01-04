import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WarningCircleBold } from '../bold/warning-circle-bold'
import { WarningCircleDuotone } from '../duotone/warning-circle-duotone'
import { WarningCircleFill } from '../fill/warning-circle-fill'
import { WarningCircleLight } from '../light/warning-circle-light'
import { WarningCircleRegular } from '../regular/warning-circle-regular'
import { WarningCircleThin } from '../thin/warning-circle-thin'

const weightMap = {
  regular: WarningCircleRegular,
  bold: WarningCircleBold,
  duotone: WarningCircleDuotone,
  fill: WarningCircleFill,
  light: WarningCircleLight,
  thin: WarningCircleThin,
} as const

export const WarningCircle = (props: IconProps) => {
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
