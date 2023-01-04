import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsDownUpBold } from '../bold/arrows-down-up-bold'
import { ArrowsDownUpDuotone } from '../duotone/arrows-down-up-duotone'
import { ArrowsDownUpFill } from '../fill/arrows-down-up-fill'
import { ArrowsDownUpLight } from '../light/arrows-down-up-light'
import { ArrowsDownUpRegular } from '../regular/arrows-down-up-regular'
import { ArrowsDownUpThin } from '../thin/arrows-down-up-thin'

const weightMap = {
  regular: ArrowsDownUpRegular,
  bold: ArrowsDownUpBold,
  duotone: ArrowsDownUpDuotone,
  fill: ArrowsDownUpFill,
  light: ArrowsDownUpLight,
  thin: ArrowsDownUpThin,
} as const

export const ArrowsDownUp = (props: IconProps) => {
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
