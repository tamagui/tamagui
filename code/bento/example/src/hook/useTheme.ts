import { useColorScheme } from 'react-native'
import * as color from '../theme/color'

export default function useTheme() {
  const colorScheme = useColorScheme() as keyof typeof color

  return color[colorScheme]
}
