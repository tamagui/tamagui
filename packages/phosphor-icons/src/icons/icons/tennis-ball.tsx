import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TennisBallBold } from '../bold/tennis-ball-bold'
import { TennisBallDuotone } from '../duotone/tennis-ball-duotone'
import { TennisBallFill } from '../fill/tennis-ball-fill'
import { TennisBallLight } from '../light/tennis-ball-light'
import { TennisBallRegular } from '../regular/tennis-ball-regular'
import { TennisBallThin } from '../thin/tennis-ball-thin'

const weightMap = {
  regular: TennisBallRegular,
  bold: TennisBallBold,
  duotone: TennisBallDuotone,
  fill: TennisBallFill,
  light: TennisBallLight,
  thin: TennisBallThin,
} as const

export const TennisBall = (props: IconProps) => {
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
