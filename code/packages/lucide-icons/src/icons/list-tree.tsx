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

      <Path d="M21 12h-8" stroke={color} />
      <Path d="M21 6H8" stroke={color} />
      <Path d="M21 18h-8" stroke={color} />
      <Path d="M3 6v4c0 1.1.9 2 2 2h3" stroke={color} />
      <Path d="M3 10v6c0 1.1.9 2 2 2h3" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ListTree';

export const ListTree = React.memo<IconProps>(themed(Icon));