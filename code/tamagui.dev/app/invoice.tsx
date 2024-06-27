import { YStack, XStack, Text, H2, Spacer } from 'tamagui'

export const mode = 'spa'

export default function InvoicePage() {
  return (
    <>
      <YStack p={40}>
        <XStack jc="space-between" ai="center">
          <H2>Invoice</H2>
          <H2 theme="alt2">Tamagui LLC</H2>
        </XStack>
        <YStack mt={20}>
          <Text fow="bold">Invoice number: FE9BF9FB-DRAFT</Text>
          <Text>Date due: July 21, 2024</Text>
        </YStack>
        <XStack jc="space-between" mt={20}>
          <YStack w="48%">
            <Text fow="bold">Tamagui LLC</Text>
            <Text>348 Awakea Rd</Text>
            <Text>Kailua, Hawaii 96734</Text>
            <Text>United States</Text>
            <Text>support@tamagui.dev</Text>
          </YStack>
          <YStack w="48%">
            <Text fow="bold">Bill to</Text>
            <Text>Est Normalis OÜ</Text>
            <Text>FI-</Text>
            <Text>Finland</Text>
            <Text>jvpartanen@gmail.com</Text>
            <Text>EE VAT EE102370900</Text>
          </YStack>
        </XStack>
        <Text mt={20} fos={22} fow="bold">
          €186.86 EUR due July 21, 2024
        </Text>
        <YStack mt={20}>
          <XStack bbc="#ccc" bbw={1}>
            <Text w={200} f={1} p={8} fow="bold" bbc="#ccc" bbw={1}>
              Description
            </Text>
            <Text flex={1} p={8} fow="bold" bbc="#ccc" bbw={1}>
              Qty
            </Text>
            <Text flex={1} p={8} fow="bold" bbc="#ccc" bbw={1}>
              Unit price
            </Text>
            <Text flex={1} p={8} fow="bold" bbc="#ccc" bbw={1}>
              Amount
            </Text>
          </XStack>

          <XStack bbc="#ccc" bbw={1}>
            <Text w={200} f={1} p={8}>
              Bento
            </Text>
            <Text flex={1} p={8}>
              1
            </Text>
            <Text flex={1} p={8}>
              €186.86
            </Text>
            <Text flex={1} p={8}>
              €186.86
            </Text>
          </XStack>

          <Spacer size="$8" />

          <XStack bbc="#ccc" bbw={1}>
            <Text flex={3} p={8}></Text>
            <Text f={1} p={8}>
              Total
            </Text>
            <Text flex={1} p={8}></Text>
            <Text flex={1} p={8}>
              €186.86
            </Text>
          </XStack>
          <XStack bbc="#ccc" bbw={1}>
            <Text flex={3} p={8}></Text>
            <Text f={1} p={8}>
              Paid
            </Text>
            <Text flex={1} p={8}></Text>
            <Text flex={1} p={8}>
              - €186.86
            </Text>
          </XStack>
          <XStack>
            <Text flex={3} p={8}></Text>
            <Text f={1} p={8} fow="bold">
              Amount due
            </Text>
            <Text flex={1} p={8}></Text>
            <Text flex={1} p={8} fow="bold">
              €0.00 EUR
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </>
  )
}

// import { Check, Container } from '@tamagui/lucide-icons'
// import { memo, useState } from 'react'
// import {
//   Checkbox,
//   H1,
//   H3,
//   Input,
//   Stack,
//   Text,
//   XStack,
//   YStack,
//   styled,
//   useDidFinishSSR,
//   withStaticProperties,
// } from 'tamagui'
// import { ThemeToggle } from '~/features/site/theme/ThemeToggle'

// export default memo(() => {
//   const isHydrated = useDidFinishSSR()
//   const uid = isHydrated ? crypto.randomUUID() : 0
//   const date = new Date().toLocaleString()
//   const [purchaseAmt, setpurchaseAmt] = useState(0)
//   const [vatpct, setvatpct] = useState(0)

//   return (
//     <>
//       <YStack pos="absolute" b={0} r={0}>
//         <ThemeToggle />
//       </YStack>
//       <Container py="$6">
//         <YStack gap="$6">
//           <H1>Invoice: Tamagui</H1>

//           <DT>
//             <DT.Row>
//               <DT.Col bold>Invoice Number:</DT.Col>
//               <DT.Col>{uid}</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Invoice Date:</DT.Col>
//               <DT.Col>{date}</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Due Date:</DT.Col>
//               <DT.Col>{date}</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Invoice Status:</DT.Col>
//               <DT.Col>Paid ${purchaseAmt}</DT.Col>
//             </DT.Row>
//           </DT>

//           <DT>
//             <H3>Company</H3>
//             <DT.Row>
//               <DT.Col bold>Name:</DT.Col>
//               <DT.Col>Tamagui LLC</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Address:</DT.Col>
//               <DT.Col>438 Awakea Rd, Kailua HI, 96734, USA</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Phone:</DT.Col>
//               <DT.Col>+1 520-891-6668</DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Email:</DT.Col>
//               <DT.Col>support@tamagui.dev</DT.Col>
//             </DT.Row>
//           </DT>

//           <DT>
//             <H3>Billing & Delivery address</H3>
//             <DT.Row>
//               <DT.Col bold>Company:</DT.Col>
//               <DT.Input />
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Company VAT:</DT.Col>
//               <DT.Input />
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Address:</DT.Col>
//               <DT.Input />
//             </DT.Row>
//           </DT>

//           <DT>
//             <H3>Purchase</H3>
//             <DT.Row>
//               <DT.Col bold>Item:</DT.Col>
//               <DT.Col gap="$4">
//                 <XStack gap="$2">
//                   <Checkbox>
//                     <Checkbox.Indicator>
//                       <Check />
//                     </Checkbox.Indicator>
//                   </Checkbox>
//                   Tamagui Takeout
//                 </XStack>
//                 <XStack gap="$2">
//                   <Checkbox>
//                     <Checkbox.Indicator>
//                       <Check />
//                     </Checkbox.Indicator>
//                   </Checkbox>
//                   Tamagui Bento
//                 </XStack>
//               </DT.Col>
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Price:</DT.Col>
//               <DT.Input
//                 onChangeText={(text) => {
//                   setpurchaseAmt(parseFloat(text))
//                 }}
//               />
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Vat %:</DT.Col>
//               <DT.Input
//                 onChangeText={(text) => {
//                   setvatpct(parseFloat(text))
//                 }}
//               />
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Vat Amount:</DT.Col>
//               <DT.Input
//                 value={`${purchaseAmt && vatpct ? purchaseAmt * vatpct * 0.01 : 0}`}
//               />
//             </DT.Row>
//             <DT.Row>
//               <DT.Col bold>Total:</DT.Col>
//               <DT.Input
//                 value={`${purchaseAmt + purchaseAmt * vatpct * 0.01}`}
//                 fow="bold"
//               />
//             </DT.Row>
//           </DT>
//         </YStack>
//       </Container>
//     </>
//   )
// })

// const DT = withStaticProperties(
//   styled(Stack, {
//     borderWidth: 1,
//     borderColor: '$borderColor',
//     p: '$4',
//   }),
//   {
//     Col: styled(Text, {
//       p: '$4',
//       miw: '40%',

//       variants: {
//         bold: {
//           true: {
//             fow: 'bold',
//           },
//         },
//       } as const,
//     }),

//     Row: styled(Stack, {
//       fd: 'row',
//     }),

//     Input: styled(Input, {
//       unstyled: true,
//       fos: '$5',
//       w: 300,
//       p: '$4',
//       bbw: 1,
//       bc: '$borderColor',
//     }),
//   }
// )
