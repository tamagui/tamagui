import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SkipBackBold } from '../bold/skip-back-bold'
import { SkipBackDuotone } from '../duotone/skip-back-duotone'
import { SkipBackFill } from '../fill/skip-back-fill'
import { SkipBackLight } from '../light/skip-back-light'
import { SkipBackRegular } from '../regular/skip-back-regular'
import { SkipBackThin } from '../thin/skip-back-thin'

const weightMap = {
  regular: SkipBackRegular,
  bold: SkipBackBold,
  duotone: SkipBackDuotone,
  fill: SkipBackFill,
  light: SkipBackLight,
  thin: SkipBackThin,
} as const

export const SkipBack = (props: IconProps) => {
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
