import { Stack } from "expo-router"
import { TamaguiProvider } from "tamagui"
import tamaguiConfig from "../tamagui.config"
import ThemeProvider, { useTheme } from "../components/ThemeProvider"

export default function RootLayout() {
	return (
		<TamaguiProvider config={tamaguiConfig}>
			<ThemeProvider>
				<RootLayoutNav />
			</ThemeProvider>
		</TamaguiProvider>
	)
}

function RootLayoutNav() {
	const theme = useTheme()

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="settings"
				options={{ headerTitle: "Settings", title: "Settings" }}
			/>
		</Stack>
	)
}
