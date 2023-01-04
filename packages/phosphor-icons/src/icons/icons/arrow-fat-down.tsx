import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatDownBold } from '../bold/arrow-fat-down-bold'
import { ArrowFatDownDuotone } from '../duotone/arrow-fat-down-duotone'
import { ArrowFatDownFill } from '../fill/arrow-fat-down-fill'
import { ArrowFatDownLight } from '../light/arrow-fat-down-light'
import { ArrowFatDownRegular } from '../regular/arrow-fat-down-regular'
import { ArrowFatDownThin } from '../thin/arrow-fat-down-thin'

const weightMap = {
  regular: ArrowFatDownRegular,
  bold: ArrowFatDownBold,
  duotone: ArrowFatDownDuotone,
  fill: ArrowFatDownFill,
  light: ArrowFatDownLight,
  thin: ArrowFatDownThin,
} as const

export const ArrowFatDown = (props: IconProps) => {
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
