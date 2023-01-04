import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShuffleAngularBold } from '../bold/shuffle-angular-bold'
import { ShuffleAngularDuotone } from '../duotone/shuffle-angular-duotone'
import { ShuffleAngularFill } from '../fill/shuffle-angular-fill'
import { ShuffleAngularLight } from '../light/shuffle-angular-light'
import { ShuffleAngularRegular } from '../regular/shuffle-angular-regular'
import { ShuffleAngularThin } from '../thin/shuffle-angular-thin'

const weightMap = {
  regular: ShuffleAngularRegular,
  bold: ShuffleAngularBold,
  duotone: ShuffleAngularDuotone,
  fill: ShuffleAngularFill,
  light: ShuffleAngularLight,
  thin: ShuffleAngularThin,
} as const

export const ShuffleAngular = (props: IconProps) => {
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
