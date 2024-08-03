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
        d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
        stroke={color} />

      <Path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke={color} />
      <Path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" stroke={color} />
      <Path d="M8 10h8" stroke={color} />
      <Path d="M8 18h8" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Backpack';

export const Backpack = React.memo<IconProps>(themed(Icon));