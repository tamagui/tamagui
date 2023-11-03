import { useColorScheme } from "react-native"
import React, { ReactNode, createContext, useContext, useState } from "react"
import { Theme, ThemeName } from "tamagui"

interface Theme {
	theme: ThemeName
	setTheme: React.Dispatch<React.SetStateAction<ThemeName>>
}

const ThemeContext = createContext<Theme>({
	theme: "light",
	setTheme: () => null,
})

const ThemeProvider = (props: { children: ReactNode }) => {
	const [theme, setTheme] = useState<ThemeName>(useColorScheme() as ThemeName)

	return (
		<ThemeContext.Provider value={{ theme: theme, setTheme }}>
			<Theme name={theme}>{props.children}</Theme>
		</ThemeContext.Provider>
	)
}

export default ThemeProvider

export const useTheme = () => {
	const context = useContext(ThemeContext)
	return {themeName: context.theme, setThemeName: context.setTheme}
}
