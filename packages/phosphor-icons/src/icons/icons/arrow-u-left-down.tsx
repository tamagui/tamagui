import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowULeftDownBold } from '../bold/arrow-u-left-down-bold'
import { ArrowULeftDownDuotone } from '../duotone/arrow-u-left-down-duotone'
import { ArrowULeftDownFill } from '../fill/arrow-u-left-down-fill'
import { ArrowULeftDownLight } from '../light/arrow-u-left-down-light'
import { ArrowULeftDownRegular } from '../regular/arrow-u-left-down-regular'
import { ArrowULeftDownThin } from '../thin/arrow-u-left-down-thin'

const weightMap = {
  regular: ArrowULeftDownRegular,
  bold: ArrowULeftDownBold,
  duotone: ArrowULeftDownDuotone,
  fill: ArrowULeftDownFill,
  light: ArrowULeftDownLight,
  thin: ArrowULeftDownThin,
} as const

export const ArrowULeftDown = (props: IconProps) => {
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
