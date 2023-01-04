import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowDownRightBold } from '../bold/arrow-down-right-bold'
import { ArrowDownRightDuotone } from '../duotone/arrow-down-right-duotone'
import { ArrowDownRightFill } from '../fill/arrow-down-right-fill'
import { ArrowDownRightLight } from '../light/arrow-down-right-light'
import { ArrowDownRightRegular } from '../regular/arrow-down-right-regular'
import { ArrowDownRightThin } from '../thin/arrow-down-right-thin'

const weightMap = {
  regular: ArrowDownRightRegular,
  bold: ArrowDownRightBold,
  duotone: ArrowDownRightDuotone,
  fill: ArrowDownRightFill,
  light: ArrowDownRightLight,
  thin: ArrowDownRightThin,
} as const

export const ArrowDownRight = (props: IconProps) => {
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
