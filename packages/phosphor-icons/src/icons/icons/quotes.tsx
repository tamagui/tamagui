import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { QuotesBold } from '../bold/quotes-bold'
import { QuotesDuotone } from '../duotone/quotes-duotone'
import { QuotesFill } from '../fill/quotes-fill'
import { QuotesLight } from '../light/quotes-light'
import { QuotesRegular } from '../regular/quotes-regular'
import { QuotesThin } from '../thin/quotes-thin'

const weightMap = {
  regular: QuotesRegular,
  bold: QuotesBold,
  duotone: QuotesDuotone,
  fill: QuotesFill,
  light: QuotesLight,
  thin: QuotesThin,
} as const

export const Quotes = (props: IconProps) => {
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
