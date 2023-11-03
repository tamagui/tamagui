import { StyleSheet } from "react-native"

import EditScreenInfo from "../../components/EditScreenInfo"
import { Separator, Text, View } from "tamagui"
import { Title } from "../../components/Text/Title"

export default function TabOneScreen() {
	return (
		<View
			backgroundColor={"$background"}
			flex={1}
			alignItems="center"
			justifyContent="center"
		>
			<Title>Home</Title>
			<Separator />
			<EditScreenInfo path="app/(tabs)/index.tsx" />
		</View>
	)
}
