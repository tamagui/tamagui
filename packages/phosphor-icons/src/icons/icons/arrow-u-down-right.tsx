import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUDownRightBold } from '../bold/arrow-u-down-right-bold'
import { ArrowUDownRightDuotone } from '../duotone/arrow-u-down-right-duotone'
import { ArrowUDownRightFill } from '../fill/arrow-u-down-right-fill'
import { ArrowUDownRightLight } from '../light/arrow-u-down-right-light'
import { ArrowUDownRightRegular } from '../regular/arrow-u-down-right-regular'
import { ArrowUDownRightThin } from '../thin/arrow-u-down-right-thin'

const weightMap = {
  regular: ArrowUDownRightRegular,
  bold: ArrowUDownRightBold,
  duotone: ArrowUDownRightDuotone,
  fill: ArrowUDownRightFill,
  light: ArrowUDownRightLight,
  thin: ArrowUDownRightThin,
} as const

export const ArrowUDownRight = (props: IconProps) => {
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
