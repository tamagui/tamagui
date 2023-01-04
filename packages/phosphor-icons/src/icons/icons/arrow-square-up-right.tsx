import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareUpRightBold } from '../bold/arrow-square-up-right-bold'
import { ArrowSquareUpRightDuotone } from '../duotone/arrow-square-up-right-duotone'
import { ArrowSquareUpRightFill } from '../fill/arrow-square-up-right-fill'
import { ArrowSquareUpRightLight } from '../light/arrow-square-up-right-light'
import { ArrowSquareUpRightRegular } from '../regular/arrow-square-up-right-regular'
import { ArrowSquareUpRightThin } from '../thin/arrow-square-up-right-thin'

const weightMap = {
  regular: ArrowSquareUpRightRegular,
  bold: ArrowSquareUpRightBold,
  duotone: ArrowSquareUpRightDuotone,
  fill: ArrowSquareUpRightFill,
  light: ArrowSquareUpRightLight,
  thin: ArrowSquareUpRightThin,
} as const

export const ArrowSquareUpRight = (props: IconProps) => {
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
