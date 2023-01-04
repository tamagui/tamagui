import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowURightUpBold } from '../bold/arrow-u-right-up-bold'
import { ArrowURightUpDuotone } from '../duotone/arrow-u-right-up-duotone'
import { ArrowURightUpFill } from '../fill/arrow-u-right-up-fill'
import { ArrowURightUpLight } from '../light/arrow-u-right-up-light'
import { ArrowURightUpRegular } from '../regular/arrow-u-right-up-regular'
import { ArrowURightUpThin } from '../thin/arrow-u-right-up-thin'

const weightMap = {
  regular: ArrowURightUpRegular,
  bold: ArrowURightUpBold,
  duotone: ArrowURightUpDuotone,
  fill: ArrowURightUpFill,
  light: ArrowURightUpLight,
  thin: ArrowURightUpThin,
} as const

export const ArrowURightUp = (props: IconProps) => {
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
