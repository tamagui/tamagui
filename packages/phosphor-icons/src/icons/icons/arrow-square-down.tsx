import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareDownBold } from '../bold/arrow-square-down-bold'
import { ArrowSquareDownDuotone } from '../duotone/arrow-square-down-duotone'
import { ArrowSquareDownFill } from '../fill/arrow-square-down-fill'
import { ArrowSquareDownLight } from '../light/arrow-square-down-light'
import { ArrowSquareDownRegular } from '../regular/arrow-square-down-regular'
import { ArrowSquareDownThin } from '../thin/arrow-square-down-thin'

const weightMap = {
  regular: ArrowSquareDownRegular,
  bold: ArrowSquareDownBold,
  duotone: ArrowSquareDownDuotone,
  fill: ArrowSquareDownFill,
  light: ArrowSquareDownLight,
  thin: ArrowSquareDownThin,
} as const

export const ArrowSquareDown = (props: IconProps) => {
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
