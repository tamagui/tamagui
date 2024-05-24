// // // return (
// // //   <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
// // //     <XStack onPress={() => setOpen(!open)}>
// // //       <StyledButton
// // //         animation="bouncy"
// // //         debug="verbose"
// // //         disabled={open}
// // //         onPress={() => {
// // //           console.log('hi')
// // //           setOpen(!open)
// // //         }}
// // //       >
// // //         hello
// // //       </StyledButton>

// // //       <Button
// // //         onPress={() => {
// // //           console.log('hi')
// // //           setOpen(!open)
// // //         }}
// // //       >
// // //         hello123
// // //       </Button>
// // //     </XStack>
// // //   </RNView>
// // // )

// // return (
// //   <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
// //     <Image
// //       height="100%"
// //       position="absolute"
// //       resizeMode="cover"
// //       src="https://fastly.picsum.photos/id/526/500/300.jpg?hmac=GilOsrBNJ-eQBCy1R6YtGsHAki8i1VJ7T5N0R-SIFrk"
// //       width="100%"
// //     />
// //   </RNView>
// // )

// // return (
// //   <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
// //     <StyledAnimatedWithStyleProp
// //       animation="bouncy"
// //       debug="verbose"
// //       style={[{ height: 200, width: 200 }]}
// //     />
// //   </RNView>
// // )

// // return (
// //   <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
// //     <Square
// //       size={300}
// //       // disabled
// //       bg="red"
// //       debug="verbose"
// //       disabledStyle={{
// //         bg: 'black',
// //       }}
// //     />
// //   </RNView>
// // )

// // return (
// //   <>
// //     <ToastProvider>
// //       <ToastViewport zIndex={Number.MAX_SAFE_INTEGER} />
// //       <ToastDemo />
// //     </ToastProvider>

// //     <Button onPress={() => setOpen(true)}>Open</Button>

// //     <ReactNative.Modal
// //       visible={open}
// //       style={{
// //         backgroundColor: 'red',
// //       }}
// //     >
// //       <Square size={100} bg="red" />
// //       <Button onPress={() => setOpen(false)}>Close</Button>
// //     </ReactNative.Modal>
// //   </>
// // )

// // return (
// //   <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
// //     {/* <View
// //       style={{ transform: [{ translateX: 100 }] }}
// //       width={100}
// //       height={100}
// //       bg="red"
// //     />

// //     <Text maxWidth={300} numberOfLines={3} ellipsizeMode="middle" debug="verbose">
// //       Esse laborum veniam magna sunt nulla nisi proident nisi culpa. Aliquip sit duis
// //       tempor officia officia duis. Magna Lorem magna cupidatat consectetur dolor
// //       consequat. Nostrud cupidatat tempor consequat fugiat proident ullamco cillum non.
// //       Ipsum irure exercitation id enim reprehenderit id do esse fugiat voluptate minim
// //       cupidatat aute. Eu non est dolore incididunt esse quis. Esse voluptate eiusmod
// //       enim fugiat incididunt consectetur adipisicing ex anim cupidatat aliquip occaecat
// //       officia.
// //     </Text>

// //     <ReactNative.Text
// //       style={{ maxWidth: 300 }}
// //       numberOfLines={3}
// //       ellipsizeMode="middle"
// //     >
// //       Esse laborum veniam magna sunt nulla nisi proident nisi culpa. Aliquip sit duis
// //       tempor officia officia duis. Magna Lorem magna cupidatat consectetur dolor
// //       consequat. Nostrud cupidatat tempor consequat fugiat proident ullamco cillum non.
// //       Ipsum irure exercitation id enim reprehenderit id do esse fugiat voluptate minim
// //       cupidatat aute. Eu non est dolore incididunt esse quis. Esse voluptate eiusmod
// //       enim fugiat incididunt consectetur adipisicing ex anim cupidatat aliquip occaecat
// //       officia.
// //     </ReactNative.Text> */}

// //     {/* <TestAnimateToUndefinedBg
// //       cursor="pointer"
// //       hitSlop={defaultHitslopInset}
// //       pressStyle={{
// //         opacity: 0.5,
// //       }}
// //       hoverStyle={{
// //         backgroundColor: 'green',
// //       }}
// //       onPress={() => {}}
// //       onPressIn={() => {}}
// //     /> */}
// //     {/* <MyInputWrapper /> */}
// //     {/*
// //     <Test2
// //       debug="verbose"
// //       w={100}
// //       h={100}
// //       bg="red"
// //       style={{ transition: 'all ease-in' }}
// //     /> */}
// //   </RNView>
// // )
// const Demo = () => (
//   <View f={1} ai="center" jc="center">
//     <View
//       bg="$green7"
//       h={200}
//       w={200}
//       br={0}
//       animation="lazy"
//       pressStyle={{
//         scale: 0.75,
//         br: '$10',
//       }}
//     />
//   </View>
// )

// // animationKeyframes: {
// //   from: {
// //     opacity: 0,
// //     transform: [{ translateY: 50 }],
// //   },
// //   to: {
// //     opacity: 1,
// //     transform: [{ translateY: 0 }],
// //   },
// // },
// // animationDuration: '0.8s',
// // animationFillMode: 'both',
// // animationDelay: '800ms',

// const MyInput = styled(
//   TextInput,
//   {
//     placeholder: 'Test',
//     width: 200,
//     height: 50,
//     backgroundColor: 'red',
//   },
//   {
//     accept: { placeholderTextColor: 'color' },
//   }
// )

// function MyInputWrapper() {
//   return <MyInput debug="verbose" placeholderTextColor="$accentBackground" />
// }

// const TestAnimateToUndefinedBg = styled(View, {
//   w: 100,
//   h: 100,
//   animation: '100ms',
//   hoverStyle: {
//     backgroundColor: 'red',
//   },
// })

// const defaultHitslop = 5
// const defaultHitslopInset = {
//   top: defaultHitslop,
//   bottom: defaultHitslop,
//   left: defaultHitslop,
//   right: defaultHitslop,
// }

// // const StyledAnimatedWithStyleProp = styled(View, {
// //   backgroundColor: 'red',

// //   variants: {
// //     something: {
// //       '...size': (val, { tokens }) => {
// //         tokens.size[val]
// //         return {}
// //       },
// //     },
// //   },
// // })

// // const StyledButton = styled(Button, {
// //   variants: {
// //     disabled: {
// //       true: {
// //         backgroundColor: 'red',
// //       },
// //       false: {},
// //     },
// //   } as const,
// // })
