import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilmStripBold } from '../bold/film-strip-bold'
import { FilmStripDuotone } from '../duotone/film-strip-duotone'
import { FilmStripFill } from '../fill/film-strip-fill'
import { FilmStripLight } from '../light/film-strip-light'
import { FilmStripRegular } from '../regular/film-strip-regular'
import { FilmStripThin } from '../thin/film-strip-thin'

const weightMap = {
  regular: FilmStripRegular,
  bold: FilmStripBold,
  duotone: FilmStripDuotone,
  fill: FilmStripFill,
  light: FilmStripLight,
  thin: FilmStripThin,
} as const

export const FilmStrip = (props: IconProps) => {
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
