import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArticleBold } from '../bold/article-bold'
import { ArticleDuotone } from '../duotone/article-duotone'
import { ArticleFill } from '../fill/article-fill'
import { ArticleLight } from '../light/article-light'
import { ArticleRegular } from '../regular/article-regular'
import { ArticleThin } from '../thin/article-thin'

const weightMap = {
  regular: ArticleRegular,
  bold: ArticleBold,
  duotone: ArticleDuotone,
  fill: ArticleFill,
  light: ArticleLight,
  thin: ArticleThin,
} as const

export const Article = (props: IconProps) => {
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
