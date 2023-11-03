import { View, Text } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { useTheme } from 'tamagui'
import { Title } from '../../components/Text/Title'

const SettingsLayout = () => {
	const theme = useTheme()

	return (
		<>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: theme.backgroundStrong.val },
					headerShadowVisible: false,
					headerTitle(props) {
						return <Title>{props.children}</Title>
					},
				}}
			/>
			<Slot/>
		</>
	)
}

export default SettingsLayout