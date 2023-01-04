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
      <_Path d="M152,104a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H160A8,8,0,0,1,152,104Zm88,24H160a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Zm0,32H160a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Zm0,32H72a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM79.9,176A55.9,55.9,0,0,1,30.4,93.9,28,28,0,0,1,47.9,44a8.2,8.2,0,0,1,4.3,1.2L114,83.8A12,12,0,0,0,111.9,60a8,8,0,0,1,0-16,28,28,0,0,1,0,56,7.9,7.9,0,0,1-4.2-1.2l-30-18.7a40,40,0,0,0-5.8,79.1V114.5a8,8,0,0,1,8-8h0a8,8,0,0,1,8,8v44.7a40,40,0,0,0,30.9-29.5,7.9,7.9,0,0,1,9.6-5.8,8,8,0,0,1,5.9,9.6A56,56,0,0,1,79.9,176Zm-40-95.1A56.3,56.3,0,0,1,58.7,68.2l-12.8-8A12,12,0,0,0,35.9,72,11.8,11.8,0,0,0,39.9,80.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArticleNyTimesFill'

export const ArticleNyTimesFill = memo<IconProps>(themed(Icon))
