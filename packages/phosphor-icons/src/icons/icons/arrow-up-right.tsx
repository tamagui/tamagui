import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUpRightBold } from '../bold/arrow-up-right-bold'
import { ArrowUpRightDuotone } from '../duotone/arrow-up-right-duotone'
import { ArrowUpRightFill } from '../fill/arrow-up-right-fill'
import { ArrowUpRightLight } from '../light/arrow-up-right-light'
import { ArrowUpRightRegular } from '../regular/arrow-up-right-regular'
import { ArrowUpRightThin } from '../thin/arrow-up-right-thin'

const weightMap = {
  regular: ArrowUpRightRegular,
  bold: ArrowUpRightBold,
  duotone: ArrowUpRightDuotone,
  fill: ArrowUpRightFill,
  light: ArrowUpRightLight,
  thin: ArrowUpRightThin,
} as const

export const ArrowUpRight = (props: IconProps) => {
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
