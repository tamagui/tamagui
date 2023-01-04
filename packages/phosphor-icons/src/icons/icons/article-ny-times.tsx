import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArticleNyTimesBold } from '../bold/article-ny-times-bold'
import { ArticleNyTimesDuotone } from '../duotone/article-ny-times-duotone'
import { ArticleNyTimesFill } from '../fill/article-ny-times-fill'
import { ArticleNyTimesLight } from '../light/article-ny-times-light'
import { ArticleNyTimesRegular } from '../regular/article-ny-times-regular'
import { ArticleNyTimesThin } from '../thin/article-ny-times-thin'

const weightMap = {
  regular: ArticleNyTimesRegular,
  bold: ArticleNyTimesBold,
  duotone: ArticleNyTimesDuotone,
  fill: ArticleNyTimesFill,
  light: ArticleNyTimesLight,
  thin: ArticleNyTimesThin,
} as const

export const ArticleNyTimes = (props: IconProps) => {
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
