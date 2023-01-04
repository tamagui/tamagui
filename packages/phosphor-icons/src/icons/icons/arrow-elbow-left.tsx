import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowLeftBold } from '../bold/arrow-elbow-left-bold'
import { ArrowElbowLeftDuotone } from '../duotone/arrow-elbow-left-duotone'
import { ArrowElbowLeftFill } from '../fill/arrow-elbow-left-fill'
import { ArrowElbowLeftLight } from '../light/arrow-elbow-left-light'
import { ArrowElbowLeftRegular } from '../regular/arrow-elbow-left-regular'
import { ArrowElbowLeftThin } from '../thin/arrow-elbow-left-thin'

const weightMap = {
  regular: ArrowElbowLeftRegular,
  bold: ArrowElbowLeftBold,
  duotone: ArrowElbowLeftDuotone,
  fill: ArrowElbowLeftFill,
  light: ArrowElbowLeftLight,
  thin: ArrowElbowLeftThin,
} as const

export const ArrowElbowLeft = (props: IconProps) => {
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
