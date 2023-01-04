import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareUpBold } from '../bold/arrow-square-up-bold'
import { ArrowSquareUpDuotone } from '../duotone/arrow-square-up-duotone'
import { ArrowSquareUpFill } from '../fill/arrow-square-up-fill'
import { ArrowSquareUpLight } from '../light/arrow-square-up-light'
import { ArrowSquareUpRegular } from '../regular/arrow-square-up-regular'
import { ArrowSquareUpThin } from '../thin/arrow-square-up-thin'

const weightMap = {
  regular: ArrowSquareUpRegular,
  bold: ArrowSquareUpBold,
  duotone: ArrowSquareUpDuotone,
  fill: ArrowSquareUpFill,
  light: ArrowSquareUpLight,
  thin: ArrowSquareUpThin,
} as const

export const ArrowSquareUp = (props: IconProps) => {
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
