import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FirstAidBold } from '../bold/first-aid-bold'
import { FirstAidDuotone } from '../duotone/first-aid-duotone'
import { FirstAidFill } from '../fill/first-aid-fill'
import { FirstAidLight } from '../light/first-aid-light'
import { FirstAidRegular } from '../regular/first-aid-regular'
import { FirstAidThin } from '../thin/first-aid-thin'

const weightMap = {
  regular: FirstAidRegular,
  bold: FirstAidBold,
  duotone: FirstAidDuotone,
  fill: FirstAidFill,
  light: FirstAidLight,
  thin: FirstAidThin,
} as const

export const FirstAid = (props: IconProps) => {
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
