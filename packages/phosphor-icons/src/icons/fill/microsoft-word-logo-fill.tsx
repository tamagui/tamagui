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
      <_Path d="M200,24H72A16,16,0,0,0,56,40V64H40A16,16,0,0,0,24,80v96a16,16,0,0,0,16,16H56v24a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24ZM68.2,153.9l-12-48a8,8,0,0,1,15.6-3.8l6.3,25.4,6.6-14.7a8,8,0,0,1,14.6,0l6.6,14.7,6.3-25.4a8,8,0,1,1,15.6,3.8l-12,48a8.1,8.1,0,0,1-7.1,6.1H108a7.9,7.9,0,0,1-7.3-4.8L92,135.7l-8.7,19.5a8,8,0,0,1-8,4.8A8.1,8.1,0,0,1,68.2,153.9ZM200,216H72V192h72a16,16,0,0,0,16-16v-8h40Zm0-64H160V104h40Zm0-64H160V80a16,16,0,0,0-16-16H72V40H200Z" />
    </_Svg>
  )
}

Icon.displayName = 'MicrosoftWordLogoFill'

export const MicrosoftWordLogoFill = memo<IconProps>(themed(Icon))
