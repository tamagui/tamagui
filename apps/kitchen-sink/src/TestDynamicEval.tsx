// import { useTheme } from '@tamagui/core'
// import { SafeAreaView, ScrollView } from 'react-native'

// import Box from './components/Box'
// import Button from './components/Button'
// import Heading from './components/Heading'
// import ThemeSwitcher from './components/ThemeSwitcher'

// type Props = {
//   onSwitchTheme: () => void
// }

// const Home = ({ onSwitchTheme }: Props) => {
//   const theme = useTheme()

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
//       <Box flex={1} bg="$background" space="$0">
//         <Box py="$xs" fd="row" ai="center" px="$0" jc="space-between">
//           <Heading size="h1">Weather app</Heading>
//           <ThemeSwitcher onSwitch={onSwitchTheme} />
//         </Box>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <Box space="$3" px="$0">
//             <Button title="Hello" type="primary" centered />
//           </Box>
//         </ScrollView>
//       </Box>
//     </SafeAreaView>
//   )
// }

// export default Home
