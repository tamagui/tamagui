import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaperPlaneTiltBold } from '../bold/paper-plane-tilt-bold'
import { PaperPlaneTiltDuotone } from '../duotone/paper-plane-tilt-duotone'
import { PaperPlaneTiltFill } from '../fill/paper-plane-tilt-fill'
import { PaperPlaneTiltLight } from '../light/paper-plane-tilt-light'
import { PaperPlaneTiltRegular } from '../regular/paper-plane-tilt-regular'
import { PaperPlaneTiltThin } from '../thin/paper-plane-tilt-thin'

const weightMap = {
  regular: PaperPlaneTiltRegular,
  bold: PaperPlaneTiltBold,
  duotone: PaperPlaneTiltDuotone,
  fill: PaperPlaneTiltFill,
  light: PaperPlaneTiltLight,
  thin: PaperPlaneTiltThin,
} as const

export const PaperPlaneTilt = (props: IconProps) => {
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
