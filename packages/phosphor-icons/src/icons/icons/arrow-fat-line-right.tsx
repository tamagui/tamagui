import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLineRightBold } from '../bold/arrow-fat-line-right-bold'
import { ArrowFatLineRightDuotone } from '../duotone/arrow-fat-line-right-duotone'
import { ArrowFatLineRightFill } from '../fill/arrow-fat-line-right-fill'
import { ArrowFatLineRightLight } from '../light/arrow-fat-line-right-light'
import { ArrowFatLineRightRegular } from '../regular/arrow-fat-line-right-regular'
import { ArrowFatLineRightThin } from '../thin/arrow-fat-line-right-thin'

const weightMap = {
  regular: ArrowFatLineRightRegular,
  bold: ArrowFatLineRightBold,
  duotone: ArrowFatLineRightDuotone,
  fill: ArrowFatLineRightFill,
  light: ArrowFatLineRightLight,
  thin: ArrowFatLineRightThin,
} as const

export const ArrowFatLineRight = (props: IconProps) => {
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
