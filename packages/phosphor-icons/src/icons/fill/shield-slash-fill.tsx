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
      <_Path d="M227.9,237.9a8.2,8.2,0,0,1-5.4,2.1,8,8,0,0,1-5.9-2.6l-29.2-32.1A146.4,146.4,0,0,1,133,238.8a14.3,14.3,0,0,1-10,0c-15.2-5-91-34.7-91-124.1V56a15.9,15.9,0,0,1,7.5-13.5L27.6,29.4a7.9,7.9,0,0,1,.5-11.3,8,8,0,0,1,11.3.5l21.8,24h0L193.5,188.1h0l34.9,38.4A8,8,0,0,1,227.9,237.9Zm-28.3-66.8a7.9,7.9,0,0,0,5.9,2.6h1.3a7.9,7.9,0,0,0,6-4.6c7.4-16.3,11.2-34.6,11.2-54.3V56a16,16,0,0,0-16-16H98.5a8.1,8.1,0,0,0-7.3,4.8,8,8,0,0,0,1.4,8.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShieldSlashFill'

export const ShieldSlashFill = memo<IconProps>(themed(Icon))
