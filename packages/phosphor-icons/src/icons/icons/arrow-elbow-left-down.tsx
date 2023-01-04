import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowLeftDownBold } from '../bold/arrow-elbow-left-down-bold'
import { ArrowElbowLeftDownDuotone } from '../duotone/arrow-elbow-left-down-duotone'
import { ArrowElbowLeftDownFill } from '../fill/arrow-elbow-left-down-fill'
import { ArrowElbowLeftDownLight } from '../light/arrow-elbow-left-down-light'
import { ArrowElbowLeftDownRegular } from '../regular/arrow-elbow-left-down-regular'
import { ArrowElbowLeftDownThin } from '../thin/arrow-elbow-left-down-thin'

const weightMap = {
  regular: ArrowElbowLeftDownRegular,
  bold: ArrowElbowLeftDownBold,
  duotone: ArrowElbowLeftDownDuotone,
  fill: ArrowElbowLeftDownFill,
  light: ArrowElbowLeftDownLight,
  thin: ArrowElbowLeftDownThin,
} as const

export const ArrowElbowLeftDown = (props: IconProps) => {
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
