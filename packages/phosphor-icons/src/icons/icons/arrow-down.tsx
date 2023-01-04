import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowDownBold } from '../bold/arrow-down-bold'
import { ArrowDownDuotone } from '../duotone/arrow-down-duotone'
import { ArrowDownFill } from '../fill/arrow-down-fill'
import { ArrowDownLight } from '../light/arrow-down-light'
import { ArrowDownRegular } from '../regular/arrow-down-regular'
import { ArrowDownThin } from '../thin/arrow-down-thin'

const weightMap = {
  regular: ArrowDownRegular,
  bold: ArrowDownBold,
  duotone: ArrowDownDuotone,
  fill: ArrowDownFill,
  light: ArrowDownLight,
  thin: ArrowDownThin,
} as const

export const ArrowDown = (props: IconProps) => {
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
