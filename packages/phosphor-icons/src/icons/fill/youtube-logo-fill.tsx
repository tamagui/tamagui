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
      <_Path d="M234.3,69.8a23.5,23.5,0,0,0-14.5-16.3C185.6,40.3,131,40.4,128,40.4s-57.6-.1-91.8,13.1A23.5,23.5,0,0,0,21.7,69.8C19.1,79.7,16,97.9,16,128s3.1,48.3,5.7,58.2a23.5,23.5,0,0,0,14.5,16.3c32.8,12.7,84.2,13.1,91.1,13.1h1.4c6.9,0,58.3-.4,91.1-13.1a23.5,23.5,0,0,0,14.5-16.3c2.6-9.9,5.7-28.1,5.7-58.2S236.9,79.7,234.3,69.8Zm-72.1,61.5-48,32a3.6,3.6,0,0,1-2.2.7,4.5,4.5,0,0,1-1.9-.5A3.9,3.9,0,0,1,108,160V96a3.9,3.9,0,0,1,2.1-3.5,4,4,0,0,1,4.1.2l48,32a3.9,3.9,0,0,1,0,6.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'YoutubeLogoFill'

export const YoutubeLogoFill = memo<IconProps>(themed(Icon))
