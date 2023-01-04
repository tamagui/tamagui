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
      <_Path d="M168,224a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h56A8,8,0,0,1,168,224Zm-40-32a8,8,0,0,0-8-8H72a8,8,0,0,0,0,16h48A8,8,0,0,0,128,192Zm56-8H160a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM159.3,16.1A76.1,76.1,0,0,0,85,64.8h0a76.4,76.4,0,0,0-5,26.9,8.3,8.3,0,0,1-7.4,8.3A8,8,0,0,1,64,92a88.2,88.2,0,0,1,2.5-21.1,4,4,0,0,0-5-4.8A52,52,0,0,0,24,116.3C24.2,145,48.1,168,76.8,168H156a76,76,0,0,0,3.3-151.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'CloudFogFill'

export const CloudFogFill = memo<IconProps>(themed(Icon))
