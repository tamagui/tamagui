import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MaskHappyBold } from '../bold/mask-happy-bold'
import { MaskHappyDuotone } from '../duotone/mask-happy-duotone'
import { MaskHappyFill } from '../fill/mask-happy-fill'
import { MaskHappyLight } from '../light/mask-happy-light'
import { MaskHappyRegular } from '../regular/mask-happy-regular'
import { MaskHappyThin } from '../thin/mask-happy-thin'

const weightMap = {
  regular: MaskHappyRegular,
  bold: MaskHappyBold,
  duotone: MaskHappyDuotone,
  fill: MaskHappyFill,
  light: MaskHappyLight,
  thin: MaskHappyThin,
} as const

export const MaskHappy = (props: IconProps) => {
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
