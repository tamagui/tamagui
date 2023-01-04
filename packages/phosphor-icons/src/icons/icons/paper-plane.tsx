import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaperPlaneBold } from '../bold/paper-plane-bold'
import { PaperPlaneDuotone } from '../duotone/paper-plane-duotone'
import { PaperPlaneFill } from '../fill/paper-plane-fill'
import { PaperPlaneLight } from '../light/paper-plane-light'
import { PaperPlaneRegular } from '../regular/paper-plane-regular'
import { PaperPlaneThin } from '../thin/paper-plane-thin'

const weightMap = {
  regular: PaperPlaneRegular,
  bold: PaperPlaneBold,
  duotone: PaperPlaneDuotone,
  fill: PaperPlaneFill,
  light: PaperPlaneLight,
  thin: PaperPlaneThin,
} as const

export const PaperPlane = (props: IconProps) => {
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
