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

      <Path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" stroke={color} />
      <Path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" stroke={color} />
      <Path d="M2 21h20" stroke={color} />
      <Path d="M7 8v3" stroke={color} />
      <Path d="M12 8v3" stroke={color} />
      <Path d="M17 8v3" stroke={color} />
      <Path d="M7 4h0.01" stroke={color} />
      <Path d="M12 4h0.01" stroke={color} />
      <Path d="M17 4h0.01" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Cake';

export const Cake = React.memo<IconProps>(themed(Icon));