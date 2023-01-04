import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleWavyCheckBold } from '../bold/circle-wavy-check-bold'
import { CircleWavyCheckDuotone } from '../duotone/circle-wavy-check-duotone'
import { CircleWavyCheckFill } from '../fill/circle-wavy-check-fill'
import { CircleWavyCheckLight } from '../light/circle-wavy-check-light'
import { CircleWavyCheckRegular } from '../regular/circle-wavy-check-regular'
import { CircleWavyCheckThin } from '../thin/circle-wavy-check-thin'

const weightMap = {
  regular: CircleWavyCheckRegular,
  bold: CircleWavyCheckBold,
  duotone: CircleWavyCheckDuotone,
  fill: CircleWavyCheckFill,
  light: CircleWavyCheckLight,
  thin: CircleWavyCheckThin,
} as const

export const CircleWavyCheck = (props: IconProps) => {
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
