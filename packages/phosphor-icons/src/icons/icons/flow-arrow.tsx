import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlowArrowBold } from '../bold/flow-arrow-bold'
import { FlowArrowDuotone } from '../duotone/flow-arrow-duotone'
import { FlowArrowFill } from '../fill/flow-arrow-fill'
import { FlowArrowLight } from '../light/flow-arrow-light'
import { FlowArrowRegular } from '../regular/flow-arrow-regular'
import { FlowArrowThin } from '../thin/flow-arrow-thin'

const weightMap = {
  regular: FlowArrowRegular,
  bold: FlowArrowBold,
  duotone: FlowArrowDuotone,
  fill: FlowArrowFill,
  light: FlowArrowLight,
  thin: FlowArrowThin,
} as const

export const FlowArrow = (props: IconProps) => {
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
