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
      <_Path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.6,67.2,48,64.9V108a8,8,0,0,0,16,0V52a7.9,7.9,0,0,0-3.8-6.8,8,8,0,0,0-7.8-.4l-16,8a8,8,0,1,0,7.2,14.4ZM72.2,170.3A21.5,21.5,0,0,0,76,158a22,22,0,0,0-42.3-8.6,8,8,0,0,0,14.8,6.3A5.8,5.8,0,0,1,54,152a6,6,0,0,1,6,6,5.7,5.7,0,0,1-.9,3.2l-25.5,34A8,8,0,0,0,40,208H68a8,8,0,0,0,0-16H56l16-21.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'ListNumbersFill'

export const ListNumbersFill = memo<IconProps>(themed(Icon))
