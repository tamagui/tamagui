import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleDownBold } from '../bold/arrow-circle-down-bold'
import { ArrowCircleDownDuotone } from '../duotone/arrow-circle-down-duotone'
import { ArrowCircleDownFill } from '../fill/arrow-circle-down-fill'
import { ArrowCircleDownLight } from '../light/arrow-circle-down-light'
import { ArrowCircleDownRegular } from '../regular/arrow-circle-down-regular'
import { ArrowCircleDownThin } from '../thin/arrow-circle-down-thin'

const weightMap = {
  regular: ArrowCircleDownRegular,
  bold: ArrowCircleDownBold,
  duotone: ArrowCircleDownDuotone,
  fill: ArrowCircleDownFill,
  light: ArrowCircleDownLight,
  thin: ArrowCircleDownThin,
} as const

export const ArrowCircleDown = (props: IconProps) => {
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
