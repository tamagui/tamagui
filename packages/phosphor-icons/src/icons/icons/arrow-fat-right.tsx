import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatRightBold } from '../bold/arrow-fat-right-bold'
import { ArrowFatRightDuotone } from '../duotone/arrow-fat-right-duotone'
import { ArrowFatRightFill } from '../fill/arrow-fat-right-fill'
import { ArrowFatRightLight } from '../light/arrow-fat-right-light'
import { ArrowFatRightRegular } from '../regular/arrow-fat-right-regular'
import { ArrowFatRightThin } from '../thin/arrow-fat-right-thin'

const weightMap = {
  regular: ArrowFatRightRegular,
  bold: ArrowFatRightBold,
  duotone: ArrowFatRightDuotone,
  fill: ArrowFatRightFill,
  light: ArrowFatRightLight,
  thin: ArrowFatRightThin,
} as const

export const ArrowFatRight = (props: IconProps) => {
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
