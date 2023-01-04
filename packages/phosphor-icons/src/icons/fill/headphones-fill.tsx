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
      <_Path d="M202.7,62.2A103.1,103.1,0,0,0,129.5,32h-.8A104,104,0,0,0,24,136v56a24.1,24.1,0,0,0,24,24H64a24.1,24.1,0,0,0,24-24V152a24.1,24.1,0,0,0-24-24H40.4a87.8,87.8,0,0,1,88.3-80h.1a88,88,0,0,1,88.3,80H193.5a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h16a24.1,24.1,0,0,0,24-24V136A103.5,103.5,0,0,0,202.7,62.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'HeadphonesFill'

export const HeadphonesFill = memo<IconProps>(themed(Icon))
