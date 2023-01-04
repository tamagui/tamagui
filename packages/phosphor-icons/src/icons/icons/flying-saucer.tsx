import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlyingSaucerBold } from '../bold/flying-saucer-bold'
import { FlyingSaucerDuotone } from '../duotone/flying-saucer-duotone'
import { FlyingSaucerFill } from '../fill/flying-saucer-fill'
import { FlyingSaucerLight } from '../light/flying-saucer-light'
import { FlyingSaucerRegular } from '../regular/flying-saucer-regular'
import { FlyingSaucerThin } from '../thin/flying-saucer-thin'

const weightMap = {
  regular: FlyingSaucerRegular,
  bold: FlyingSaucerBold,
  duotone: FlyingSaucerDuotone,
  fill: FlyingSaucerFill,
  light: FlyingSaucerLight,
  thin: FlyingSaucerThin,
} as const

export const FlyingSaucer = (props: IconProps) => {
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
