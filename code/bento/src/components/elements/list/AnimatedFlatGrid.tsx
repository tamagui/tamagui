/**
 *
 *  THIS COMPONENT IS REMOVED FROM BENTO
 *
 *
 */
// import { useContainerDim } from '../../../hooks/useContainerDim'
// import { useEffect, useState } from 'react'
// import { FlatList } from 'react-native'
// import {
//   Avatar,
//   Button,
//   Image,
//   Paragraph,
//   Separator,
//   Text,
//   View,
//   styled,
//   useWindowDimensions,
// } from 'tamagui'

// const items = Array.from({ length: 100 }).map((_, index) => index)

// const List = styled(FlatList, {
//   padding: 12,
//   gap: '$4',
// })

// /** ------ EXAMPLE ------ */
// export function AnimatedFlatGrid() {
//   const [baseWidth, setBaseWidth] = useState(300)
//   const [padding, setPadding] = useState(12)

//   const renderItem = ({ item, index }) => {
//     return <Item index={index} data={{ index }} key={item} />
//   }

//   const { height: screenHeight } = useWindowDimensions()
//   // Note: you can merge this hook with the line above
//   const { width: deviceWidth } = useContainerDim('window')

//   const numberOfColumns = Math.round((deviceWidth - padding) / baseWidth)

//   return (
//     <View flexDirection="column" width={deviceWidth} height={screenHeight}>
//       {deviceWidth && (
//         <List
//           {...(numberOfColumns > 1 && {
//             columnWrapperStyle: {
//               gap: 12,
//             },
//           })}
//           padding={padding}
//           numColumns={numberOfColumns}
//           key={numberOfColumns}
//           data={items}
//           renderItem={renderItem}
//           height="100%"
//         />
//       )}
//     </View>
//   )
// }

// AnimatedFlatGrid.fileName = 'AnimatedFlatGrid'

// function Item({ data }: { data: { index: number }; index: number }) {
//   const { index } = data
//   const PADDING = 16
//   const [mount, setMount] = useState(false)
//   useEffect(() => {
//     setTimeout(() => {
//       setMount(true)
//     }, 500)
//   }, [])
//   if (!mount) return null
//   return (
//     <View
//       overflow="hidden"
//       borderRadius={100}
//       padding={PADDING}
//       borderColor="$borderColor"
//       gap="$3"
//       flexShrink={1}
//       flexGrow={1}
//       flexBasis={300}
//       backgroundColor="$background"
//       elevation={1}
//       shadowColor="#000"
//       shadowOffset={{
//         width: 0,
//         height: 1,
//       }}
//       shadowOpacity={0.18}
//       shadowRadius={1.0}
//       elevationAndroid={1}
//       hoverStyle={{
//         shadowColor: '$shadowColor',
//         shadowOffset: {
//           width: 0,
//           height: 4,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 4.65,
//         //@ts-ignore
//         elevationAndroid: 8,
//       }}
//       marginBottom={12}
//       animation="medium"
//       y={0}
//       opacity={1}
//       enterStyle={{
//         y: 100,
//         opacity: 0,
//       }}
//     >
//       {/* minus margin can cancel padding */}
//       <View height="$14" marginHorizontal={-PADDING} marginTop={-PADDING}>
//         <Image
//           width="100%"
//           height="100%"
//           backgroundColor="$backgroundPress"
//           source={{ uri: `https://random.imagecdn.app/250/${150 + index}` }}
//         />
//       </View>
//       <Paragraph size="$2" theme="alt1">
//         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla nesciunt
//         asperiores corrupti! Optio soluta excepturi aut sint nam vero, libero at
//         repellendus
//       </Paragraph>
//       <Separator marginHorizontal={-PADDING} />
//       <View flexDirection="row" alignItems="center" gap="$4">
//         <Button size="$3" circular chromeless>
//           <Avatar circular>
//             <Avatar.Image
//               accessibilityLabel="Cam"
//               src={`/avatars/300 (1).jpeg`}
//             />
//             <Avatar.Fallback backgroundColor="$blue10" />
//           </Avatar>
//         </Button>
//         <View flexDirection="column">
//           <Text fontWeight="$2" lineHeight="$2" fontSize="$2">
//             Photo posted by
//           </Text>
//           <Text theme="alt1" fontWeight="$1" lineHeight="$1" fontSize="$1">
//             someperson@something.com
//           </Text>
//         </View>
//       </View>
//     </View>
//   )
// }
