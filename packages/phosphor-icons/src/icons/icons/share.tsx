import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShareBold } from '../bold/share-bold'
import { ShareDuotone } from '../duotone/share-duotone'
import { ShareFill } from '../fill/share-fill'
import { ShareLight } from '../light/share-light'
import { ShareRegular } from '../regular/share-regular'
import { ShareThin } from '../thin/share-thin'

const weightMap = {
  regular: ShareRegular,
  bold: ShareBold,
  duotone: ShareDuotone,
  fill: ShareFill,
  light: ShareLight,
  thin: ShareThin,
} as const

export const Share = (props: IconProps) => {
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
