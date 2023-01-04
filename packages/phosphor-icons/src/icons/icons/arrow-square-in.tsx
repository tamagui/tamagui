import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareInBold } from '../bold/arrow-square-in-bold'
import { ArrowSquareInDuotone } from '../duotone/arrow-square-in-duotone'
import { ArrowSquareInFill } from '../fill/arrow-square-in-fill'
import { ArrowSquareInLight } from '../light/arrow-square-in-light'
import { ArrowSquareInRegular } from '../regular/arrow-square-in-regular'
import { ArrowSquareInThin } from '../thin/arrow-square-in-thin'

const weightMap = {
  regular: ArrowSquareInRegular,
  bold: ArrowSquareInBold,
  duotone: ArrowSquareInDuotone,
  fill: ArrowSquareInFill,
  light: ArrowSquareInLight,
  thin: ArrowSquareInThin,
} as const

export const ArrowSquareIn = (props: IconProps) => {
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
