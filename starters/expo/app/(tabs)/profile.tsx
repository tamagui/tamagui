import { StyleSheet } from "react-native"

import EditScreenInfo from "../../components/EditScreenInfo"
import { Separator, Text, View } from "tamagui"
import { Title } from "../../components/Text/Title"

export default function TabTwoScreen() {
	return (
		<View
			flex={1}
			backgroundColor={"$background"}
			justifyContent="center"
			alignItems="center"
		>
			<Title>Profile</Title>
			<Separator />
			<EditScreenInfo path="app/(tabs)/profile.tsx" />
		</View>
	)
}
