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
      <_Path d="M256,204a28,28,0,0,1-56,0c0-23,21.4-44.7,22.3-45.7a8.2,8.2,0,0,1,11.4,0C234.6,159.3,256,181,256,204ZM132.5,124.5a12,12,0,0,0,0-17,12.1,12.1,0,0,0-17,0,12,12,0,0,0,17,17Zm98.5-1a8.2,8.2,0,0,0-2.4-5.7L121.1,10.3a8,8,0,0,0-11.3,0L69.7,50.4l41,41a28,28,0,1,1-11.3,11.3l-41-41L13.7,106.5a24,24,0,0,0,0,34l84.8,84.8a24.1,24.1,0,0,0,34,0l96.1-96.2A8,8,0,0,0,231,123.5ZM43.5,24.2A8,8,0,0,0,32.2,35.5L58.4,61.7,69.7,50.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'PaintBucketFill'

export const PaintBucketFill = memo<IconProps>(themed(Icon))
