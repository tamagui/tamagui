import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineUpLeftBold } from '../bold/arrow-line-up-left-bold'
import { ArrowLineUpLeftDuotone } from '../duotone/arrow-line-up-left-duotone'
import { ArrowLineUpLeftFill } from '../fill/arrow-line-up-left-fill'
import { ArrowLineUpLeftLight } from '../light/arrow-line-up-left-light'
import { ArrowLineUpLeftRegular } from '../regular/arrow-line-up-left-regular'
import { ArrowLineUpLeftThin } from '../thin/arrow-line-up-left-thin'

const weightMap = {
  regular: ArrowLineUpLeftRegular,
  bold: ArrowLineUpLeftBold,
  duotone: ArrowLineUpLeftDuotone,
  fill: ArrowLineUpLeftFill,
  light: ArrowLineUpLeftLight,
  thin: ArrowLineUpLeftThin,
} as const

export const ArrowLineUpLeft = (props: IconProps) => {
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
