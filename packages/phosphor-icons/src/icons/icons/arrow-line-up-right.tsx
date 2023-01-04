import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineUpRightBold } from '../bold/arrow-line-up-right-bold'
import { ArrowLineUpRightDuotone } from '../duotone/arrow-line-up-right-duotone'
import { ArrowLineUpRightFill } from '../fill/arrow-line-up-right-fill'
import { ArrowLineUpRightLight } from '../light/arrow-line-up-right-light'
import { ArrowLineUpRightRegular } from '../regular/arrow-line-up-right-regular'
import { ArrowLineUpRightThin } from '../thin/arrow-line-up-right-thin'

const weightMap = {
  regular: ArrowLineUpRightRegular,
  bold: ArrowLineUpRightBold,
  duotone: ArrowLineUpRightDuotone,
  fill: ArrowLineUpRightFill,
  light: ArrowLineUpRightLight,
  thin: ArrowLineUpRightThin,
} as const

export const ArrowLineUpRight = (props: IconProps) => {
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
