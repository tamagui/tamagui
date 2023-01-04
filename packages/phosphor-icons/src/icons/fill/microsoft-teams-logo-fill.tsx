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
      <_Path d="M219.3,80h-4.5A33.5,33.5,0,0,0,220,62a34,34,0,0,0-51.4-29.2A40,40,0,0,0,96,56a42.6,42.6,0,0,0,.8,8H40A16,16,0,0,0,24,80v96a16,16,0,0,0,16,16H76.7a64,64,0,0,0,118.7-.2A40,40,0,0,0,232,152V92.7A12.7,12.7,0,0,0,219.3,80ZM136,32a24.1,24.1,0,0,1,24,24,24.3,24.3,0,0,1-4.1,13.4A15.9,15.9,0,0,0,144,64H113.4a24.5,24.5,0,0,1-1.4-8A24.1,24.1,0,0,1,136,32ZM84,152V112H74a8,8,0,0,1,0-16h36a8,8,0,0,1,0,16H100v40a8,8,0,0,1-16,0Zm100,16a48,48,0,0,1-48,48,48.5,48.5,0,0,1-41.6-24H144a16,16,0,0,0,16-16V96h24Zm2-88a18,18,0,0,1-14-6.7A39.2,39.2,0,0,0,176,56a37.7,37.7,0,0,0-.9-8.3A17.7,17.7,0,0,1,186,44a18,18,0,0,1,0,36Zm30,72a24,24,0,0,1-16.4,22.7,49.2,49.2,0,0,0,.4-6.7V96h16Z" />
    </_Svg>
  )
}

Icon.displayName = 'MicrosoftTeamsLogoFill'

export const MicrosoftTeamsLogoFill = memo<IconProps>(themed(Icon))
