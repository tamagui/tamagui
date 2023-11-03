import React from "react"
import { Stack } from "expo-router"
import { useTheme, View, Text, XStack, Label, Switch } from "tamagui"
import { useTheme as useAppTheme } from "../../components/ThemeProvider"
import { Title } from "../../components/Text/Title"
import { Moon, Sun } from "@tamagui/lucide-icons"

const SettingsScreen = () => {
	const theme = useTheme()
	const { themeName, setThemeName } = useAppTheme()

	return (
		<View flex={1} backgroundColor={"$background"} padding="$6">
			<XStack justifyContent="space-between" alignItems="center">
				<Label fontSize={'$6'}>Theme</Label>

				<XStack alignItems="center" space="$2">
					<Sun />
					<Switch
						checked={themeName === "dark"}
						onCheckedChange={(val) => setThemeName(val ? "dark" : "light")}
					>
						<Switch.Thumb animation={"bouncy"} />
					</Switch>
					<Moon />
				</XStack>
			</XStack>
		</View>
	)
}

export default SettingsScreen
