import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendLeftDownBold } from '../bold/arrow-bend-left-down-bold'
import { ArrowBendLeftDownDuotone } from '../duotone/arrow-bend-left-down-duotone'
import { ArrowBendLeftDownFill } from '../fill/arrow-bend-left-down-fill'
import { ArrowBendLeftDownLight } from '../light/arrow-bend-left-down-light'
import { ArrowBendLeftDownRegular } from '../regular/arrow-bend-left-down-regular'
import { ArrowBendLeftDownThin } from '../thin/arrow-bend-left-down-thin'

const weightMap = {
  regular: ArrowBendLeftDownRegular,
  bold: ArrowBendLeftDownBold,
  duotone: ArrowBendLeftDownDuotone,
  fill: ArrowBendLeftDownFill,
  light: ArrowBendLeftDownLight,
  thin: ArrowBendLeftDownThin,
} as const

export const ArrowBendLeftDown = (props: IconProps) => {
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
