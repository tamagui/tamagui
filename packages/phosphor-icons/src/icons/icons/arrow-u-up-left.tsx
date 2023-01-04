import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUUpLeftBold } from '../bold/arrow-u-up-left-bold'
import { ArrowUUpLeftDuotone } from '../duotone/arrow-u-up-left-duotone'
import { ArrowUUpLeftFill } from '../fill/arrow-u-up-left-fill'
import { ArrowUUpLeftLight } from '../light/arrow-u-up-left-light'
import { ArrowUUpLeftRegular } from '../regular/arrow-u-up-left-regular'
import { ArrowUUpLeftThin } from '../thin/arrow-u-up-left-thin'

const weightMap = {
  regular: ArrowUUpLeftRegular,
  bold: ArrowUUpLeftBold,
  duotone: ArrowUUpLeftDuotone,
  fill: ArrowUUpLeftFill,
  light: ArrowUUpLeftLight,
  thin: ArrowUUpLeftThin,
} as const

export const ArrowUUpLeft = (props: IconProps) => {
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
