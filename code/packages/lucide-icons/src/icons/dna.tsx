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

      <Path d="M2 15c6.667-6 13.333 0 20-6" stroke={color} />
      <Path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" stroke={color} />
      <Path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" stroke={color} />
      <Path d="m17 6-2.5-2.5" stroke={color} />
      <Path d="m14 8-1-1" stroke={color} />
      <Path d="m7 18 2.5 2.5" stroke={color} />
      <Path d="m3.5 14.5.5.5" stroke={color} />
      <Path d="m20 9 .5.5" stroke={color} />
      <Path d="m6.5 12.5 1 1" stroke={color} />
      <Path d="m16.5 10.5 1 1" stroke={color} />
      <Path d="m10 16 1.5 1.5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Dna';

export const Dna = React.memo<IconProps>(themed(Icon));