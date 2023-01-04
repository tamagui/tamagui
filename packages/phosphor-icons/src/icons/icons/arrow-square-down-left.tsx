import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareDownLeftBold } from '../bold/arrow-square-down-left-bold'
import { ArrowSquareDownLeftDuotone } from '../duotone/arrow-square-down-left-duotone'
import { ArrowSquareDownLeftFill } from '../fill/arrow-square-down-left-fill'
import { ArrowSquareDownLeftLight } from '../light/arrow-square-down-left-light'
import { ArrowSquareDownLeftRegular } from '../regular/arrow-square-down-left-regular'
import { ArrowSquareDownLeftThin } from '../thin/arrow-square-down-left-thin'

const weightMap = {
  regular: ArrowSquareDownLeftRegular,
  bold: ArrowSquareDownLeftBold,
  duotone: ArrowSquareDownLeftDuotone,
  fill: ArrowSquareDownLeftFill,
  light: ArrowSquareDownLeftLight,
  thin: ArrowSquareDownLeftThin,
} as const

export const ArrowSquareDownLeft = (props: IconProps) => {
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
