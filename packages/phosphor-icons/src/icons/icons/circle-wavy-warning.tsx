import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleWavyWarningBold } from '../bold/circle-wavy-warning-bold'
import { CircleWavyWarningDuotone } from '../duotone/circle-wavy-warning-duotone'
import { CircleWavyWarningFill } from '../fill/circle-wavy-warning-fill'
import { CircleWavyWarningLight } from '../light/circle-wavy-warning-light'
import { CircleWavyWarningRegular } from '../regular/circle-wavy-warning-regular'
import { CircleWavyWarningThin } from '../thin/circle-wavy-warning-thin'

const weightMap = {
  regular: CircleWavyWarningRegular,
  bold: CircleWavyWarningBold,
  duotone: CircleWavyWarningDuotone,
  fill: CircleWavyWarningFill,
  light: CircleWavyWarningLight,
  thin: CircleWavyWarningThin,
} as const

export const CircleWavyWarning = (props: IconProps) => {
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
