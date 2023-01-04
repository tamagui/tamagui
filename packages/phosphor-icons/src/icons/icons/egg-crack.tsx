import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EggCrackBold } from '../bold/egg-crack-bold'
import { EggCrackDuotone } from '../duotone/egg-crack-duotone'
import { EggCrackFill } from '../fill/egg-crack-fill'
import { EggCrackLight } from '../light/egg-crack-light'
import { EggCrackRegular } from '../regular/egg-crack-regular'
import { EggCrackThin } from '../thin/egg-crack-thin'

const weightMap = {
  regular: EggCrackRegular,
  bold: EggCrackBold,
  duotone: EggCrackDuotone,
  fill: EggCrackFill,
  light: EggCrackLight,
  thin: EggCrackThin,
} as const

export const EggCrack = (props: IconProps) => {
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
