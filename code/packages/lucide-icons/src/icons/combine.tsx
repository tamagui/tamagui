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

      <Rect width="8" height="8" x="2" y="2" rx="2" stroke={color} />
      <Path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" stroke={color} />
      <Path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" stroke={color} />
      <Path d="M10 18H5c-1.7 0-3-1.3-3-3v-1" stroke={color} />
      <Polyline points="7 21 10 18 7 15" stroke={color} />
      <Rect width="8" height="8" x="14" y="14" rx="2" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Combine';

export const Combine = React.memo<IconProps>(themed(Icon));