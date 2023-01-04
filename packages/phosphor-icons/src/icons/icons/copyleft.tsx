import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CopyleftBold } from '../bold/copyleft-bold'
import { CopyleftDuotone } from '../duotone/copyleft-duotone'
import { CopyleftFill } from '../fill/copyleft-fill'
import { CopyleftLight } from '../light/copyleft-light'
import { CopyleftRegular } from '../regular/copyleft-regular'
import { CopyleftThin } from '../thin/copyleft-thin'

const weightMap = {
  regular: CopyleftRegular,
  bold: CopyleftBold,
  duotone: CopyleftDuotone,
  fill: CopyleftFill,
  light: CopyleftLight,
  thin: CopyleftThin,
} as const

export const Copyleft = (props: IconProps) => {
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
