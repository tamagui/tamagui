import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M232,128A104.1,104.1,0,0,0,128,24,104.1,104.1,0,0,0,24,128,104.1,104.1,0,0,0,128,232h.1A104.1,104.1,0,0,0,232,128ZM49.2,88.9l51.2,9.4L46.7,161.5A88,88,0,0,1,49.2,88.9Zm160.1,5.6a88,88,0,0,1-2.5,72.6l-51.2-9.4Zm-8-15.2L167.6,119l-28-78.2a86.8,86.8,0,0,1,50.6,25A88.5,88.5,0,0,1,201.3,79.3ZM122.4,40.2l17.5,49L58.3,74.3a99.2,99.2,0,0,1,7.5-8.5A87.1,87.1,0,0,1,122.4,40.2ZM54.7,176.7,88.4,137l28,78.2a86.8,86.8,0,0,1-50.6-25A88.5,88.5,0,0,1,54.7,176.7Zm78.9,39.1-17.5-49,23,4.2h.1l58.5,10.7a99.2,99.2,0,0,1-7.5,8.5A87.1,87.1,0,0,1,133.6,215.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'ApertureFill'

export const ApertureFill = memo<IconProps>(themed(Icon))
