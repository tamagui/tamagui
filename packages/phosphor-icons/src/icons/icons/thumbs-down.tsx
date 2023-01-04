import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThumbsDownBold } from '../bold/thumbs-down-bold'
import { ThumbsDownDuotone } from '../duotone/thumbs-down-duotone'
import { ThumbsDownFill } from '../fill/thumbs-down-fill'
import { ThumbsDownLight } from '../light/thumbs-down-light'
import { ThumbsDownRegular } from '../regular/thumbs-down-regular'
import { ThumbsDownThin } from '../thin/thumbs-down-thin'

const weightMap = {
  regular: ThumbsDownRegular,
  bold: ThumbsDownBold,
  duotone: ThumbsDownDuotone,
  fill: ThumbsDownFill,
  light: ThumbsDownLight,
  thin: ThumbsDownThin,
} as const

export const ThumbsDown = (props: IconProps) => {
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
