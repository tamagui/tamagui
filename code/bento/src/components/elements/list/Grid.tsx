/**
 *
 *  THIS COMPONENT IS REMOVED FROM BENTO
 *
 *
 */
// import {
//   Avatar,
//   Button,
//   Image,
//   Paragraph,
//   Separator,
//   SizableText,
//   Stack,
//   ThemeableStack,
//   XStack,
//   YStack,
// } from 'tamagui'

// const items = Array.from({ length: 20 }).map((_, index) => index)
// // spacers are a method to avoid streteched items at the end
// const someSpacers = Array.from({ length: 10 }).map((_, index) => index + 'a')
// /**
//  *  Note: if you have a lot of items, you can use a FlatList instead, Flatlist are more performant
//  *        we also have a FlatGrid component that uses FlatList check that
//  *
//  */
// export function Grid() {
//   return (
//     <XStack padding="$4" flexWrap="wrap" flexShrink={1} gap="$4">
//       {items.map((item, index) => (
//         <Item data={{ index }} key={item} />
//       ))}
//       {someSpacers.map((item, index) => (
//         <YStack key={item} flexBasis={300} flexGrow={1} flexShrink={1} />
//       ))}
//     </XStack>
//   )
// }

// Grid.fileName = 'Grid'

// function Item({ data }: { data: { index: number } }) {
//   const { index } = data
//   const PADDING = 16
//   return (
//     <ThemeableStack
//       overflow="hidden"
//       radiused
//       padding={PADDING}
//       bordered
//       gap="$3"
//       flexShrink={1}
//       flexGrow={1}
//       flexBasis={300}
//       backgrounded
//       elevation={1}
//       hoverStyle={{
//         elevation: 8,
//       }}
//     >
//       {/* minus margin can cancel padding */}
//       <Stack height="$14" marginHorizontal={-PADDING} marginTop={-PADDING}>
//         <Image
//           width="100%"
//           height="100%"
//           backgroundColor="$backgroundPress"
//           source={{ uri: `https://random.imagecdn.app/250/${150 + index}` }}
//         />
//       </Stack>
//       <Paragraph size="$2" theme="alt1">
//         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla nesciunt
//         asperiores corrupti! Optio soluta excepturi aut sint nam vero, libero at
//         repellendus
//       </Paragraph>
//       <Separator marginHorizontal={-PADDING} />
//       <XStack alignItems="center" gap="$4">
//         <Button size="$3" circular chromeless>
//           <Avatar circular>
//             <Avatar.Image
//               accessibilityLabel="Cam"
//               src={`/avatars/300 (1).jpeg`}
//             />
//             <Avatar.Fallback backgroundColor="$blue10" />
//           </Avatar>
//         </Button>
//         <YStack>
//           <SizableText size="$2">Photo posted by</SizableText>
//           <SizableText theme="alt2" size="$1">
//             someperson@something.com
//           </SizableText>
//         </YStack>
//       </XStack>
//     </ThemeableStack>
//   )
// }
