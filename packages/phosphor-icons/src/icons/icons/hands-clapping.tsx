import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandsClappingBold } from '../bold/hands-clapping-bold'
import { HandsClappingDuotone } from '../duotone/hands-clapping-duotone'
import { HandsClappingFill } from '../fill/hands-clapping-fill'
import { HandsClappingLight } from '../light/hands-clapping-light'
import { HandsClappingRegular } from '../regular/hands-clapping-regular'
import { HandsClappingThin } from '../thin/hands-clapping-thin'

const weightMap = {
  regular: HandsClappingRegular,
  bold: HandsClappingBold,
  duotone: HandsClappingDuotone,
  fill: HandsClappingFill,
  light: HandsClappingLight,
  thin: HandsClappingThin,
} as const

export const HandsClapping = (props: IconProps) => {
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
