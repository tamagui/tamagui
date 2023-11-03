import { Settings, BadgeInfo, Home, User } from "@tamagui/lucide-icons"
import { Link, Tabs } from "expo-router"
import { Pressable, useColorScheme } from "react-native"

import Colors from "../../constants/Colors"
import { Label, Sheet, Text, View, getToken, useTheme } from "tamagui"
import ModalScreen from "../../components/modal"
import { useState } from "react"
import { Title } from "../../components/Text/Title"

export default function TabLayout() {
	const colorScheme = useColorScheme()
	const theme = useTheme()
	const [isSheetOpen, setIsSheetOpen] = useState(false)

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
					tabBarStyle: {
						backgroundColor: theme.backgroundStrong.val,
						borderTopWidth: 0,
					},
					headerStyle: { backgroundColor: theme.backgroundStrong.val },
					headerShadowVisible: false,
					tabBarShowLabel: false,
					headerTitle(props) {
						return <Title>{props.children}</Title>
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Home",
						tabBarIcon: ({ focused }) => (
							<Home color={focused ? "$color" : "$gray9"} />
						),
						headerRight: () => (
							<Pressable onPress={() => setIsSheetOpen(true)}>
								{({ pressed }) => (
									<BadgeInfo
										size={25}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
							</Pressable>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ focused }) => (
							<User color={focused ? "$color" : "$gray9"} />
						),
						headerRight: () => (
							<Link href={"/settings/"} asChild>
								<Pressable>
									{({ pressed }) => (
										<Settings
											size={25}
											style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
			</Tabs>

			<Sheet modal open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<Sheet.Overlay />
				<Sheet.Handle />
				<Sheet.Frame>
					<ModalScreen />
				</Sheet.Frame>
			</Sheet>
		</>
	)
}
