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
      <_Path d="M58,160H44a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8H58a32,32,0,0,0,0-64Zm0,48H52V176h6a16,16,0,0,1,0,32Zm72-48c-16.5,0-30,14.4-30,32s13.5,32,30,32,30-14.4,30-32S146.5,160,130,160Zm0,48c-7.7,0-14-7.2-14-16s6.3-16,14-16,14,7.2,14,16S137.7,208,130,208Zm87.9-2.8a8,8,0,0,1-.5,11.3A29.3,29.3,0,0,1,198,224c-16.5,0-30-14.4-30-32s13.5-32,30-32a29.3,29.3,0,0,1,19.4,7.5,8,8,0,0,1,.5,11.3,7.9,7.9,0,0,1-11.3.6A12.9,12.9,0,0,0,198,176c-7.7,0-14,7.2-14,16s6.3,16,14,16a12.9,12.9,0,0,0,8.6-3.4A7.9,7.9,0,0,1,217.9,205.2ZM48,136H208a8,8,0,0,0,8-8V88a8.1,8.1,0,0,0-2.3-5.7l-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40v88A8,8,0,0,0,48,136ZM152,44l44,44H152Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileDocFill'

export const FileDocFill = memo<IconProps>(themed(Icon))
