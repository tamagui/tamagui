import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BriefcaseMetalBold } from '../bold/briefcase-metal-bold'
import { BriefcaseMetalDuotone } from '../duotone/briefcase-metal-duotone'
import { BriefcaseMetalFill } from '../fill/briefcase-metal-fill'
import { BriefcaseMetalLight } from '../light/briefcase-metal-light'
import { BriefcaseMetalRegular } from '../regular/briefcase-metal-regular'
import { BriefcaseMetalThin } from '../thin/briefcase-metal-thin'

const weightMap = {
  regular: BriefcaseMetalRegular,
  bold: BriefcaseMetalBold,
  duotone: BriefcaseMetalDuotone,
  fill: BriefcaseMetalFill,
  light: BriefcaseMetalLight,
  thin: BriefcaseMetalThin,
} as const

export const BriefcaseMetal = (props: IconProps) => {
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
