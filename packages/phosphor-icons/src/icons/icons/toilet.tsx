import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToiletBold } from '../bold/toilet-bold'
import { ToiletDuotone } from '../duotone/toilet-duotone'
import { ToiletFill } from '../fill/toilet-fill'
import { ToiletLight } from '../light/toilet-light'
import { ToiletRegular } from '../regular/toilet-regular'
import { ToiletThin } from '../thin/toilet-thin'

const weightMap = {
  regular: ToiletRegular,
  bold: ToiletBold,
  duotone: ToiletDuotone,
  fill: ToiletFill,
  light: ToiletLight,
  thin: ToiletThin,
} as const

export const Toilet = (props: IconProps) => {
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
