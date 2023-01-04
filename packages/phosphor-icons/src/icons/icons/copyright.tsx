import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CopyrightBold } from '../bold/copyright-bold'
import { CopyrightDuotone } from '../duotone/copyright-duotone'
import { CopyrightFill } from '../fill/copyright-fill'
import { CopyrightLight } from '../light/copyright-light'
import { CopyrightRegular } from '../regular/copyright-regular'
import { CopyrightThin } from '../thin/copyright-thin'

const weightMap = {
  regular: CopyrightRegular,
  bold: CopyrightBold,
  duotone: CopyrightDuotone,
  fill: CopyrightFill,
  light: CopyrightLight,
  thin: CopyrightThin,
} as const

export const Copyright = (props: IconProps) => {
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
