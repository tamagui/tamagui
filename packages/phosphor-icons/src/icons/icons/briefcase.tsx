import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BriefcaseBold } from '../bold/briefcase-bold'
import { BriefcaseDuotone } from '../duotone/briefcase-duotone'
import { BriefcaseFill } from '../fill/briefcase-fill'
import { BriefcaseLight } from '../light/briefcase-light'
import { BriefcaseRegular } from '../regular/briefcase-regular'
import { BriefcaseThin } from '../thin/briefcase-thin'

const weightMap = {
  regular: BriefcaseRegular,
  bold: BriefcaseBold,
  duotone: BriefcaseDuotone,
  fill: BriefcaseFill,
  light: BriefcaseLight,
  thin: BriefcaseThin,
} as const

export const Briefcase = (props: IconProps) => {
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
