import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareDownRightBold } from '../bold/arrow-square-down-right-bold'
import { ArrowSquareDownRightDuotone } from '../duotone/arrow-square-down-right-duotone'
import { ArrowSquareDownRightFill } from '../fill/arrow-square-down-right-fill'
import { ArrowSquareDownRightLight } from '../light/arrow-square-down-right-light'
import { ArrowSquareDownRightRegular } from '../regular/arrow-square-down-right-regular'
import { ArrowSquareDownRightThin } from '../thin/arrow-square-down-right-thin'

const weightMap = {
  regular: ArrowSquareDownRightRegular,
  bold: ArrowSquareDownRightBold,
  duotone: ArrowSquareDownRightDuotone,
  fill: ArrowSquareDownRightFill,
  light: ArrowSquareDownRightLight,
  thin: ArrowSquareDownRightThin,
} as const

export const ArrowSquareDownRight = (props: IconProps) => {
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
