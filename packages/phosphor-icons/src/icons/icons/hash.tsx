import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HashBold } from '../bold/hash-bold'
import { HashDuotone } from '../duotone/hash-duotone'
import { HashFill } from '../fill/hash-fill'
import { HashLight } from '../light/hash-light'
import { HashRegular } from '../regular/hash-regular'
import { HashThin } from '../thin/hash-thin'

const weightMap = {
  regular: HashRegular,
  bold: HashBold,
  duotone: HashDuotone,
  fill: HashFill,
  light: HashLight,
  thin: HashThin,
} as const

export const Hash = (props: IconProps) => {
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
