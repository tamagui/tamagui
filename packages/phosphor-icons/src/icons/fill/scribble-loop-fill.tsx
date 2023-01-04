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
      <_Path d="M246.1,154.9c-1.2-1.5-22.9-27.1-59.8-41.4-2.1-17.8-8.9-34-19.6-46.6C151.7,49.3,130,40,104,40,52.5,40,18.9,86.2,17.5,88.1a8,8,0,0,0,13,9.4C30.8,97,60.8,56,104,56c21.2,0,38.6,7.4,50.5,21.3a68,68,0,0,1,14.7,30.8A134.2,134.2,0,0,0,136,104c-26.1,0-47.9,6.8-63.3,19.7C59.2,135.1,51.4,151,51.4,167.2a47.4,47.4,0,0,0,13.9,34.1c9.6,9.6,23,14.7,38.7,14.7,25.2,0,46.7-10,62.1-28.8,12.2-15,19.6-35.1,20.8-56a146.3,146.3,0,0,1,47,33.9,8,8,0,1,0,12.2-10.2ZM104,200c-25.3,0-36.6-16.4-36.6-32.8,0-22.7,21.5-47.2,68.6-47.2a117.3,117.3,0,0,1,35,5.3v.3C171,162.6,148,200,104,200Z" />
    </_Svg>
  )
}

Icon.displayName = 'ScribbleLoopFill'

export const ScribbleLoopFill = memo<IconProps>(themed(Icon))
