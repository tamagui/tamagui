import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareUpLeftBold } from '../bold/arrow-square-up-left-bold'
import { ArrowSquareUpLeftDuotone } from '../duotone/arrow-square-up-left-duotone'
import { ArrowSquareUpLeftFill } from '../fill/arrow-square-up-left-fill'
import { ArrowSquareUpLeftLight } from '../light/arrow-square-up-left-light'
import { ArrowSquareUpLeftRegular } from '../regular/arrow-square-up-left-regular'
import { ArrowSquareUpLeftThin } from '../thin/arrow-square-up-left-thin'

const weightMap = {
  regular: ArrowSquareUpLeftRegular,
  bold: ArrowSquareUpLeftBold,
  duotone: ArrowSquareUpLeftDuotone,
  fill: ArrowSquareUpLeftFill,
  light: ArrowSquareUpLeftLight,
  thin: ArrowSquareUpLeftThin,
} as const

export const ArrowSquareUpLeft = (props: IconProps) => {
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
