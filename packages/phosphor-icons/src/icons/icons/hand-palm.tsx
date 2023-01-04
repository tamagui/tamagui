import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandPalmBold } from '../bold/hand-palm-bold'
import { HandPalmDuotone } from '../duotone/hand-palm-duotone'
import { HandPalmFill } from '../fill/hand-palm-fill'
import { HandPalmLight } from '../light/hand-palm-light'
import { HandPalmRegular } from '../regular/hand-palm-regular'
import { HandPalmThin } from '../thin/hand-palm-thin'

const weightMap = {
  regular: HandPalmRegular,
  bold: HandPalmBold,
  duotone: HandPalmDuotone,
  fill: HandPalmFill,
  light: HandPalmLight,
  thin: HandPalmThin,
} as const

export const HandPalm = (props: IconProps) => {
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
