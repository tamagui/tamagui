import React from "react";
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

      <Path d="M12 9a4 4 0 0 0-2 7.5" stroke={color} />
      <Path d="M12 3v2" stroke={color} />
      <Path d="m6.6 18.4-1.4 1.4" stroke={color} />
      <Path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" stroke={color} />
      <Path d="M4 13H2" stroke={color} />
      <Path d="M6.34 7.34 4.93 5.93" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ThermometerSun';

export const ThermometerSun = React.memo<IconProps>(themed(Icon));