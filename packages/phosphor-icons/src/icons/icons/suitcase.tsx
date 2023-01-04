import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SuitcaseBold } from '../bold/suitcase-bold'
import { SuitcaseDuotone } from '../duotone/suitcase-duotone'
import { SuitcaseFill } from '../fill/suitcase-fill'
import { SuitcaseLight } from '../light/suitcase-light'
import { SuitcaseRegular } from '../regular/suitcase-regular'
import { SuitcaseThin } from '../thin/suitcase-thin'

const weightMap = {
  regular: SuitcaseRegular,
  bold: SuitcaseBold,
  duotone: SuitcaseDuotone,
  fill: SuitcaseFill,
  light: SuitcaseLight,
  thin: SuitcaseThin,
} as const

export const Suitcase = (props: IconProps) => {
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
