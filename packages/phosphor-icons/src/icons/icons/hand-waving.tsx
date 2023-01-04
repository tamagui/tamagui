import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandWavingBold } from '../bold/hand-waving-bold'
import { HandWavingDuotone } from '../duotone/hand-waving-duotone'
import { HandWavingFill } from '../fill/hand-waving-fill'
import { HandWavingLight } from '../light/hand-waving-light'
import { HandWavingRegular } from '../regular/hand-waving-regular'
import { HandWavingThin } from '../thin/hand-waving-thin'

const weightMap = {
  regular: HandWavingRegular,
  bold: HandWavingBold,
  duotone: HandWavingDuotone,
  fill: HandWavingFill,
  light: HandWavingLight,
  thin: HandWavingThin,
} as const

export const HandWaving = (props: IconProps) => {
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
