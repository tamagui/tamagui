import { createContext } from 'react'

import { useContext } from 'react'
import type { ThemeName } from 'tamagui'

export const ChatContext = createContext<{
  theme?: ThemeName
  setTheme: (theme: ThemeName) => void
}>({
  theme: undefined,
  setTheme: () => {},
})

export const useTheme = () => {
  return useContext(ChatContext)
}
