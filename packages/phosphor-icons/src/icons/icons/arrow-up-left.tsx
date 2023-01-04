import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUpLeftBold } from '../bold/arrow-up-left-bold'
import { ArrowUpLeftDuotone } from '../duotone/arrow-up-left-duotone'
import { ArrowUpLeftFill } from '../fill/arrow-up-left-fill'
import { ArrowUpLeftLight } from '../light/arrow-up-left-light'
import { ArrowUpLeftRegular } from '../regular/arrow-up-left-regular'
import { ArrowUpLeftThin } from '../thin/arrow-up-left-thin'

const weightMap = {
  regular: ArrowUpLeftRegular,
  bold: ArrowUpLeftBold,
  duotone: ArrowUpLeftDuotone,
  fill: ArrowUpLeftFill,
  light: ArrowUpLeftLight,
  thin: ArrowUpLeftThin,
} as const

export const ArrowUpLeft = (props: IconProps) => {
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
