import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { InfoBold } from '../bold/info-bold'
import { InfoDuotone } from '../duotone/info-duotone'
import { InfoFill } from '../fill/info-fill'
import { InfoLight } from '../light/info-light'
import { InfoRegular } from '../regular/info-regular'
import { InfoThin } from '../thin/info-thin'

const weightMap = {
  regular: InfoRegular,
  bold: InfoBold,
  duotone: InfoDuotone,
  fill: InfoFill,
  light: InfoLight,
  thin: InfoThin,
} as const

export const Info = (props: IconProps) => {
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
