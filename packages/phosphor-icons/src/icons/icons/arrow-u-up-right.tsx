import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUUpRightBold } from '../bold/arrow-u-up-right-bold'
import { ArrowUUpRightDuotone } from '../duotone/arrow-u-up-right-duotone'
import { ArrowUUpRightFill } from '../fill/arrow-u-up-right-fill'
import { ArrowUUpRightLight } from '../light/arrow-u-up-right-light'
import { ArrowUUpRightRegular } from '../regular/arrow-u-up-right-regular'
import { ArrowUUpRightThin } from '../thin/arrow-u-up-right-thin'

const weightMap = {
  regular: ArrowUUpRightRegular,
  bold: ArrowUUpRightBold,
  duotone: ArrowUUpRightDuotone,
  fill: ArrowUUpRightFill,
  light: ArrowUUpRightLight,
  thin: ArrowUUpRightThin,
} as const

export const ArrowUUpRight = (props: IconProps) => {
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
