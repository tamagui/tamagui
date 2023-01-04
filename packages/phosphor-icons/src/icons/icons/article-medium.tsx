import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArticleMediumBold } from '../bold/article-medium-bold'
import { ArticleMediumDuotone } from '../duotone/article-medium-duotone'
import { ArticleMediumFill } from '../fill/article-medium-fill'
import { ArticleMediumLight } from '../light/article-medium-light'
import { ArticleMediumRegular } from '../regular/article-medium-regular'
import { ArticleMediumThin } from '../thin/article-medium-thin'

const weightMap = {
  regular: ArticleMediumRegular,
  bold: ArticleMediumBold,
  duotone: ArticleMediumDuotone,
  fill: ArticleMediumFill,
  light: ArticleMediumLight,
  thin: ArticleMediumThin,
} as const

export const ArticleMedium = (props: IconProps) => {
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
