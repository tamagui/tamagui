import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareLeftBold } from '../bold/arrow-square-left-bold'
import { ArrowSquareLeftDuotone } from '../duotone/arrow-square-left-duotone'
import { ArrowSquareLeftFill } from '../fill/arrow-square-left-fill'
import { ArrowSquareLeftLight } from '../light/arrow-square-left-light'
import { ArrowSquareLeftRegular } from '../regular/arrow-square-left-regular'
import { ArrowSquareLeftThin } from '../thin/arrow-square-left-thin'

const weightMap = {
  regular: ArrowSquareLeftRegular,
  bold: ArrowSquareLeftBold,
  duotone: ArrowSquareLeftDuotone,
  fill: ArrowSquareLeftFill,
  light: ArrowSquareLeftLight,
  thin: ArrowSquareLeftThin,
} as const

export const ArrowSquareLeft = (props: IconProps) => {
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
