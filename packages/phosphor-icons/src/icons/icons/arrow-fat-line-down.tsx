import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLineDownBold } from '../bold/arrow-fat-line-down-bold'
import { ArrowFatLineDownDuotone } from '../duotone/arrow-fat-line-down-duotone'
import { ArrowFatLineDownFill } from '../fill/arrow-fat-line-down-fill'
import { ArrowFatLineDownLight } from '../light/arrow-fat-line-down-light'
import { ArrowFatLineDownRegular } from '../regular/arrow-fat-line-down-regular'
import { ArrowFatLineDownThin } from '../thin/arrow-fat-line-down-thin'

const weightMap = {
  regular: ArrowFatLineDownRegular,
  bold: ArrowFatLineDownBold,
  duotone: ArrowFatLineDownDuotone,
  fill: ArrowFatLineDownFill,
  light: ArrowFatLineDownLight,
  thin: ArrowFatLineDownThin,
} as const

export const ArrowFatLineDown = (props: IconProps) => {
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
