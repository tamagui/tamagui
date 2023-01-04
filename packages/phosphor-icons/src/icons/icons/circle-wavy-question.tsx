import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleWavyQuestionBold } from '../bold/circle-wavy-question-bold'
import { CircleWavyQuestionDuotone } from '../duotone/circle-wavy-question-duotone'
import { CircleWavyQuestionFill } from '../fill/circle-wavy-question-fill'
import { CircleWavyQuestionLight } from '../light/circle-wavy-question-light'
import { CircleWavyQuestionRegular } from '../regular/circle-wavy-question-regular'
import { CircleWavyQuestionThin } from '../thin/circle-wavy-question-thin'

const weightMap = {
  regular: CircleWavyQuestionRegular,
  bold: CircleWavyQuestionBold,
  duotone: CircleWavyQuestionDuotone,
  fill: CircleWavyQuestionFill,
  light: CircleWavyQuestionLight,
  thin: CircleWavyQuestionThin,
} as const

export const CircleWavyQuestion = (props: IconProps) => {
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
