import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PresentationBold } from '../bold/presentation-bold'
import { PresentationDuotone } from '../duotone/presentation-duotone'
import { PresentationFill } from '../fill/presentation-fill'
import { PresentationLight } from '../light/presentation-light'
import { PresentationRegular } from '../regular/presentation-regular'
import { PresentationThin } from '../thin/presentation-thin'

const weightMap = {
  regular: PresentationRegular,
  bold: PresentationBold,
  duotone: PresentationDuotone,
  fill: PresentationFill,
  light: PresentationLight,
  thin: PresentationThin,
} as const

export const Presentation = (props: IconProps) => {
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
