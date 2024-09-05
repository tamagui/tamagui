import React from "react";
import type { ColorSchemeName } from 'react-native';
import { Appearance } from 'react-native';

export const ThemeContext = React.createContext({
  value: Appearance.getColorScheme(),
  set(next: ColorSchemeName) {}
});

export const useThemeControl = () => {
  return React.useContext(ThemeContext);
};