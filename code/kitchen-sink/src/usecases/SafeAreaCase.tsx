// /**
//  * Test case for $safeAreaTop, $safeAreaBottom, $safeAreaLeft, $safeAreaRight tokens
//  * Tests that safe area tokens resolve correctly on native (via initialMetrics)
//  */

// import { Platform } from 'react-native'
// import { Text, View, XStack, YStack, Square, isWeb } from 'tamagui'
// import { getSafeArea } from '@tamagui/native'

// function SafeAreaStatus() {
//   const safeAreaState = getSafeArea().state
//   const initialInsets = getSafeArea().getInsets()

//   return (
//     <YStack padding="$3" bg="$backgroundHover" borderRadius="$2" gap="$2">
//       <Text fontWeight="bold">Safe Area Status:</Text>
//       <XStack gap="$2" alignItems="center">
//         <Square
//           size={12}
//           borderRadius={6}
//           bg={safeAreaState.enabled ? '$green10' : '$red10'}
//         />
//         <Text testID="safe-area-status">
//           {safeAreaState.enabled ? 'Enabled' : 'Not enabled'}
//         </Text>
//       </XStack>
//       <Text fontSize="$2" color="$colorHover">
//         platform: {Platform.OS}
//       </Text>
//       <Text fontSize="$2" color="$colorHover" testID="initial-insets">
//         initial insets: top={initialInsets.top}, bottom={initialInsets.bottom},
//         left={initialInsets.left}, right={initialInsets.right}
//       </Text>
//     </YStack>
//   )
// }

// function TokenDemo() {
//   // these use the $safeAreaTop/Bottom/Left/Right tokens
//   // on native, they resolve to numeric values from initialMetrics
//   // on web, they resolve to env(safe-area-inset-*) CSS values
//   return (
//     <YStack gap="$3">
//       <Text fontWeight="bold">Safe Area Token Demo:</Text>
//       <Text fontSize="$2" color="$colorHover">
//         Using $safeAreaTop, $safeAreaBottom, $safeAreaLeft, $safeAreaRight tokens
//       </Text>

//       {/* paddingTop using $safeAreaTop token */}
//       <View
//         testID="token-padding-top"
//         paddingTop="$safeAreaTop"
//         bg="$red5"
//         padding="$2"
//       >
//         <Text>paddingTop: $safeAreaTop</Text>
//       </View>

//       {/* paddingBottom using $safeAreaBottom token */}
//       <View
//         testID="token-padding-bottom"
//         paddingBottom="$safeAreaBottom"
//         bg="$blue5"
//         padding="$2"
//       >
//         <Text>paddingBottom: $safeAreaBottom</Text>
//       </View>

//       {/* marginLeft using $safeAreaLeft token */}
//       <View
//         testID="token-margin-left"
//         marginLeft="$safeAreaLeft"
//         bg="$green5"
//         padding="$2"
//       >
//         <Text>marginLeft: $safeAreaLeft</Text>
//       </View>

//       {/* marginRight using $safeAreaRight token */}
//       <View
//         testID="token-margin-right"
//         marginRight="$safeAreaRight"
//         bg="$yellow5"
//         padding="$2"
//       >
//         <Text>marginRight: $safeAreaRight</Text>
//       </View>

//       {/* combined usage */}
//       <View
//         testID="token-combined"
//         paddingTop="$safeAreaTop"
//         paddingBottom="$safeAreaBottom"
//         paddingLeft="$safeAreaLeft"
//         paddingRight="$safeAreaRight"
//         bg="$purple5"
//         padding="$2"
//       >
//         <Text>all safe area tokens combined</Text>
//       </View>
//     </YStack>
//   )
// }

// function EdgeToEdgeDemo() {
//   const insets = getSafeArea().getInsets()

//   return (
//     <YStack gap="$2">
//       <Text fontWeight="bold">Edge-to-Edge Demo:</Text>
//       <Text fontSize="$2" color="$colorHover">
//         Visual representation of safe area insets (from initialMetrics)
//       </Text>

//       {/* visual representation of safe areas */}
//       <YStack
//         position="relative"
//         height={200}
//         bg="$background"
//         borderWidth={1}
//         borderColor="$borderColor"
//         borderRadius="$2"
//         overflow="hidden"
//       >
//         {/* top safe area */}
//         <Square
//           testID="safe-area-top-bar"
//           position="absolute"
//           top={0}
//           left={0}
//           right={0}
//           height={Math.max(insets.top, 20)}
//           bg="$red10"
//           opacity={0.5}
//         />

//         {/* bottom safe area */}
//         <Square
//           testID="safe-area-bottom-bar"
//           position="absolute"
//           bottom={0}
//           left={0}
//           right={0}
//           height={Math.max(insets.bottom, 20)}
//           bg="$blue10"
//           opacity={0.5}
//         />

//         {/* left safe area */}
//         <Square
//           testID="safe-area-left-bar"
//           position="absolute"
//           top={0}
//           bottom={0}
//           left={0}
//           width={Math.max(insets.left, 10)}
//           bg="$green10"
//           opacity={0.5}
//         />

//         {/* right safe area */}
//         <Square
//           testID="safe-area-right-bar"
//           position="absolute"
//           top={0}
//           bottom={0}
//           right={0}
//           width={Math.max(insets.right, 10)}
//           bg="$yellow10"
//           opacity={0.5}
//         />

//         {/* content area */}
//         <YStack
//           position="absolute"
//           top={Math.max(insets.top, 20)}
//           bottom={Math.max(insets.bottom, 20)}
//           left={Math.max(insets.left, 10)}
//           right={Math.max(insets.right, 10)}
//           alignItems="center"
//           justifyContent="center"
//         >
//           <Text fontSize="$3" textAlign="center">
//             Safe Content Area
//           </Text>
//         </YStack>
//       </YStack>

//       <XStack gap="$2" flexWrap="wrap">
//         <XStack gap="$1" alignItems="center">
//           <Square size={12} bg="$red10" borderRadius={2} />
//           <Text fontSize="$2">Top</Text>
//         </XStack>
//         <XStack gap="$1" alignItems="center">
//           <Square size={12} bg="$blue10" borderRadius={2} />
//           <Text fontSize="$2">Bottom</Text>
//         </XStack>
//         <XStack gap="$1" alignItems="center">
//           <Square size={12} bg="$green10" borderRadius={2} />
//           <Text fontSize="$2">Left</Text>
//         </XStack>
//         <XStack gap="$1" alignItems="center">
//           <Square size={12} bg="$yellow10" borderRadius={2} />
//           <Text fontSize="$2">Right</Text>
//         </XStack>
//       </XStack>
//     </YStack>
//   )
// }

// export function SafeAreaCase() {
//   return (
//     <YStack padding="$4" gap="$4" flex={1} testID="safe-area-case">
//       <Text fontWeight="bold" fontSize="$6">
//         Safe Area Token Integration
//       </Text>

//       <SafeAreaStatus />
//       <TokenDemo />
//       <EdgeToEdgeDemo />

//       {isWeb && (
//         <YStack padding="$3" bg="$yellow2" borderRadius="$2" gap="$2">
//           <Text fontWeight="bold" color="$yellow11">
//             Web Note:
//           </Text>
//           <Text fontSize="$2" color="$yellow11">
//             On web, $safeArea* tokens resolve to CSS env(safe-area-inset-*).
//             The visual demo above uses getSafeArea().getInsets() which returns
//             zeros on web (use CSS env() for actual web safe areas).
//           </Text>
//         </YStack>
//       )}
//     </YStack>
//   )
// }
