import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleWavyBold } from '../bold/circle-wavy-bold'
import { CircleWavyDuotone } from '../duotone/circle-wavy-duotone'
import { CircleWavyFill } from '../fill/circle-wavy-fill'
import { CircleWavyLight } from '../light/circle-wavy-light'
import { CircleWavyRegular } from '../regular/circle-wavy-regular'
import { CircleWavyThin } from '../thin/circle-wavy-thin'

const weightMap = {
  regular: CircleWavyRegular,
  bold: CircleWavyBold,
  duotone: CircleWavyDuotone,
  fill: CircleWavyFill,
  light: CircleWavyLight,
  thin: CircleWavyThin,
} as const

export const CircleWavy = (props: IconProps) => {
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
