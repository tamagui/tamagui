import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineRightBold } from '../bold/arrow-line-right-bold'
import { ArrowLineRightDuotone } from '../duotone/arrow-line-right-duotone'
import { ArrowLineRightFill } from '../fill/arrow-line-right-fill'
import { ArrowLineRightLight } from '../light/arrow-line-right-light'
import { ArrowLineRightRegular } from '../regular/arrow-line-right-regular'
import { ArrowLineRightThin } from '../thin/arrow-line-right-thin'

const weightMap = {
  regular: ArrowLineRightRegular,
  bold: ArrowLineRightBold,
  duotone: ArrowLineRightDuotone,
  fill: ArrowLineRightFill,
  light: ArrowLineRightLight,
  thin: ArrowLineRightThin,
} as const

export const ArrowLineRight = (props: IconProps) => {
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
