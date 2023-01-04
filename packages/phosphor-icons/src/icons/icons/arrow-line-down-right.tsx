import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineDownRightBold } from '../bold/arrow-line-down-right-bold'
import { ArrowLineDownRightDuotone } from '../duotone/arrow-line-down-right-duotone'
import { ArrowLineDownRightFill } from '../fill/arrow-line-down-right-fill'
import { ArrowLineDownRightLight } from '../light/arrow-line-down-right-light'
import { ArrowLineDownRightRegular } from '../regular/arrow-line-down-right-regular'
import { ArrowLineDownRightThin } from '../thin/arrow-line-down-right-thin'

const weightMap = {
  regular: ArrowLineDownRightRegular,
  bold: ArrowLineDownRightBold,
  duotone: ArrowLineDownRightDuotone,
  fill: ArrowLineDownRightFill,
  light: ArrowLineDownRightLight,
  thin: ArrowLineDownRightThin,
} as const

export const ArrowLineDownRight = (props: IconProps) => {
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
