import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderNeuterBold } from '../bold/gender-neuter-bold'
import { GenderNeuterDuotone } from '../duotone/gender-neuter-duotone'
import { GenderNeuterFill } from '../fill/gender-neuter-fill'
import { GenderNeuterLight } from '../light/gender-neuter-light'
import { GenderNeuterRegular } from '../regular/gender-neuter-regular'
import { GenderNeuterThin } from '../thin/gender-neuter-thin'

const weightMap = {
  regular: GenderNeuterRegular,
  bold: GenderNeuterBold,
  duotone: GenderNeuterDuotone,
  fill: GenderNeuterFill,
  light: GenderNeuterLight,
  thin: GenderNeuterThin,
} as const

export const GenderNeuter = (props: IconProps) => {
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
