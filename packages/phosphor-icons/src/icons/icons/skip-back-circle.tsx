import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SkipBackCircleBold } from '../bold/skip-back-circle-bold'
import { SkipBackCircleDuotone } from '../duotone/skip-back-circle-duotone'
import { SkipBackCircleFill } from '../fill/skip-back-circle-fill'
import { SkipBackCircleLight } from '../light/skip-back-circle-light'
import { SkipBackCircleRegular } from '../regular/skip-back-circle-regular'
import { SkipBackCircleThin } from '../thin/skip-back-circle-thin'

const weightMap = {
  regular: SkipBackCircleRegular,
  bold: SkipBackCircleBold,
  duotone: SkipBackCircleDuotone,
  fill: SkipBackCircleFill,
  light: SkipBackCircleLight,
  thin: SkipBackCircleThin,
} as const

export const SkipBackCircle = (props: IconProps) => {
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
