import * as React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}>

      <Path
        d="M10 10 4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-1.272-2.542"
        stroke={color} />

      <Path d="M10 2v2.343" stroke={color} />
      <Path d="M14 2v6.343" stroke={color} />
      <Path d="M8.5 2h7" stroke={color} />
      <Path d="M7 16h9" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>);

};

Icon.displayName = 'FlaskConicalOff';

export const FlaskConicalOff = React.memo<IconProps>(themed(Icon));