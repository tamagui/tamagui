import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThumbsUpBold } from '../bold/thumbs-up-bold'
import { ThumbsUpDuotone } from '../duotone/thumbs-up-duotone'
import { ThumbsUpFill } from '../fill/thumbs-up-fill'
import { ThumbsUpLight } from '../light/thumbs-up-light'
import { ThumbsUpRegular } from '../regular/thumbs-up-regular'
import { ThumbsUpThin } from '../thin/thumbs-up-thin'

const weightMap = {
  regular: ThumbsUpRegular,
  bold: ThumbsUpBold,
  duotone: ThumbsUpDuotone,
  fill: ThumbsUpFill,
  light: ThumbsUpLight,
  thin: ThumbsUpThin,
} as const

export const ThumbsUp = (props: IconProps) => {
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
