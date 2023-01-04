import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareRightBold } from '../bold/arrow-square-right-bold'
import { ArrowSquareRightDuotone } from '../duotone/arrow-square-right-duotone'
import { ArrowSquareRightFill } from '../fill/arrow-square-right-fill'
import { ArrowSquareRightLight } from '../light/arrow-square-right-light'
import { ArrowSquareRightRegular } from '../regular/arrow-square-right-regular'
import { ArrowSquareRightThin } from '../thin/arrow-square-right-thin'

const weightMap = {
  regular: ArrowSquareRightRegular,
  bold: ArrowSquareRightBold,
  duotone: ArrowSquareRightDuotone,
  fill: ArrowSquareRightFill,
  light: ArrowSquareRightLight,
  thin: ArrowSquareRightThin,
} as const

export const ArrowSquareRight = (props: IconProps) => {
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
