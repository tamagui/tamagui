import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowURightDownBold } from '../bold/arrow-u-right-down-bold'
import { ArrowURightDownDuotone } from '../duotone/arrow-u-right-down-duotone'
import { ArrowURightDownFill } from '../fill/arrow-u-right-down-fill'
import { ArrowURightDownLight } from '../light/arrow-u-right-down-light'
import { ArrowURightDownRegular } from '../regular/arrow-u-right-down-regular'
import { ArrowURightDownThin } from '../thin/arrow-u-right-down-thin'

const weightMap = {
  regular: ArrowURightDownRegular,
  bold: ArrowURightDownBold,
  duotone: ArrowURightDownDuotone,
  fill: ArrowURightDownFill,
  light: ArrowURightDownLight,
  thin: ArrowURightDownThin,
} as const

export const ArrowURightDown = (props: IconProps) => {
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
