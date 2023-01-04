import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BalloonBold } from '../bold/balloon-bold'
import { BalloonDuotone } from '../duotone/balloon-duotone'
import { BalloonFill } from '../fill/balloon-fill'
import { BalloonLight } from '../light/balloon-light'
import { BalloonRegular } from '../regular/balloon-regular'
import { BalloonThin } from '../thin/balloon-thin'

const weightMap = {
  regular: BalloonRegular,
  bold: BalloonBold,
  duotone: BalloonDuotone,
  fill: BalloonFill,
  light: BalloonLight,
  thin: BalloonThin,
} as const

export const Balloon = (props: IconProps) => {
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
