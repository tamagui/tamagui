import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUDownLeftBold } from '../bold/arrow-u-down-left-bold'
import { ArrowUDownLeftDuotone } from '../duotone/arrow-u-down-left-duotone'
import { ArrowUDownLeftFill } from '../fill/arrow-u-down-left-fill'
import { ArrowUDownLeftLight } from '../light/arrow-u-down-left-light'
import { ArrowUDownLeftRegular } from '../regular/arrow-u-down-left-regular'
import { ArrowUDownLeftThin } from '../thin/arrow-u-down-left-thin'

const weightMap = {
  regular: ArrowUDownLeftRegular,
  bold: ArrowUDownLeftBold,
  duotone: ArrowUDownLeftDuotone,
  fill: ArrowUDownLeftFill,
  light: ArrowUDownLeftLight,
  thin: ArrowUDownLeftThin,
} as const

export const ArrowUDownLeft = (props: IconProps) => {
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
