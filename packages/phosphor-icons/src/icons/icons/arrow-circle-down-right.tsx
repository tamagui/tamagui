import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleDownRightBold } from '../bold/arrow-circle-down-right-bold'
import { ArrowCircleDownRightDuotone } from '../duotone/arrow-circle-down-right-duotone'
import { ArrowCircleDownRightFill } from '../fill/arrow-circle-down-right-fill'
import { ArrowCircleDownRightLight } from '../light/arrow-circle-down-right-light'
import { ArrowCircleDownRightRegular } from '../regular/arrow-circle-down-right-regular'
import { ArrowCircleDownRightThin } from '../thin/arrow-circle-down-right-thin'

const weightMap = {
  regular: ArrowCircleDownRightRegular,
  bold: ArrowCircleDownRightBold,
  duotone: ArrowCircleDownRightDuotone,
  fill: ArrowCircleDownRightFill,
  light: ArrowCircleDownRightLight,
  thin: ArrowCircleDownRightThin,
} as const

export const ArrowCircleDownRight = (props: IconProps) => {
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
